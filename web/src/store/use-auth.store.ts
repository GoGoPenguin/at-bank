import { create } from "zustand";
import { type User } from "../types/user.type";

interface AuthState {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  accessToken: undefined,
  refreshToken: undefined,
  setUser: (user: User) => set({ user }),
}));
