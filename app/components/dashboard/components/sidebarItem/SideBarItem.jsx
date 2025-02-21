import React from 'react'
import Link from "next/link";
export default function SideBarItem({href,label,Icon}) {
  return (
    <Link href={href} passHref>
    <div className="d-flex align-items-center gap-2 mb-3 text-white">
     {Icon &&  <Icon className="text-white" />}
      <span>{label}</span>
    </div>
  </Link>
  )
}
