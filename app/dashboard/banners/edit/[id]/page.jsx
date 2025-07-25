'use client'
import useShowData from '@/app/hooks/useShowData';
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

export default function page() {
   const {id} = useParams();
   const {showData,loading,data} = useShowData();
   const url = process.env.BACKEND_URL + `api/banners/${id}`
   useEffect(()=>{
      showData(url)
   },[]);

  return (
    <div>page</div>
  )
}
