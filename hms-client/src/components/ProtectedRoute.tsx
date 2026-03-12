import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

/**
 * ProtectedRoute
 * @description High-order component that checks for a JWT token in localStorage.
 * If no token is found, it redirects the user to the login page while 
 * remembering the page they were trying to access.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // We save the 'from' location so we can redirect back after login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;