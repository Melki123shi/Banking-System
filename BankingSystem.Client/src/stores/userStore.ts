import { create } from "zustand";
import type { User } from "@/entities/user";

type UserState = {
  users: User[] | [];
  setCurrentUser: (
    user: Pick<User, "name" | "phoneNumber" | "isActive" | "password">
  ) => void;
  updateUserStatus: (userId: string, isActive: boolean) => void;
};

export const useUserStore = create<UserState>((set) => ({
  users: [],
  setCurrentUser: (userInput) =>
  set((state) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      name: userInput.name,
      phoneNumber: userInput.phoneNumber,
      password: userInput.password,
      role: "user",
      isActive: userInput.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return {
      users: [...state.users, newUser],
    };
  }),

  updateUserStatus: (userId: string, isActive: boolean) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, isActive } : user
      ),
    })),
}));
