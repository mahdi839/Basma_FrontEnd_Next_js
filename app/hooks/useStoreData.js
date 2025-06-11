"use client"
import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

export default function useStoreData() {
    const [loading,setLoading] = useState(false)
   
  const storeData = async (url,data) =>{
    const token = localStorage.getItem('token')
      setLoading(true)
      try{
        await axios.post(url,data,{
            headers:{
               'Authorization': `Bearer ${token}`
            }
        });
        toast.success("successfully Added")
      }catch(err){
        toast.error(err.message)
      }
  }

  return {storeData,loading}
}
