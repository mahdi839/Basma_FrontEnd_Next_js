import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

export default function useUpdateData() {
    const [loading,setLoading] = useState(false)
   
    const updateData = async (url,data) =>{
      const token = localStorage.getItem('token')
        setLoading(true)
        try{
          await axios.put(url,data,{
              headers:{
                 'Authorization': `Bearer ${token}`
              }
          });
          toast.success("successfully Updated")
        }catch(err){
          toast.error(err.message)
        }finally{
            setLoading(false)
        }
    }
  
    return {updateData}
}
