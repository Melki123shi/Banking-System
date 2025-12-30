import { UserComponent } from "@/components/admin/UserComponent";
import { AccountComponent } from "@/components/admin/AccountComponent";
import { TransactionComponent } from "@/components/admin/TransactionComponent";
import { Space, Typography } from "antd";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";

export function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  
    if (!user) {
      return <div>Loading...</div>;
    }
     const isDarkMode = useThemeStore((state) => state.isDarkMode);
  return (
    <div className="min-h-screen p-8">
      <Typography.Title level={2} style={{ margin: 0, marginBottom: 23, color: isDarkMode ? "#ccc" : "#444"} }>
                Hello, {user.name} 👋
              </Typography.Title>
      <UserComponent />
      <AccountComponent />
      <TransactionComponent />
      <Space style={{ height: "40px" }} />
    </div>
  );
}
