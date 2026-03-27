"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="header__menu">
      <ul className="d-flex justify-content-center align-items-center mb-0 nav-list">
        <li className="mx-3">
          <Link
            href="/"
            className={`desktop-nav-link ${pathname == "/" ? "activated-nav" : ""}`}
          >
            Home
          </Link>
        </li>

        <li className="mx-3">
          <Link
            href="/frontEnd/shop"
            className={`desktop-nav-link ${pathname == "/frontEnd/shop" ? "activated-nav" : ""}`}
          >
            Shop
          </Link>
        </li>

        <li className="mx-3">
          <Link
            href="/frontEnd/about_us"
            className={`desktop-nav-link ${pathname == "/frontEnd/about_us" ? "activated-nav" : ""}`}
          >
            About Us
          </Link>
        </li>
      </ul>
    </nav>
  );
}