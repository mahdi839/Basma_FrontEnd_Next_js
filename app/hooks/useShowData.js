
import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

export default function useShowData() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const showData = async (url) => {
    let token = null;

    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    setLoading(true);
    try {
      const getData = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setData(getData.data);
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }
  return { showData, loading, data };
}


