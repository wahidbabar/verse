import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "@/components/Loading";

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
    return <Loading />;
  }

  if (currentUser) {
    return <>{children}</>;
  }

  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
