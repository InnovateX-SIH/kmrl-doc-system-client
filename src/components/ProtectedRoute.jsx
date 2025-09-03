import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check if user info exists in local storage
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // If user is logged in (userInfo exists), render the child route.
  // Otherwise, redirect to the login page.
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;