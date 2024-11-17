import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

interface AuthContextType {
  currentUser: any; // Replace 'any' with your user type
  loading: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth() as AuthContextType;

  if (loading) {
    return <div>Loading..</div>;
  }

  if (currentUser) {
    return <>{children}</>;
  }

  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
