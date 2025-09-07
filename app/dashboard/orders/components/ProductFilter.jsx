// app/dashboard/orders/components/ProductFilter.jsx
"use client";
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ProductFilter({ value, onChange, required = false }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let token = null;

        if (typeof window !== "undefined") {
          token = localStorage.getItem("token");
        }
        const response = await axios.get(
          process.env.BACKEND_URL + 'api/products',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data && response.data.data) {
          const options = response.data.data.map(product => ({
            value: product.title,
            label: product.title
          }));
          setProducts(options);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Select
      options={products}
      value={products.find(option => option.value === value)}
      onChange={onChange}
      placeholder={loading ? "Loading products..." : "Search or select product..."}
      isSearchable
      required={required}
      isLoading={loading}
      styles={{
        control: (base) => ({
          ...base,
          padding: '4px',
          border: '1px solid #dee2e6',
          borderRadius: '0.375rem',
          minHeight: 'calc(1.5em + 0.75rem + 2px)'
        })
      }}
      className="basic-multi-select"
      classNamePrefix="select"
    />
  );
}