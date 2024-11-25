import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/redux/features/cart/cartSlice";
import booksApi from "@/redux/features/books/booksApi";
import ordersApi from "@/redux/features/orders/ordersApi";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(booksApi.middleware, ordersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
