import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "@/utils/baseURL";

interface Order {
  _id: string;
  email: string;
  items: Array<{
    _id: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

interface CreateOrderRequest {
  email: string;
  items: Array<{
    _id: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/orders`,
    credentials: "include",
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (newOrder) => ({
        url: "/",
        method: "POST",
        body: newOrder,
        credentials: "include",
      }),
    }),
    getOrderByEmail: builder.query<Order[], string>({
      query: (email) => ({
        url: `/email/${email}`,
      }),
      providesTags: ["Orders"],
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderByEmailQuery } = ordersApi;
export default ordersApi;
