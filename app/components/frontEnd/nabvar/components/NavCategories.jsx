'use client'
import axios from 'axios';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function NavCategories({ onClick }) {
  const [category, setCategory] = useState([]);

  async function fetchCategories() {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL+'api/categories'
    try {
      const data = await axios.get(url)
      setCategory(data.data)
    } catch (err) {
      toast.error(err.message)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])
  return (

    category?.data?.map((categ) => (
      <li key={categ.id} onClick={onClick}>
        <Link href={`/frontEnd/${categ.slug}`} onClick={onClick}>{categ.name}</Link>
      </li>
    ))
  )
}
