"use client"
import Button from '@/app/components/dashboard/components/button/Button'
import useIndexData from '@/app/hooks/useIndexData'
import React, { useEffect, useState } from 'react'
import OrderTable from './components/OrderTable'
import Pagination from './components/Pagination'


export default function page() {
    const [page, setPage] = useState(1);
    const indexUrl = process.env.BACKEND_URL + `api/orders?page=${page}`
    const {indexData,loading,data,setData,pagination,setPagination} = useIndexData()
    useEffect(()=>{
          indexData(indexUrl)
    },[page])
    console.log(data)
   
  return (
    <div className="container-fluid py-4">
        <Button className="mb-3">
            Create Order
        </Button >
        <OrderTable 
        loading={loading}
        orders={data.data}
        setData = {setData}
        />
          {pagination.last_page > 1 && (
                <Pagination 
                    page={page}
                    setPage={setPage}
                    pagination={pagination}
                    setPagination={setPagination}
                />
            )}
    </div>
  )
}
