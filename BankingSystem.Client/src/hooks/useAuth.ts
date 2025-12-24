import { authService } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";

export const useLogin = () => {
  const setToken = useAuthStore((state) => state.setToken);
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (token) => {
        setToken(token);
    }
  })
}

export const useLogout = () => {
    const logout = useAuthStore((state) => state.logout);
    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            logout();
        }
    })
}


