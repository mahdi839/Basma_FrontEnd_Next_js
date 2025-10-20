import React, { useState, useEffect } from "react";
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
import { usePathname } from "next/navigation";

export default function SideBar({ isSidebarOpen, toggleSidebar, isMobile }) {
  const [openMenus, setOpenMenus] = useState({});
  const pathname = usePathname();

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

  // Auto-open menu if current path is in submenu
  useEffect(() => {
    const newOpenMenus = { ...openMenus };
    menuItems.forEach(item => {
      if (item.type === 'menu') {
        const isActive = item.submenus.some(subItem => 
          pathname === subItem.href || pathname.startsWith(subItem.href + '/')
        );
        if (isActive) {
          newOpenMenus[item.label] = true;
        }
      }
    });
    setOpenMenus(newOpenMenus);
  }, [pathname]);

  const toggleMenu = (menuLabel) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuLabel]: !prev[menuLabel]
    }));
  };

  // Close sidebar on mobile when clicking a link
  const handleLinkClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  // Check if a menu item is active
  const isItemActive = (href) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Check if a menu group is active
  const isMenuActive = (menu) => {
    if (menu.type === 'single') {
      return isItemActive(menu.href);
    } else if (menu.type === 'menu') {
      return menu.submenus.some(subItem => isItemActive(subItem.href));
    }
    return false;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`sideBarDiv d-flex flex-column ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${isMobile ? 'mobile-sidebar' : ''}`}>
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
                    isActive={isItemActive(item.href)}
                  />
                </div>
              );
            } else if (item.type === 'menu') {
              const isActive = isMenuActive(item);
              return (
                <div key={index} className="sidebar-menu-group">
                  <div 
                    className={`sidebar-menu-header d-flex align-items-center justify-content-between text-white mb-3 cursor-pointer ${isActive ? 'active' : ''}`}
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
                            isActive={isItemActive(subItem.href)}
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