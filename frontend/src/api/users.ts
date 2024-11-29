import getBaseUrl from "@/utils/baseURL";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IBook } from "./types";

// Base axios instance
const api = axios.create({
  baseURL: `${getBaseUrl()}/api/auth`,
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

export const useUserFavoriteBooks = (email: string) => {
  return useQuery<IBook[]>({
    queryKey: ["favorites", email], // Include email in the queryKey
    queryFn: () =>
      api
        .post("/favorites", { email }) // Pass email in the body
        .then((res) => res.data.books),
    enabled: !!email, // Ensure the query runs only if email is provided
  });
};
