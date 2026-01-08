"use client"
import Button from '@/app/components/dashboard/components/button/Button'
import React, { useEffect, useState } from 'react'
import OrderTable from './components/OrderTable'
import Pagination from './components/Pagination'
import Link from 'next/link'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function Page() {
  const [page, setPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1
  });
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

  // Get token on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      setToken(savedToken);
    }
  }, []);

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

  // Fetch orders data
  const fetchOrders = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.get(buildIndexUrl(), {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      console.log('API Response:', response.data);

      // Set orders array
      setOrders(response.data.data || []);
      
      // Set pagination
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page
      });

    } catch (err) {
      console.error('Fetch error:', err);
      toast.error(err.response?.data?.message || err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders when page, filters, or token changes
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [page, filters, token]);

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
    if (!token) {
      toast.error('Authentication token not found');
      return;
    }

    try {
      setIsDownloading(true);
      const csvUrl = buildCsvUrl();

      const response = await fetch(csvUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv',
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

      toast.success('CSV downloaded successfully');

    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast.error('Failed to download CSV. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className='d-flex justify-content-between'>
        <Button
          className="mb-3"
          onClick={handleDownloadCSV}
          disabled={isDownloading || !token}
        >
          {isDownloading ? 'Downloading...' : 'Download CSV'}
        </Button>
      </div>
      <OrderTable
        loading={loading}
        orders={orders}
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