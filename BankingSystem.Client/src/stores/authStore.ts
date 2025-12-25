// src/stores/authStore.ts
import { create } from "zustand";
import type { User } from "@/entities/user";

type AuthState = {
  user: User | null;

  accessToken: string | null;
  refreshToken: string | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (data: {
    accessToken: string;
    refreshToken: string;
    user?: User;
  }) => void;

  setUser: (user: User) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  accessToken: null,
  refreshToken: null,

  isAuthenticated: false,
  isLoading: false,

  setAuth: ({ accessToken, refreshToken, user }) =>
    set({
      accessToken,
      refreshToken,
      user: user ?? null,
      isAuthenticated: true,
    }),

  setUser: (user) => set({ user }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    }),
}));
