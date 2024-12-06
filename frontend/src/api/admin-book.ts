import getBaseUrl from "@/utils/baseURL";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CreateBookRequest, UpdateBookRequest } from "./types";

// Base axios instance
const api = axios.create({
  baseURL: `${getBaseUrl()}/api/books`,
  withCredentials: true,
});

// Interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const useAddBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newBook: CreateBookRequest) => {
      const formData = new FormData();
      // Append all book details to FormData
      Object.keys(newBook).forEach((key) => {
        if (key === "coverImage") {
          formData.append("image", newBook.coverImage as File);
        } else {
          formData.append(
            key,
            newBook[key as keyof CreateBookRequest] as string
          );
        }
      });

      return api.post("/create-book", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...bookData }: UpdateBookRequest) => {
      const formData = new FormData();

      // Append all book details to FormData
      (Object.keys(bookData) as (keyof typeof bookData)[]).forEach((key) => {
        if (key === "coverImage" && bookData.coverImage instanceof File) {
          formData.append("image", bookData.coverImage);
        } else if (key !== "coverImage") {
          formData.append(key, String(bookData[key]));
        }
      });

      return api.put(`/edit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries to trigger refetching
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["book", variables.id] });
    },
    onError: (error) => {
      console.error("Book update error:", error);
      throw error;
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};
