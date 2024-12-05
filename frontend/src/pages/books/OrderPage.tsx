import { useState } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaShoppingBag,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { FiAlertTriangle } from "react-icons/fi";
import Loading from "@/components/Loading";
import { useGetOrdersByUserId } from "@/api/orders";

const OrderPage = () => {
  const { currentUser } = useAuth();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  if (!currentUser || currentUser === null)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to view your orders
          </p>
          <a
            href="/login"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Go to Login
          </a>
        </div>
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
      <div className="h-screen flex flex-1 items-center justify-center flex-col gap-2">
        <FiAlertTriangle className="size-8 text-muted-foreground" />
        <span className="text-base text-muted-foreground">
          No orders found for this user
        </span>
      </div>
    );
  }

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8 space-x-4">
          <FaShoppingBag className="text-4xl text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">Your Orders</h2>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <p className="text-xl text-gray-600">No orders found!</p>
            <a
              href="/books"
              className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={order._id}
                className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300"
              >
                <div
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleOrderExpand(order._id)}
                >
                  <div className="flex items-center space-x-4">
                    <span className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                      #{index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Order ID: {order._id}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Total: ${order.totalPrice}
                      </p>
                    </div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 transition-transform ${
                      expandedOrder === order._id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
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
                            Total Price: ${order.totalPrice}
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
        )}
      </div>
    </div>
  );
};

export default OrderPage;
