// app/dashboard/users/page.jsx
"use client";


import UserManagement from "@/app/components/dashboard/UserManagement";
import ProtectedRoute from "@/app/components/protectedRoute/ProtectedRoute";

export default function UsersPage() {
  return (
    <ProtectedRoute requiredRole="super-admin">
      <UserManagement />
    </ProtectedRoute>
  );
}