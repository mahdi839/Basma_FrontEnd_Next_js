'use client'
import React, { useEffect, useState } from 'react'
import SideBar from '../dashboard/sideBar/SideBar'
import './dashboard.css'
import { BsLayoutTextSidebar } from "react-icons/bs";

export default function BackEndLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
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

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className='Dashboard_layout'>
        <SideBar 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
        
        <main className='dashboard_content'>
          {/* Mobile Toggle Button */}
          {isMobile && !isSidebarOpen && (
            <button 
              className="mobile-sidebar-toggle"
              onClick={toggleSidebar}
            >
              <BsLayoutTextSidebar />
            </button>
          )}
          
          {children}
        </main>
      </div>
    </>
  )
}