import React from 'react'
import Link from "next/link";

export default function SideBarItem({ href, label, Icon, isSubmenu = false, isSidebarOpen = true }) {
  return (
    <Link href={href} passHref>
      <div className={`d-flex align-items-center gap-2 mb-3 text-white sidebar-item ${isSubmenu ? 'sidebar-subitem' : ''}`}>
        {Icon && <Icon className="text-white" />}
        {isSidebarOpen && <span className="sidebar-label">{label}</span>}
      </div>
    </Link>
  )
}