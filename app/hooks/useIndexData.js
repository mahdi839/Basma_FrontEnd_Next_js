"use client"
import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

export default function useIndexData() {
  const [loading,setLoading] = useState(false);
  const [data,setData] =useState(
   {
    data: [],          // Actual items
    links: {},         // Pagination links
    meta: {} 
   }
  );
  const indexData = async (url,params = {})=>{
     const token = localStorage.getItem("token");
     setLoading(true);
     try{
       const response = await axios.get(url,{
         headers:{
            Authorization: `Bearer ${token}`
         },
         params
       })
       setData({
        data: response.data.data || [],
        links: response.data.links || {},
        meta: response.data.meta || {}
       });
     }catch(err){
       toast.error(err.response?.data?.message || err.message)
     }finally{
        setLoading(false)
     }
  }
  return {indexData,loading,data,setData};
}
