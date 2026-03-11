import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, requiredRole = null }) => {
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole !== null) {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (userData.role !== requiredRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return element;
};

export default PrivateRoute;
