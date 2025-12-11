// hooks/useAuth.js
"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useAuth = () => {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  // ✅ Helper to delete cookie
  const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  // ✅ Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (token) {
        // Call backend logout
        await fetch(`${API_BASE}/api/logOut`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // ✅ Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_name");
      localStorage.removeItem("roles");
      localStorage.removeItem("permissions");

      // ✅ Clear cookies
      deleteCookie("token");
      deleteCookie("roles");
      deleteCookie("user_id");

      toast.success("Logged out successfully");
      router.push("/frontEnd/log_in");
    }
  };

  // ✅ Check if user is authenticated
  const isAuthenticated = () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  };

  // ✅ Check if user has admin access
  const isAdmin = () => {
    if (typeof window === "undefined") return false;
    try {
      const roles = JSON.parse(localStorage.getItem("roles") || "[]");
      return roles.some(role => ["admin", "super-admin"].includes(role));
    } catch {
      return false;
    }
  };

  // ✅ Check if user has specific role
  const hasRole = (roleName) => {
    if (typeof window === "undefined") return false;
    try {
      const roles = JSON.parse(localStorage.getItem("roles") || "[]");
      return roles.includes(roleName);
    } catch {
      return false;
    }
  };

  // ✅ Check if user has specific permission
  const hasPermission = (permissionName) => {
    if (typeof window === "undefined") return false;
    try {
      const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
      return permissions.includes(permissionName);
    } catch {
      return false;
    }
  };

  return {
    logout,
    isAuthenticated,
    isAdmin,
    hasRole,
    hasPermission,
  };
};