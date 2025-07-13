'use client'
import PageLoader from '@/app/components/loader/pageLoader';
import useDeleteItem from '@/app/hooks/useDeleteItem';
import useIndexData from '@/app/hooks/useIndexData'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa';
import Pagination from '../orders/components/Pagination';

export default function page() {
  const [page, setPage] = useState(1);

  const {indexData,loading,data,setData,pagination,setPagination} = useIndexData();
  const slotUrl = process.env.BACKEND_URL + `api/product-slots?page=${page}`;
  useEffect(()=>{
     indexData(slotUrl)
  },[page])
  
  const {handleDeleteData,deleteLoading} = useDeleteItem();
   function handleDelete (id){
      const url = process.env.BACKEND_URL + `api/product-slots/${id}`
      
      handleDeleteData(url)
      setData(
        {
          ...data,
          data:data.data.filter((slot)=> slot.id !=id)
        }
        )
      
   }

  if(loading){
    return <PageLoader />
  }
  return (
    <div className='container-fluid my-5'>
      <Link href="/dashboard/slots/add">
         <button className='dashboard-btn mb-3'>Create Slot</button>
      </Link>
         <table className="table table-bordered">
      <thead>
        <tr>
          <th className="text-center">#</th>
          <th className="text-center">Slot Name</th>
          <th className="text-center">Priority</th>
          <th className="text-center">Products</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.data.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center text-danger">
              No Slot Available
            </td>
          </tr>
        ) : (
          data.data.map((slot,index) => (
            <tr key={slot.id}>
              <td className="text-center">{index+1}</td>
              <td className="text-center">{slot.slot_name}</td>
              <td className="text-center">{slot.priority}</td>
              
                  <td className="text-center">  {slot?.slot_details?.map((product) => product?.product?.title).filter(Boolean).join(', ')}</td>
          
              <td className="text-center">
                <span className="d-flex gap-3 justify-content-center ">
                  <Link href={`/dashboard/slots/edit/${slot.id}`}>
                    <FaEdit className="text-dark"/>
                  </Link>
                  
                  <FaTrash className="text-danger mt-2" onClick={() => handleDelete(slot.id)} style={{cursor:'pointer'}} />
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>

 {pagination.last_page > 1 && (
        <Pagination 
          page={page}
          setPage={setPage}
          pagination={pagination}
        />
      )}
    </div>
  )
}
