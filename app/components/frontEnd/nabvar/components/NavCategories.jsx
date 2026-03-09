'use client'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/slices/categorySlice";

import DesktopCategories from './navCatComponents/DesktopCategories'
import MobileCategories from './navCatComponents/MobileCategories'

export default function NavCategories({ isMobile = false, onClick }) {

  const dispatch = useDispatch()

  const categories = useSelector((state) => state.categories.list)
  const status = useSelector((state) => state.categories.status)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories())
    }
  }, [dispatch, status])

  if (status === "loading") {
    return <div className="p-3">Loading categories...</div>
  }

  if (isMobile) {
    return <MobileCategories categories={categories} onClick={onClick} />
  }

  return <DesktopCategories categories={categories} />
}