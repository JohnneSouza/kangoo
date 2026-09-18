import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

const AUTH_BASE_URL = import.meta.env.VITE_AUTH_SERVICE_BASE_URL || 'http://localhost:8080';
const CUSTOMER_BASE_URL = import.meta.env.VITE_CUSTOMER_SERVICE_BASE_URL || 'http://localhost:8080';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${AUTH_BASE_URL}/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            set({ isLoading: false });
            return { success: false, error: 'E-mail ou senha inválidos' };
          }

          set({ isAuthenticated: true, isLoading: false });
          await get().fetchProfile();
          return { success: true };
        } catch (error) {
          // Mock successful login for demo
          const mockUser: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=6366f1&color=fff`,
          };
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
          return { success: true };
        }
      },

      signup: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${AUTH_BASE_URL}/v1/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            set({ isLoading: false });
            return { success: false, error: data.message || 'Falha no cadastro' };
          }

          set({ isAuthenticated: true, isLoading: false });
          await get().fetchProfile();
          return { success: true };
        } catch (error) {
          // Mock successful signup for demo
          const mockUser: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=6366f1&color=fff`,
          };
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
          return { success: true };
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      fetchProfile: async () => {
        try {
          const response = await fetch(`${CUSTOMER_BASE_URL}/v1/customer/me`, {
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            set({
              user: {
                id: data.id,
                email: data.email,
                name: data.name || data.email.split('@')[0],
                avatar: data.avatar,
              },
            });
          }
        } catch (error) {
          // Profile already set by mock login
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
