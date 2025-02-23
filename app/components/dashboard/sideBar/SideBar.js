import React from "react";
import "../../layouts/dashboard.css";
import { BsLayoutTextSidebar } from "react-icons/bs";
import { FaProductHunt } from "react-icons/fa";

import { IoIosResize } from "react-icons/io";
import SideBarItem from "../components/sidebarItem/SideBarItem";
export default function SideBar() {
  return (
    <div className="sideBarDiv d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center sideBar_icon_siteName">
        <h5 className="text-white">Basma Dreams</h5>
        <BsLayoutTextSidebar className="sideBarIcon" />
      </div>
      <div className="sideBar_list mt-4">
      <SideBarItem href="/dashboard/sizes" Icon={IoIosResize} label='Sizes'/>
       <SideBarItem href="/dashboard/products" Icon={FaProductHunt} label='Products'/>
        
      </div>
    </div>
  );
}
