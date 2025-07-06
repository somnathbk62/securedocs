import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Component for routes that require authentication
export function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, isAdmin, isStudent } = useAuth();
  
  if (!currentUser) {
    toast.error("You must be logged in to access this page", {
      position: "top-center",
    });
    return <Navigate to="/" />;
  }
  
  // Check for specific role requirements
  if (requiredRole === 'admin' && !isAdmin()) {
    toast.error("Access Denied: You are not authorized to access this page", {
      position: "top-center",
    });
    return <Navigate to="/" />;
  }
  
  if (requiredRole === 'student' && !isStudent()) {
    toast.error("Access Denied: You are not authorized to access this page", {
      position: "top-center",
    });
    return <Navigate to="/" />;
  }
  
  return children;
}

// Component for routes that should not be accessible when logged in
export function PublicOnlyRoute({ children }) {
  const { currentUser, isAdmin, isStudent } = useAuth();
  
  if (currentUser) {
    if (isAdmin()) {
      return <Navigate to="/admin" />;
    } else if (isStudent()) {
      return <Navigate to="/myprofile" />;
    }
  }
  
  return children;
}
