import { useState } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaShoppingBag,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { FiAlertTriangle, FiChevronDown } from "react-icons/fi";
import Loading from "@/components/Loading";
import { useGetOrdersByUserId } from "@/api/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const OrderPage = () => {
  const { currentUser } = useAuth();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  if (!currentUser || currentUser === null)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <div className="flex flex-col items-center">
              <FiAlertTriangle className="w-12 h-12 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Access Denied
              </h2>
              <p className="text-gray-600 mb-6">
                Please log in to view your orders
              </p>
              <Button asChild>
                <a href="/login">Go to Login</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useGetOrdersByUserId(currentUser.uid!);

  if (isLoading) return <Loading />;

  if (isError || !orders.length) {
    return (
      <div className="min-h-screen flex flex-1 items-center justify-center flex-col gap-2">
        <FiAlertTriangle className="w-12 h-12 text-muted-foreground" />
        <span className="text-base text-muted-foreground">
          No orders found for this user
        </span>
        <Button className="mt-4">Continue Shopping</Button>
      </div>
    );
  }

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center space-x-4 border-b">
          <FaShoppingBag className="text-3xl text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Your Orders
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-xl text-gray-600 mb-4">No orders found!</p>
              <Button asChild>
                <a href="/books">Continue Shopping</a>
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[600px] w-full">
              <div className="p-4 space-y-4">
                {orders.map((order, index) => (
                  <div
                    key={order._id}
                    className="bg-white border rounded-lg overflow-hidden"
                  >
                    <div
                      className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleOrderExpand(order._id)}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          #{index + 1}
                        </span>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            Order ID: {order._id.slice(-8)}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            Total: ${order.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <FiChevronDown
                        className={`w-6 h-6 transition-transform ${
                          expandedOrder === order._id ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {expandedOrder === order._id && (
                      <div className="p-4 bg-gray-50 border-t">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center mb-2">
                              <FaEnvelope className="mr-2 text-gray-600" />
                              <p className="text-gray-700">{order.email}</p>
                            </div>
                            <div className="flex items-center mb-2">
                              <FaPhoneAlt className="mr-2 text-gray-600" />
                              <p className="text-gray-700">{order.phone}</p>
                            </div>
                            <div className="flex items-center mb-2">
                              <FaMoneyBillWave className="mr-2 text-gray-600" />
                              <p className="text-gray-700 font-semibold">
                                Total Price: ${order.totalPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center mb-2">
                              <FaMapMarkerAlt className="mr-2 text-gray-600" />
                              <h3 className="font-semibold text-gray-800">
                                Shipping Address
                              </h3>
                            </div>
                            <p className="text-gray-700">
                              {order.address.city}, {order.address.state},{" "}
                              {order.address.country}, {order.address.zipcode}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderPage;
