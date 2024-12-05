import getBaseUrl from "@/utils/baseURL";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IBook } from "./types";
import { isTokenValid } from "@/lib/utils";

// Base axios instance
const api = axios.create({
  baseURL: `${getBaseUrl()}/api/users`,
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

export const useUserFavoriteBooks = (userId: string) => {
  const validToken = isTokenValid();
  return useQuery<IBook[]>({
    queryKey: ["favorites", userId],
    queryFn: () =>
      api.get(`/favorites/${userId}`).then((res) => res.data.books),
    enabled: validToken,
  });
};
