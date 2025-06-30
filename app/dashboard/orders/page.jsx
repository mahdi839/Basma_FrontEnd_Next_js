"use client"
import Button from '@/app/components/dashboard/components/button/Button'
import useIndexData from '@/app/hooks/useIndexData'
import React, { useEffect, useState } from 'react'
import OrderTable from './components/OrderTable'
import Pagination from './components/Pagination'


export default function page() {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
      search: '',
      min: '',
      max: '',
      start_date: '',
      end_date: '',
      district: '',
      product_title: '',
      status: ''
    });
    
    // Build URL with filters
    const buildIndexUrl = () => {
      const baseUrl = process.env.BACKEND_URL + `api/orders?page=${page}`;
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      return `${baseUrl}&${params.toString()}`;
    };
    const {indexData,loading,data,setData,pagination,setPagination} = useIndexData()
    useEffect(()=>{
      indexData(buildIndexUrl());
    },[page, filters])
    
    const handleApplyFilters = (newFilters) => {
      setPage(1); // Reset to first page when filters change
      setFilters(newFilters);
    };
  
    const handleResetFilters = () => {
      setPage(1);
      setFilters({
        search: '',
        min: '',
        max: '',
        start_date: '',
        end_date: '',
        district: '',
        product_title: '',
        status: ''
      });
    };
   
  return (
    <div className="container-fluid py-4">
      <Button className="mb-3">
        Create Order
      </Button>
      <OrderTable 
        loading={loading}
        orders={data.data || []}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
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
