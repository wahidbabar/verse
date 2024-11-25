import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "@/utils/baseURL";

// Shared interfaces
export interface IBook {
  _id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  trending?: boolean;
  coverImage: string;
  oldPrice?: number;
  newPrice: number;
  createdAt?: string;
}

// Request interfaces
export interface CreateBookRequest {
  title: string;
  author: string;
  description: string;
  category: string;
  trending?: boolean;
  coverImage: string;
  oldPrice?: number;
  newPrice: number;
}

export interface UpdateBookRequest {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  trending?: boolean;
  coverImage: string;
  oldPrice?: number;
  newPrice: number;
}

// Response interfaces
interface BookResponse {
  message: string;
  book: IBook;
}

interface BooksResponse {
  books: IBook[];
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/books`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const booksApi = createApi({
  reducerPath: "booksApi",
  baseQuery,
  tagTypes: ["Books"],
  endpoints: (builder) => ({
    fetchAllBooks: builder.query<BooksResponse, void>({
      query: () => "/",
      providesTags: ["Books"],
    }),
    fetchBookById: builder.query<BookResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Books", id }],
    }),
    addBook: builder.mutation<BookResponse, CreateBookRequest>({
      query: (newBook) => ({
        url: `/create-book`,
        method: "POST",
        body: newBook,
      }),
      invalidatesTags: ["Books"],
    }),
    updateBook: builder.mutation<BookResponse, UpdateBookRequest>({
      query: ({ id, ...rest }) => ({
        url: `/edit/${id}`,
        method: "PUT",
        body: rest,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Books"],
    }),
    deleteBook: builder.mutation<BookResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Books"],
    }),
  }),
});

export const {
  useFetchAllBooksQuery,
  useFetchBookByIdQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = booksApi;

export default booksApi;
