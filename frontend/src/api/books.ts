import getBaseUrl from "@/utils/baseURL";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { IBook } from "./types";

// Base axios instance
const api = axios.create({
  baseURL: `${getBaseUrl()}/api/books`,
  withCredentials: true,
});

// Interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

export const fetchBooks = async ({
  queryKey,
  signal: abortSignal,
}: {
  queryKey: QueryKey;
  signal?: AbortSignal;
}) => {
  const [, searchTerm, page = 1] = queryKey;

  if (!searchTerm) return [];

  try {
    const { data } = await api.get<{ books: IBook[] }>("/search", {
      params: {
        query: searchTerm,
        page,
        limit: 10,
      },
      signal: abortSignal,
    });
    return data.books;
  } catch (error) {
    // Handle cancellation gracefully
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
      return [];
    }
    throw error;
  }
};

export const useToggleFavoriteBook = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.post(`/${id}/favorite`, { userId }),
    onSuccess: (_, id) => {
      // Invalidate queries related to books and favorites to reflect updates
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["book", id] });
    },
  });
};
