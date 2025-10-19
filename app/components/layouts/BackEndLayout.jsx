'use client'
import React, { useEffect, useState } from 'react'
import SideBar from '../dashboard/sideBar/SideBar'
import './dashboard.css'
import { BsLayoutTextSidebar } from 'react-icons/bs';
export default function BackEndLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className='Dashboard_layout'>
        <SideBar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className='dashboard_content'>
          {/* Mobile Toggle Button */}
          <button 
            className="mobile-sidebar-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            <BsLayoutTextSidebar />
          </button>
          
          {children}
        </main>
      </div>
    </>
  )
}