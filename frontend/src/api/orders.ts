import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import getBaseUrl from "@/utils/baseURL";
import { CreateOrderRequest, IAddress, IOrder, IOrderBook } from "./types";

const api = axios.create({
  baseURL: `${getBaseUrl()}/api/orders`,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const useCreateCheckoutSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: {
      books: IOrderBook[];
      userId: string;
      email: string;
      address: IAddress;
      phone: string;
    }) => api.post("/create-checkout-session", orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useCreateCashOnDeliveryOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) => api.post("/cod", orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useGetOrdersByUserId = (userId: string) => {
  return useQuery<IOrder[]>({
    queryKey: ["orders", userId],
    queryFn: async () => {
      const { data } = await api.get(`/user/${userId}`);
      return data;
    },
    enabled: !!userId,
  });
};

export const useGetOrderById = (orderId: string) => {
  return useQuery<IOrder>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data } = await api.get(`/${orderId}`);
      return data;
    },
    enabled: !!orderId,
  });
};
