// frontend/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, userType } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-blue-600 text-lg">Loading...</div>;
  }

  if (user && allowedRoles.includes(userType)) {
    return <Outlet />; // Render child routes
  } else if (user && !allowedRoles.includes(userType)) {
    if (userType === 'voter') return <Navigate to="/voter-dashboard" replace />;
    if (userType === 'candidate') return <Navigate to="/candidate-dashboard" replace />;
    if (userType === 'admin') return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/" replace />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;