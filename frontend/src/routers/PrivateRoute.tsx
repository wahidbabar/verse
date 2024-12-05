import Loading from "@/components/Loading";
import useCartStore from "@/store/cart-store";
import { getAuth, onIdTokenChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser, loading, logout } = useAuth();
  const { setUserId } = useCartStore();
  const auth = getAuth();

  useEffect(() => {
    // Set up a listener for ID token changes
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      if (!user) {
        // User is logged out
        localStorage.removeItem("token");
        setUserId(null);
        logout();
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [auth, logout]);

  if (loading) {
    return <Loading />;
  }

  if (currentUser) {
    return <>{children}</>;
  }

  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
