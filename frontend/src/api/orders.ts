import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import getBaseUrl from "@/utils/baseURL";
import { CreateOrderRequest, IOrder } from "./types";

const api = axios.create({
  baseURL: `${getBaseUrl()}/api/orders`,
  withCredentials: true,
});

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newOrder: CreateOrderRequest) => api.post("/", newOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useGetOrdersByEmail = (email: string) => {
  return useQuery<IOrder[]>({
    queryKey: ["orders", email],
    queryFn: async () => {
      const { data } = await api.get(`/email/${email}`);
      return data;
    },
    enabled: !!email,
  });
};
