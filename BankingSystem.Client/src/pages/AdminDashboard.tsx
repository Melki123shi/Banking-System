import { UserComponent } from "@/components/admin/UserComponent";
import { AccountComponent } from "@/components/admin/AccountComponent";
import { TransactionComponent } from "@/components/admin/TransactionComponent";
import { Space, Typography } from "antd";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { Footer } from "antd/es/layout/layout";

export function AdminDashboard() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <div>Loading...</div>;
  }
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  return (
    <div className="min-h-screen p-8">
      <Typography.Title
        level={2}
        style={{
          margin: 0,
          marginBottom: 43,
          color: isDarkMode ? "#dddbdbff" : "#141414",
        }}
      >
        👋 Hello, {user.name}
      </Typography.Title>
      <Space
        orientation="vertical"
        size="large"
        style={{ display: "flex", gap: "40px" }}
      >
        <UserComponent />
        <AccountComponent />
        <TransactionComponent />
      </Space>
      <Space style={{ height: "40px" }} />
      {/* <Footer
        style={{
          marginBottom: "0px",
          textAlign: "center",
          marginTop: "40px",
          color: isDarkMode ? "#888888" : "#444444",
          boxShadow: isDarkMode
            ? "0 -1px 4px rgba(0, 0, 0, 0.6)"
            : "0 -1px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        BankingSystem ©2024 Created by tMelkishi
      </Footer> */}
    </div>
  );
}
