"use client"
import Button from '@/app/components/dashboard/components/button/Button'
import useIndexData from '@/app/hooks/useIndexData'
import React, { useEffect, useState } from 'react'
import OrderTable from './components/OrderTable'
import Pagination from './components/Pagination'
import Link from 'next/link'

export default function page() {
  const [page, setPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [token, setToken] = useState(null); // ✅ store token safely
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
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL + `api/orders?page=${page}`;
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return `${baseUrl}&${params.toString()}`;
  };

  // Build CSV download URL with same filters
  const buildCsvUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL + 'api/orders-download-csv';
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  };

  const { indexData, loading, data, setData, pagination, setPagination } = useIndexData()

  useEffect(() => {
    indexData(buildIndexUrl());
  }, [page, filters])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      setToken(savedToken);
    }
  }, []);

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

  const handleDownloadCSV = async () => {
    try {
      setIsDownloading(true);
      const csvUrl = buildCsvUrl();

      const response = await fetch(csvUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv',
          // Add any authentication headers if needed
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Extract filename from response headers or use default
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `orders_${new Date().toISOString().split('T')[0]}.csv`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Failed to download CSV. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className='d-flex justify-content-between'>
        {/* <Link href="/dashboard/orders/createOrder">
          <Button className="mb-3">
            Create Order
          </Button>
        </Link> */}
        <Button
          className="mb-3"
          onClick={handleDownloadCSV}
          disabled={isDownloading}
        >
          {isDownloading ? 'Downloading...' : 'Download CSV'}
        </Button>
      </div>
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