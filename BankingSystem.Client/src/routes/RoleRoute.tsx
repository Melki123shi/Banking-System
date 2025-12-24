import { Navigate } from "react-router";
import type { PropsWithChildren } from "react";
import { useAuthStore } from "@/stores/authStore";

export function RoleRoute({
  role,
  children,
}: PropsWithChildren<{
  role: "admin" | "user";
}>) {
  const user = useAuthStore((state) => state.user);

  if (user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
