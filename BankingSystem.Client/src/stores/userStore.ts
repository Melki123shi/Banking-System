import { create } from "zustand";
import type { User } from "@/entities/user";

type UserState = {
  selectedUser?: User;
  setSelectedUser: (user?: User) => void;
};

export const useUserStore = create<UserState>((set) => ({
  selectedUser: undefined,
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
