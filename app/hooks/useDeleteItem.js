import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function useDeleteItem() {
    const [deleteLoading,setDeleteLoading] =useState(false);
   async function handleDeleteData (url){
         
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: " Delete",
        });
    
        if (!result.isConfirmed) return;
        const token = localStorage.getItem("token");
        setDeleteLoading(true);
        try{
           await axios.delete(url,{
                headers:{
                    Authorization: `Bearer ${token}`
                 },
            })

            Swal.fire({
                title:'successfully Deleted',
                icon:'success',
                showConfirmButton:false,
                timer:1500
            })
        }catch(err){
            toast.error(err.message)
        }finally{
            setDeleteLoading(false)
        }
    }

    return {handleDeleteData,deleteLoading}
}
