// PublicRoute.js
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

type Props = {
  children: ReactNode;
};
const PublicRoute: React.FC<Props> = ({ children }) => {
  const { user } = useAuth();

  // If user is authenticated, redirect them to the home page
  if (user) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, render the children (login page or any public route)
  return children;
};

export default PublicRoute;
