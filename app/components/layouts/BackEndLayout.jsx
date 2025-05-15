'use client'
import React, { useEffect } from 'react'
import SideBar from '../dashboard/sideBar/SideBar'
import './dashboard.css'
import { useRouter } from 'next/navigation';
export default function BackEndLayout({children}) {
    let router = useRouter()
    useEffect(()=>{
      let token = localStorage.getItem('token')
      if(!token){
        router.replace('/frontEnd/log_in')
      }
    },[router])
  return (
    <>
       <div className='Dashboard_layout'>
      
       <SideBar />
     
       <main className='dashboard_content'>{children} </main>
       
       </div>
      
    </>
  )
}
