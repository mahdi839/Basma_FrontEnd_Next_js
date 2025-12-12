"use client";

import RoleManagement from "@/app/components/dashboard/RoleManagement";
import ProtectedRoute from "@/app/components/protectedRoute/ProtectedRoute";


export default function RolesPage() {
  return (
    <ProtectedRoute requiredRole="super-admin">
      <RoleManagement />
    </ProtectedRoute>
  );
}