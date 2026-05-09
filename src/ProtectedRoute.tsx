import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
  admin?: boolean; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, admin = false }) => {
  const { user } = useAuth();

  if (admin) {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      return <Navigate to="/admin/login" replace />;
    }
    return children;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
