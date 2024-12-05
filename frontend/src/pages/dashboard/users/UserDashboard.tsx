import React from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  FiAlertTriangle,
  FiPackage,
  FiCalendar,
  FiDollarSign,
} from "react-icons/fi";
import Loading from "@/components/Loading";
import { useGetOrdersByUserId } from "@/api/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  } = useGetOrdersByUserId(currentUser?.uid!) as OrderQueryResponse;

  // Loading state
  if (isLoading || loadingUser) {
    return <Loading />;
  }

  // Error or no user state
  if (isError || !currentUser) {
    return (
      <div className="min-h-screen flex flex-1 items-center justify-center flex-col gap-4 p-4 text-center">
        <FiAlertTriangle className="w-12 h-12 text-muted-foreground" />
        <div>
          <h2 className="text-xl font-semibold mb-2">Unable to Load Orders</h2>
          <p className="text-muted-foreground">
            {!currentUser
              ? "Please log in to view your orders."
              : "We couldn't retrieve your order history at this time."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiPackage className="w-6 h-6 text-primary" />
              <span className="text-xl md:text-2xl font-bold">
                User Dashboard
              </span>
            </div>
            <div className="text-sm text-muted-foreground hidden md:block">
              Welcome, {currentUser?.displayName || "User"}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            {/* User Info Section */}
            <div className="bg-gray-50 p-4 rounded-lg md:flex items-center justify-between">
              <div className="flex items-center gap-4">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <FiPackage className="w-8 h-8 text-primary" />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold">
                    {currentUser?.displayName || "User Profile"}
                  </h2>
                  <p className="text-muted-foreground">{currentUser?.email}</p>
                </div>
              </div>
              <Button variant="outline" className="mt-4 md:mt-0">
                Edit Profile
              </Button>
            </div>

            {/* Orders Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FiPackage className="w-5 h-5 text-primary" />
                  Your Orders
                </h2>
                {orders.length > 0 && (
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                )}
              </div>

              {orders.length > 0 ? (
                <ScrollArea className="h-[400px] w-full rounded-md border">
                  <div className="p-4">
                    <ul className="space-y-4">
                      {orders.map((order: Order) => (
                        <li
                          key={order._id}
                          className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FiPackage className="w-5 h-5 text-primary" />
                              <span className="font-medium text-sm">
                                Order #{order._id.slice(-6)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <FiCalendar className="w-4 h-4" />
                              <span className="text-xs">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FiDollarSign className="w-5 h-5 text-green-500" />
                              <span className="font-semibold">
                                {order.totalPrice.toFixed(2)}
                              </span>
                            </div>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollArea>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <FiPackage className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    You haven't placed any orders yet.
                  </p>
                  <Button className="mt-4">Start Shopping</Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
