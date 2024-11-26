import getBaseUrl from "@/utils/baseURL";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DashboardData } from "./types";

const fetchDashboardStats = async (): Promise<DashboardData> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const { data } = await axios.get<DashboardData>(
    `${getBaseUrl()}/api/admin/stats`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return data;
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Cache data for 10 minutes (replaced cacheTime)
    retry: 1, // Retry once on failure
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
};
