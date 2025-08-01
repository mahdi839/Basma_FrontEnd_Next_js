"use client"
import axios from 'axios'
import React, { useState } from 'react'
import Swal from 'sweetalert2'

export default function useStoreData() {
    const [loading,setLoading] = useState(false)
    const [errors, setErrors] = useState({});
  const storeData = async (url,data,successMsg) =>{
    const token = localStorage.getItem('token')
      setLoading(true)
      setErrors({}); // Reset errors before new request
      try{
        await axios.post(url,data,{
            headers:{
               'Authorization': `Bearer ${token}`
            }
        });
         Swal.fire({
            title:successMsg,
            icon:'success',
            showConfirmButton:false,
            timer:1500
        })
      }catch(err){
        if (err.response?.status === 422) {
          // Laravel validation errors
          setErrors(err.response.data.errors);
          
          // Show general error in toast
          const firstError = Object.values(err.response.data.errors)[0][0];
          Swal.fire({
            'title':'Oops! Please Check',
             'text': firstError,
             'icon': 'error'
          })
          
        } else {
          const errorMessage =
                  err.response?.data?.message || 
                  err.response?.data?.error || 
                  err.message;
                Swal.fire({
                  'title':'Oops! Please Check',
                    'text': errorMessage,
                    'icon': 'error'
                })
        }
      }
      finally{
        setLoading(false);
      }
  }

  return {storeData,loading}
}
