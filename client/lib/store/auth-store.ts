import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, UserRoleType } from "@/types/auth";
import {
  setCookie,
  getCookie,
  removeCookie,
  COOKIE_AUTH_TOKEN,
  COOKIE_USER_ROLE,
} from "@/lib/cookies";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (isInitialized: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      setAuth: (token: string, user: User) => {
        setCookie(COOKIE_AUTH_TOKEN, token, 7);
        if (user.role?.type) {
          setCookie(COOKIE_USER_ROLE, user.role.type, 7);
        }
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
      },

      setUser: (user: User) => {
        if (user.role?.type) {
          setCookie(COOKIE_USER_ROLE, user.role.type, 7);
        }
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        setCookie(COOKIE_AUTH_TOKEN, token, 7);
        set({ token, isAuthenticated: true });
      },

      clearAuth: () => {
        removeCookie(COOKIE_AUTH_TOKEN);
        removeCookie(COOKIE_USER_ROLE);
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
      },

      setLoading: (isLoading: boolean) => set({ isLoading }),
      setInitialized: (isInitialized: boolean) => set({ isInitialized }),
    }),
    {
      name: "lms_auth_storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // If token exists in storage, ensure cookies are in sync
          if (state.token) {
            setCookie(COOKIE_AUTH_TOKEN, state.token, 7);
          }
          if (state.user?.role?.type) {
            setCookie(COOKIE_USER_ROLE, state.user.role.type, 7);
          }
          state.setInitialized(true);
        }
      },
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
