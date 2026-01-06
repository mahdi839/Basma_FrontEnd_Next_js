"use client"
import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

export default function useIndexData() {
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1
  })
  const [data, setData] = useState(
    {
      data: [],
    }
  );
  const indexData = async (url) => {
    let token = null;

    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    setLoading(true);
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
      setData({
        data: response.data.data || [],
      });
      setPagination({ current_page: response.data.current_page, last_page: response.data.last_page })
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }
  return { indexData, loading, data, setData, pagination, setPagination };
}
