import { authService } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  return useMutation({
    mutationFn: () => authService.logout(refreshToken!),
    onSuccess: () => {
      logout();
    },
  });
};


