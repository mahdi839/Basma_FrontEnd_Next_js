"use client"
import React, { useEffect, useState } from 'react'
import CustomerLeaderboardTable from './components/CustomerLeaderboardTable'
import Pagination from '../orders/components/Pagination'
import useIndexData from '@/app/hooks/useIndexData'
import LeaderboardStats from './components/LeaderboardStats'

export default function CustomerLeaderboardPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    district: '',
    order_count_sort: '',
    total_spent_sort: '',
    date_from: '',
    date_to: '',
    per_page: '15'
  });

  // Build URL with filters
  const buildIndexUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL + `api/customers/leaderboard?page=${page}`;
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return `${baseUrl}&${params.toString()}`;
  };

  const { indexData, loading, data, pagination } = useIndexData()

  useEffect(() => {
    indexData(buildIndexUrl());
  }, [page, filters])

  const handleApplyFilters = (newFilters) => {
    setPage(1); // Reset to first page when filters change
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setPage(1);
    setFilters({
      search: '',
      district: '',
      order_count_sort: '',
      total_spent_sort: '',
      date_from: '',
      date_to: '',
      per_page: '15'
    });
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Customer Leaderboard</h2>
      </div>

      {/* Statistics Summary */}
      <LeaderboardStats />

      {/* Customer Table */}
      <CustomerLeaderboardTable
        loading={loading}
        customers={data.data || []}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      {/* Pagination */}
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