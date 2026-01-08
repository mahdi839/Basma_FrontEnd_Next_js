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
          process.env.NEXT_PUBLIC_BACKEND_URL + 'api/products',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log('Product API Response:', response.data);

        // ✅ Fix: response.data.data is the paginated object, 
        // response.data.data.data is the actual products array
        const productsData = response.data?.data?.data || [];

        if (Array.isArray(productsData)) {
          const options = productsData.map(product => ({
            value: product.title,
            label: product.title,
            id: product.id
          }));
          setProducts(options);
        } else {
          console.error('Products data is not an array:', productsData);
          setProducts([]);
        }

      } catch (err) {
        console.error('Fetch products error:', err);
        toast.error(err.response?.data?.message || 'Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Find selected value
  const selectedValue = products.find(option => option.value === value) || null;

  return (
    <Select
      options={products}
      value={selectedValue}
      onChange={onChange}
      placeholder={loading ? "Loading products..." : "Search or select product..."}
      isSearchable
      required={required}
      isLoading={loading}
      isClearable // ✅ Allow clearing selection
      isDisabled={loading}
      styles={{
        control: (base, state) => ({
          ...base,
          padding: '4px',
          border: state.isFocused ? '1px solid #80bdff' : '1px solid #dee2e6',
          borderRadius: '0.375rem',
          minHeight: 'calc(1.5em + 0.75rem + 2px)',
          boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : 'none',
          '&:hover': {
            borderColor: '#80bdff'
          }
        }),
        menu: (base) => ({
          ...base,
          zIndex: 9999
        })
      }}
      className="basic-multi-select"
      classNamePrefix="select"
      noOptionsMessage={() => loading ? "Loading..." : "No products found"}
    />
  );
}