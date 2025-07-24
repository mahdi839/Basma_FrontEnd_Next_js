'use client'
import PageLoader from '@/app/components/loader/pageLoader';
import useDeleteItem from '@/app/hooks/useDeleteItem';
import useIndexData from '@/app/hooks/useIndexData'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa';
import Pagination from '../orders/components/Pagination';
import Image from 'next/image';

export default function page() {
  const [page, setPage] = useState(1);

  const {indexData,loading,data,setData,pagination,setPagination} = useIndexData();
  const bannerUrl = process.env.BACKEND_URL + `api/banners?page=${page}`;
  useEffect(()=>{
     indexData(bannerUrl)
  },[page])
  
  const {handleDeleteData,deleteLoading} = useDeleteItem();
   function handleDelete (id){
      const url = process.env.BACKEND_URL + `api/banners/${id}`
      
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
      <Link href="/dashboard/banners/add">
         <button className='dashboard-btn mb-3'>Create Banner</button>
      </Link>
         <table className="table table-bordered">
      <thead>
        <tr>
          <th className="text-center">#</th>
          <th className="text-center">Link</th>
          <th className="text-center">Banner Type</th>
          <th className="text-center">Slot</th>
          <th className="text-center">Category</th>
          <th className="text-center">Image</th>
          {/* <th className="text-center">Actions</th> */}
        </tr>
      </thead>
      <tbody>
        {data.data.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center text-danger">
              No Banner Available
            </td>
          </tr>
        ) : (
          data.data.map((banner,index) => (
            <tr key={banner.id}>
              <td className="text-center">{index+1}</td>
              <td className="text-center">{banner.link}</td>
              <td className="text-center">{banner.type}</td>
              
              <td className="text-center">  {banner?.slot?.slot_name}</td>
              <td className="text-center">  {banner?.category?.name?? "N/A"}</td>
              <td className="text-center">  {banner?.banner_mages?.map((img)=>(
                <Image className='ml-2 rounded' src={`${process.env.BACKEND_URL}storage/${img.path}`} width={50} height={50} />
              ))}</td>
              {/* <td className="text-center">
                <span className="d-flex gap-3 justify-content-center ">
                  <Link href={`/dashboard/slots/edit/${slot.id}`}>
                    <FaEdit className="text-dark"/>
                  </Link>
                  
                  <FaTrash className="text-danger mt-2" onClick={() => handleDelete(slot.id)} style={{cursor:'pointer'}} />
                </span>
              </td> */}
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
