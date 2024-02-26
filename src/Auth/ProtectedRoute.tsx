import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();
  console.log("user", user);

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
