import { Navigate } from "react-router";
import type { PropsWithChildren } from "react";
import { useAuthStore } from "@/stores/authStore";
import { jwtDecode } from "jwt-decode";

export function RoleRoute({
  role,
  children,
}: PropsWithChildren<{
  role: "Admin" | "Customer";
}>) {

  const accessToken = useAuthStore((state) => state.accessToken);
  const decoded = jwtDecode<any>(accessToken!);
  const decodedRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;

  if (decodedRole !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
