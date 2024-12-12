import React from "react";
import "../../layouts/dashboard.css";
import { BsLayoutTextSidebar } from "react-icons/bs";
import { FaProductHunt } from "react-icons/fa";
import Link from "next/link";
export default function SideBar() {
  return (
    <div className="sideBarDiv">
      <div className="d-flex justify-content-between sideBar_icon_siteName">
        <h5 className="text-white">Basma Dreams</h5>
        <BsLayoutTextSidebar className="sideBarIcon " />
      </div>

      <div className="sideBar_list d-flex gap-2">
        <FaProductHunt className="text-white h5" />
        <p className="text-white">
          
          <Link href="/dashboard/productUpload"> Upload Product </Link>
        </p>
      </div>
    </div>
  );
}
