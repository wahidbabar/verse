import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { IBook } from "../api/types";

interface CartState {
  cartItems: IBook[];
  addToCart: (book: IBook) => void;
  removeFromCart: (book: IBook) => void;
  clearCart: () => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],

      addToCart: (book) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item._id === book._id
          );

          if (!existingItem) {
            toast.success("Product Added to the Cart", {
              position: "top-right",
              duration: 1500,
            });

            return { cartItems: [...state.cartItems, book] };
          } else {
            toast.warning("Already Added to the Cart", {
              description: "This item is already in your cart.",
              position: "top-right",
              action: {
                label: "OK",
                onClick: () => {},
              },
            });

            return state;
          }
        }),

      removeFromCart: (book) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item._id !== book._id),
        })),

      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "cart-storage", // unique name
      storage: createJSONStorage(() => localStorage), // correct way to specify localStorage
    }
  )
);

export default useCartStore;
