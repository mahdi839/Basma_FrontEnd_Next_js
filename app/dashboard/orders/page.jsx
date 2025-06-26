"use client"
import Button from '@/app/components/dashboard/components/button/Button'
import useIndexData from '@/app/hooks/useIndexData'
import React, { useEffect, useState } from 'react'
import OrderTable from './components/OrderTable'

export default function page() {
    const [currentPage, setCurrentPage] = useState(1);
    const indexUrl = process.env.BACKEND_URL + "api/orders"
    const {indexData,loading,data,setData} = useIndexData()
    useEffect(()=>{
          indexData(indexUrl,{ page: currentPage })
    },[])
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
    </div>
  )
}
