import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface FavoritesState {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addToFavorites: (product) => {
        set((state) => {
          if (state.favorites.find((p) => p.id === product.id)) {
            return state;
          }
          return { favorites: [...state.favorites, product] };
        });
      },

      removeFromFavorites: (productId) => {
        set((state) => ({
          favorites: state.favorites.filter((p) => p.id !== productId),
        }));
      },

      isFavorite: (productId) => {
        return get().favorites.some((p) => p.id === productId);
      },

      toggleFavorite: (product) => {
        const isFav = get().isFavorite(product.id);
        if (isFav) {
          get().removeFromFavorites(product.id);
        } else {
          get().addToFavorites(product);
        }
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
);
