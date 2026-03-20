// app/components/navbar/client/UserDropdown.jsx
"use client";

import dynamic from "next/dynamic";
import { FaUser } from "react-icons/fa";

// LogButtons has auth state — load client-only, no SSR needed
const LogButtons = dynamic(() => import("../LogButtons"), { ssr: false, loading: () => null });

export default function UserDropdown() {
  return (
    <div className="dropdown pb-1">
      <FaUser
        className="dropdown-toggle"
        role="button"
        tabIndex={0}
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        aria-label="User menu"
      />
      <ul className="dropdown-menu">
        <LogButtons />
      </ul>
    </div>
  );
}