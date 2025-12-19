'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DesktopCategories from './navCatComponents/DesktopCategories'
import MobileCategories from './navCatComponents/MobileCategories'

export default function NavCategories({ isMobile = false }) {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_URL + 'api/frontend/categories')
      .then(res => {
        const normalize = cats =>
          cats.map(c => ({
            ...c,
            children: c.all_children ? normalize(c.all_children) : []
          }))

        setCategories(normalize(res.data))
      })
  }, [])

  if (isMobile) {
    return <MobileCategories categories={categories} />
  }

  return <DesktopCategories categories={categories} />
}
