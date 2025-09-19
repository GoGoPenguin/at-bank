import { create } from "zustand";
import { type User } from "../types/user.type";

interface AuthState {
  user?: User;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  setUser: (user: User) => set({ user }),
}));
