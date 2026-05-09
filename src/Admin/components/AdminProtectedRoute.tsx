import React, { JSX } from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const adminToken = localStorage.getItem("adminToken");

  if (!adminToken) {
    // Redirect to admin login if no token
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
