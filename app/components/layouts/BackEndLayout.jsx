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

        {/* Add print styles to hide sidebar and adjust layout */}
      <style jsx global>{`
        @media print {
          /* Hide sidebar during print */
          .Dashboard_layout > :first-child:not(.dashboard_content) {
            display: none !important;
          }
          
          /* Make main content take full width during print */
          .dashboard_content {
            margin-left: 0 !important;
            width: 100% !important;
            padding: 0 !important;
          }
          
          /* Hide mobile toggle button during print */
          .mobile-sidebar-toggle {
            display: none !important;
          }
          
          /* Ensure body has no margins during print */
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </>
  )
}