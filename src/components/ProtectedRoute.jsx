import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ staffOnly = false }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const isStaff = decoded.is_staff;

    if (staffOnly && !isStaff) {
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/" replace />;
  }
};

// ✅ Superuser Route: Allows Only Superusers
const SuperUserRoute = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const isSuperuser = decoded.is_superuser;
    console.log(decoded.is_superuser);
    

    if (!isSuperuser) {
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/" replace />;
  }
};

// ✅ Public Route: Redirects Authenticated Users from Login/Signup Pages
const PublicRoute = () => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export { ProtectedRoute, SuperUserRoute, PublicRoute };
