import React from 'react'
import SideBar from '../dashboard/sideBar/SideBar'
import './dashboard.css'
export default function BackEndLayout({children}) {
  return (
    <>
       <div className='Dashboard_layout'>
      
       <SideBar />
     
       <main className='dashboard_content'>{children} </main>
       
       </div>
      
    </>
  )
}
