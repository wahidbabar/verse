import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

import useCartStore from "@/store/cart-store";
import { FaCheckCircle, FaShoppingCart } from "react-icons/fa";
import { CreateOrderRequest } from "@/api/types";
import { useCreateOrder } from "@/api/orders";
import { BiLoader } from "react-icons/bi";

const CheckoutPage = () => {
  const { cartItems } = useCartStore();
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.newPrice, 0)
    .toFixed(2);
  const { currentUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrderRequest>();

  const createOrderMutation = useCreateOrder();
  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(false);

  const onSubmit: SubmitHandler<CreateOrderRequest> = async (data) => {
    const newOrder: CreateOrderRequest = {
      name: data.name,
      email: currentUser?.email!,
      address: {
        streetAddress: data.address.streetAddress,
        city: data.address.city,
        country: data.address.country,
        state: data.address.state,
        zipcode: data.address.zipcode,
      },
      phone: data.phone,
      productIds: cartItems.map((item) => item?._id || ""),
      totalPrice: +totalPrice,
    };

    try {
      createOrderMutation.mutate(newOrder);
      toast.success("Order Confirmed", {
        description: "Your order has been placed successfully!",
        position: "top-right",
        duration: 3000,
        onAutoClose: () => navigate("/orders"),
      });
    } catch (error) {
      console.error("Error placing an order", error);
      toast.error("Order Failed", {
        description: "Unable to place your order. Please try again.",
        position: "top-right",
        duration: 3000,
      });
    }
  };

  if (createOrderMutation.isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500">
          <BiLoader />
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Order Summary Header */}
          <div className="bg-blue-50 p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FaShoppingCart className="mr-3 text-blue-600" />
                  Cash On Delivery
                </h2>
                <div className="mt-2 text-gray-600">
                  <p>Total Items: {cartItems.length}</p>
                  <p>Total Price: ${totalPrice}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Personal Details
                </h3>

                <div className="mb-4">
                  <label htmlFor="name" className="block mb-2 text-gray-600">
                    Full Name
                  </label>
                  <input
                    {...register("name", {
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    type="text"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block mb-2 text-gray-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    defaultValue={currentUser?.email || ""}
                    className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="block mb-2 text-gray-600">
                    Phone Number
                  </label>
                  <input
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit phone number",
                      },
                    })}
                    type="tel"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Shipping Address
                </h3>

                <div className="mb-4">
                  <label htmlFor="address" className="block mb-2 text-gray-600">
                    Street Address
                  </label>
                  <input
                    {...register("address.streetAddress", {
                      required: "Street address is required",
                    })}
                    type="text"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.streetAddress?.message}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label htmlFor="city" className="block mb-2 text-gray-600">
                      City
                    </label>
                    <input
                      {...register("address.city", {
                        required: "City is required",
                      })}
                      type="text"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.address?.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.city.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="country"
                      className="block mb-2 text-gray-600"
                    >
                      Country
                    </label>
                    <input
                      {...register("address.country", {
                        required: "Country is required",
                      })}
                      type="text"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.address?.country && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address?.country.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label htmlFor="state" className="block mb-2 text-gray-600">
                      State/Province
                    </label>
                    <input
                      {...register("address.state", {
                        required: "State is required",
                      })}
                      type="text"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.address?.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address?.state.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="zipcode"
                      className="block mb-2 text-gray-600"
                    >
                      Zipcode
                    </label>
                    <input
                      {...register("address.zipcode", {
                        required: "Zipcode is required",
                        pattern: {
                          value: /^[0-9]{5}(-[0-9]{4})?$/,
                          message: "Invalid zipcode format",
                        },
                      })}
                      type="text"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.address?.zipcode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address?.zipcode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mr-2 rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-gray-700">
                I agree to the{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/shipping-policy"
                  className="text-blue-600 hover:underline"
                >
                  Shipping Policy
                </Link>
              </label>
            </div>

            <div className="mt-6 text-right">
              <button
                type="submit"
                disabled={!isChecked}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors 
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaCheckCircle />
                Place Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
