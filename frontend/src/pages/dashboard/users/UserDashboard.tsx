import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useGetOrdersByEmail } from "@/api/orders";
import { FiAlertTriangle } from "react-icons/fi";
import Loading from "@/components/Loading";

interface Address {
  city: string;
  country?: string;
  state?: string;
  zipcode?: string;
}

interface Order {
  _id: string;
  name: string;
  email: string;
  address: Address;
  phone: number;
  productIds: string[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

interface OrderQueryResponse {
  data: Order[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

const UserDashboard: React.FC = () => {
  const { currentUser, loading: loadingUser } = useAuth();

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useGetOrdersByEmail(currentUser?.email!) as OrderQueryResponse;

  if (isLoading || loadingUser) {
    return <Loading />;
  }

  if (isError || !currentUser) {
    <div className="h-screen flex flex-1 items-center justify-center flex-col gap-2">
      <FiAlertTriangle className="size-8 text-muted-foreground" />
      <span className="text-base text-muted-foreground">
        No orders found for this user
      </span>
    </div>;
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
        <p className="text-gray-700 mb-6">
          Welcome, {currentUser?.displayName || "User"}! Here are your recent
          orders:
        </p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
          {orders.length > 0 ? (
            <ul className="space-y-4">
              {orders.map((order: Order) => (
                <li
                  key={order._id}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-1"
                >
                  <p className="font-medium">Order ID: {order._id}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p>Total: ${order.totalPrice}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">You have no recent orders.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
