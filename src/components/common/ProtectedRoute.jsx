import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    // Redirect to login if there is no token
    return <Navigate to="/login" replace />;
  }

  // Render the child routes
  return <Outlet />;
}
