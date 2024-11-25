import getBaseUrl from "@/utils/baseURL";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface IAddress {
  streetAddress: string;
  city: string;
  country?: string;
  state?: string;
  zipcode?: string;
}

// Interface for Order
export interface IOrder {
  _id: string;
  name: string;
  email: string;
  address: IAddress;
  phone: number;
  productIds: string[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderRequest {
  name: string;
  email: string;
  address: IAddress;
  phone: string;
  productIds: string[];
  totalPrice: number;
}

const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/orders`,
    credentials: "include",
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    createOrder: builder.mutation<IOrder, CreateOrderRequest>({
      query: (newOrder) => ({
        url: "/",
        method: "POST",
        body: newOrder,
        credentials: "include",
      }),
    }),
    getOrderByEmail: builder.query<IOrder[], string>({
      query: (email) => ({
        url: `/email/${email}`,
      }),
      providesTags: ["Orders"],
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderByEmailQuery } = ordersApi;
export default ordersApi;
