"use client"
import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

export default function useIndexData() {
  const [loading,setLoading] = useState(false);
  const [data,setData] =useState([]);
  const indexData = async (url)=>{
     const token = localStorage.getItem("token");
     setLoading(true);
     try{
       const getData = await axios.get(url,{
         headers:{
            Authorization: `Bearer ${token}`
         }
       })
       setData(getData.data);
     }catch(err){
       toast.error(err.message)
     }finally{
        setLoading(false)
     }
  }
  return {indexData,loading,data,setData};
}
