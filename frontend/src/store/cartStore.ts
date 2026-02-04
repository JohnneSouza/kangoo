import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, selectedSize?: string, selectedColor?: string, specialNotes?: string) => void;
  removeFromCart: (productId: string, selectedSize?: string, selectedColor?: string, specialNotes?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string, specialNotes?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, quantity, selectedSize, selectedColor, specialNotes) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.selectedSize === selectedSize &&
              item.selectedColor === selectedColor &&
              item.specialNotes === specialNotes
          );

          if (existingIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            return { items: newItems };
          }

          return {
            items: [...state.items, { product, quantity, selectedSize, selectedColor, specialNotes }],
          };
        });
      },

      removeFromCart: (productId, selectedSize, selectedColor, specialNotes) => {
        set((state) => ({
          items: state.items.filter((item) => 
            !(item.product.id === productId &&
              item.selectedSize === selectedSize &&
              item.selectedColor === selectedColor &&
              item.specialNotes === specialNotes)
          ),
        }));
      },

      updateQuantity: (productId, quantity, selectedSize, selectedColor, specialNotes) => {
        set((state) => ({
          items: state.items.map((item) =>
            (item.product.id === productId &&
              item.selectedSize === selectedSize &&
              item.selectedColor === selectedColor &&
              item.specialNotes === specialNotes)
              ? { ...item, quantity: Math.max(0, quantity) }
              : item
          ).filter((item) => item.quantity > 0),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
