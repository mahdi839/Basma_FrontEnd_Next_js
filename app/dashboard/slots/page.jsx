'use client'
import Button from '@/app/components/dashboard/components/button/Button';
import PageLoader from '@/app/components/loader/pageLoader';
import useIndexData from '@/app/hooks/useIndexData'
import Link from 'next/link';
import React, { useEffect } from 'react'

export default function page() {

  const {indexData,loading,data,setData,pagination,setPagination} = useIndexData();
  const slotUrl = process.env.BACKEND_URL + `api/product-slots`;
  useEffect(()=>{
     indexData(slotUrl)
  },[])

  if(loading){
    return <PageLoader />
  }
  return (
    <div className='container-fluid my-5'>
      <Link href="/dashboard/slots/add">
         <Button className='mb-3'>Create Slot</Button>
      </Link>
         <table className="table table-bordered">
      <thead>
        <tr>
          <th className="text-center">#</th>
          <th className="text-center">Slot Name</th>
          <th className="text-center">Priority</th>
          <th className="text-center">Products</th>
          <th className="text-center">Categories</th>
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
          data.data.map((slot) => (
            <tr >
              <td className="text-center">1fd</td>
              <td className="text-center">1fd</td>
              <td className="text-center">1fd</td>
              <td className="text-center">1fd</td>
              <td className="text-center">
                <span className="d-flex gap-3 justify-content-center ">
                  <Link >
                    <FaEdit className="text-dark"/>
                  </Link>
                  {/* onClick={() => handleDelete(size.id)} style={{cursor:'pointer'}} */}
                  <FaTrash className="text-danger mt-2" />
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
