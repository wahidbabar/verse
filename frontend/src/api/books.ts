import getBaseUrl from "@/utils/baseURL";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CreateBookRequest, IBook, UpdateBookRequest } from "./types";

// Base axios instance
const api = axios.create({
  baseURL: `${getBaseUrl()}/api/books`,
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

// Book-related hooks
export const useFetchBooks = () => {
  return useQuery<IBook[]>({
    queryKey: ["books"],
    queryFn: async () => {
      const { data } = await api.get("/");
      return data.books;
    },
  });
};

export const useFetchBookById = (id: string) => {
  return useQuery<IBook>({
    queryKey: ["book", id],
    queryFn: async () => {
      const { data } = await api.get(`/${id}`);
      return data.book;
    },
    enabled: !!id,
  });
};

export const useAddBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newBook: CreateBookRequest) =>
      api.post("/create-book", newBook),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...bookData }: UpdateBookRequest) =>
      api.put(`/edit/${id}`, bookData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["book", variables.id] });
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
