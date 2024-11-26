import getBaseUrl from "@/utils/baseURL";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DashboardData } from "./types";

// Base axios instance
const api = axios.create({
  baseURL: `${getBaseUrl()}/api/admin`,
  withCredentials: true,
});

// Interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch dashboard stats
export const useDashboardStats = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const { data } = await api.get("/stats");
      return data;
    },
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Cache data for 10 minutes (replaced cacheTime)
    retry: 1, // Retry once on failure
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
};
