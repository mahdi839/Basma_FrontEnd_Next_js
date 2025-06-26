"use client"

import Button from '@/app/components/dashboard/components/button/Button';
import PageLoader from '@/app/components/loader/pageLoader';
import useIndexData from '@/app/hooks/useIndexData';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FaEdit, FaSpinner, FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
export default function Page() {
   
      const {indexData,setData,data,loading} = useIndexData()
       const url = process.env.BACKEND_URL + "api/shipping-costs"

       useEffect(()=>{
          indexData(url)
       },[])

    async function handleDelete(id) {
        const token = localStorage.getItem('token')
        const url = process.env.BACKEND_URL + `api/shipping-costs/${id}`
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
        try {
            await axios.delete(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            Swal.fire({
                title: "Successfully Deleted",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });
        } catch (err) {
            toast.error(err.message)
        }
         // Update state to remove deleted category
         setData(prev => prev.filter(single => single.id !== id));
    }
     if (loading) {
        return <PageLoader />
      }
    return (
        <div className="container-fluid my-5">
     <Link href="/dashboard/shipping/add">
      <Button className='mb-3'>Add Shipping Cost</Button>
    </Link>
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th className="text-center">Id</th>
                    <th className="text-center">Inside Dhaka</th>
                    <th className="text-center">Outside Dhaka</th>
                    <th className="text-center">One Shipping Cost</th>
                    <th className="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.data.length === 0 ? (
                    <tr>
                        <td colSpan="4" className="text-center text-danger">
                            No Shipping Cost Available
                        </td>
                    </tr>
                ) : (
                    data.data.map((singleData) => (
                        <tr key={singleData.id}>
                            <td className="text-center">{singleData.id}</td>
                            <td className="text-center">{singleData.inside_dhaka}</td>
                            <td className="text-center">{singleData.outside_dhaka}</td>
                            <td className="text-center">{singleData.one_shipping_cost||0}</td>
                            <td className="text-center">
                                <span className="d-flex gap-3 justify-content-center ">
                                    <Link href={`/dashboard/shipping/edit/${singleData.id}`}>
                                        <FaEdit className="text-dark" />
                                    </Link>
                                    <FaTrash className="text-danger mt-2" onClick={()=>handleDelete(singleData.id)}  />
                                </span>
                            </td>

                        </tr>
                    ))
                )}
            </tbody>
        </table>
        </div>
    )
}
