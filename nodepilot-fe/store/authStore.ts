import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: { id: number; email: string } | null;
  setAuth: (token: string, user: { id: number; email: string }) => void;
  clearAuth: () => void;
  isHydrated: boolean;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
      isHydrated: false,
      setHydrated: () => set({ isHydrated: true }),
    }),
    { name: 'auth-storage' },
  ),
);
