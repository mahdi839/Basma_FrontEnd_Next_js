import React, { useState } from "react";
import "../../layouts/dashboard.css";
import { BsLayoutTextSidebar, BsChevronDown, BsChevronRight } from "react-icons/bs";
import { FaInfoCircle, FaProductHunt, FaShippingFast, FaShoppingBag } from "react-icons/fa";
import { RiKanbanView2 } from "react-icons/ri";
import { IoIosSettings } from "react-icons/io";
import { MdInventory } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import { PiFlagBanner } from "react-icons/pi";
import SideBarItem from "../components/sidebarItem/SideBarItem";
import { MdOutlineSocialDistance } from "react-icons/md";
import { AiOutlineDashboard } from "react-icons/ai";

export default function SideBar() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Menu structure with main and submenus
  const menuItems = [
    {
      type: 'single',
      href: "/dashboard",
      Icon: AiOutlineDashboard,
      label: 'Dashboard'
    },
    {
      type: 'menu',
      label: 'Products Management',
      Icon: FaProductHunt,
      submenus: [
        { href: "/dashboard/category", label: 'Category', Icon: BiSolidCategory },
        { href: "/dashboard/products", label: 'Products', Icon: FaProductHunt },
        { href: "/dashboard/inventory", label: 'Inventory Management', Icon: MdInventory },
      ]
    },
    {
      type: 'menu',
      label: 'Orders',
      Icon: FaShoppingBag,
      submenus: [
        { href: "/dashboard/orders", label: 'All Orders', Icon: FaShoppingBag },
        { href: "/dashboard/incomplete_orders", label: 'Incomplete Orders', Icon: FaShoppingBag },
      ]
    },
    {
      type: 'single',
      href: "/dashboard/shipping",
      Icon: FaShippingFast,
      label: 'Shipping Cost'
    },
    {
      type: 'single',
      href: "/dashboard/banners",
      Icon: PiFlagBanner,
      label: 'Banners'
    },
    {
      type: 'menu',
      label: 'Settings',
      Icon: IoIosSettings,
      submenus: [
        { href: "/dashboard/about_us", label: 'About Us', Icon: FaInfoCircle },
        { href: "/dashboard/footerSettings", label: 'Footer Settings', Icon: IoIosSettings },
        { href: "/dashboard/socialLinks", label: 'Social Links', Icon: MdOutlineSocialDistance },
      ]
    },
    {
      type: 'single',
      href: "/",
      Icon: RiKanbanView2,
      label: 'My Website'
    }
  ];

  const toggleMenu = (menuLabel) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuLabel]: !prev[menuLabel]
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar on mobile when clicking a link
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sideBarDiv d-flex flex-column ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center sideBar_icon_siteName">
          <h5 className="text-white" style={{ display: isSidebarOpen ? 'block' : 'none' }}>
            Basma Dreams
          </h5>
          <button 
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
          >
            <BsLayoutTextSidebar className="sideBarIcon" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="sideBar_list mt-4">
          {menuItems.map((item, index) => {
            if (item.type === 'single') {
              return (
                <div key={index} onClick={handleLinkClick}>
                  <SideBarItem 
                    href={item.href} 
                    Icon={item.Icon} 
                    label={item.label}
                    isSidebarOpen={isSidebarOpen}
                  />
                </div>
              );
            } else if (item.type === 'menu') {
              return (
                <div key={index} className="sidebar-menu-group">
                  <div 
                    className="sidebar-menu-header d-flex align-items-center justify-content-between text-white mb-3 cursor-pointer"
                    onClick={() => toggleMenu(item.label)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      {item.Icon && <item.Icon className="text-white" />}
                      {isSidebarOpen && <span>{item.label}</span>}
                    </div>
                    {isSidebarOpen && (
                      openMenus[item.label] ? 
                      <BsChevronDown className="text-white" /> : 
                      <BsChevronRight className="text-white" />
                    )}
                  </div>
                  
                  {isSidebarOpen && openMenus[item.label] && (
                    <div className="sidebar-submenu">
                      {item.submenus.map((subItem, subIndex) => (
                        <div key={subIndex} onClick={handleLinkClick}>
                          <SideBarItem 
                            href={subItem.href} 
                            Icon={subItem.Icon} 
                            label={subItem.label}
                            isSubmenu={true}
                            isSidebarOpen={isSidebarOpen}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </>
  );
}