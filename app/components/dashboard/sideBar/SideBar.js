import React from "react";
import "../../layouts/dashboard.css";
import { BsLayoutTextSidebar } from "react-icons/bs";
import {  FaProductHunt, FaShippingFast, FaShoppingBag} from "react-icons/fa";
import { RiKanbanView2 } from "react-icons/ri";
import { IoIosResize } from "react-icons/io";
import { BiSolidCategory } from "react-icons/bi";
import { PiFlagBanner } from "react-icons/pi";
import SideBarItem from "../components/sidebarItem/SideBarItem";
import { IoOptionsOutline } from "react-icons/io5";
export default function SideBar() {
  return (
    <div className="sideBarDiv d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center sideBar_icon_siteName">
        <h5 className="text-white">Basma Dreams</h5>
        <BsLayoutTextSidebar className="sideBarIcon" />
      </div>
      <div className="sideBar_list mt-4">
      <SideBarItem href="/dashboard/category" Icon={BiSolidCategory} label='Category'/>
      <SideBarItem href="/dashboard/sizes" Icon={IoIosResize} label='Sizes'/>
       <SideBarItem href="/dashboard/products" Icon={FaProductHunt} label='Products'/>
       <SideBarItem href="/dashboard/slots" Icon={IoOptionsOutline} label='Home Page Slots'/>
       <SideBarItem href="/dashboard/orders" Icon={FaShoppingBag} label='Orders'/>
       <SideBarItem href="/dashboard/shipping" Icon={FaShippingFast} label='Shipping Cost'/>
       <SideBarItem href="/dashboard/banners" Icon={PiFlagBanner} label='Banners'/>
       <SideBarItem href="/"   Icon={RiKanbanView2} label='My Website' />
      </div>
    </div>
  );
}
