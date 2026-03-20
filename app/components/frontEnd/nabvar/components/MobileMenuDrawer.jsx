// app/components/navbar/client/MobileMenuDrawer.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { IoMenuOutline } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "@/redux/slices/categorySlice";
import MobileCategories from "../components/navCatComponents/MobileCategories";

export default function MobileMenuDrawer() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.list);
  const status = useSelector((state) => state.categories.status);

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("category"); // "category" | "menu"

  useEffect(() => {
    if (status === "idle") dispatch(fetchCategories());
  }, [dispatch, status]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {/* Hamburger button */}
      <button
        className="mobile_humberger_icon border-0 bg-transparent"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <IoMenuOutline size={24} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.45)", zIndex: 10000 }}
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="position-fixed top-0 start-0 h-100 bg-white d-md-none"
        style={{
          width: "80vw",
          maxWidth: 350,
          boxShadow: "2px 0 10px rgba(0,0,0,0.15)",
          overflowY: "auto",
          zIndex: 10001,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Close button */}
        <button
          className="border-0 bg-transparent p-3 d-block ms-auto"
          onClick={close}
          aria-label="Close menu"
        >
          <ImCancelCircle size={22} />
        </button>

        {/* Tabs */}
        <div className="d-flex border-bottom">
          {["category", "menu"].map((tab) => (
            <button
              key={tab}
              className={`flex-fill border-0 py-2 text-capitalize fw-semibold ${
                activeTab === tab ? "border-bottom border-2 border-dark" : "text-muted bg-transparent"
              }`}
              style={{ background: "transparent" }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-3">
          {activeTab === "category" && (
            <ul className="list-unstyled mb-0">
              {status === "loading"
                ? <li className="text-muted">Loading categories…</li>
                : <MobileCategories categories={categories} onClick={close} />
              }
            </ul>
          )}

          {activeTab === "menu" && (
            <ul className="list-unstyled mb-0">
              {[
                { href: "/", label: "Home" },
                { href: "/frontEnd/about_us", label: "About Us" },
                { href: "/frontEnd/shop", label: "Shop" },
              ].map(({ href, label }) => (
                <li key={href} className="py-2 border-bottom">
                  <Link href={href} onClick={close} className="text-decoration-none text-dark fw-medium">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}