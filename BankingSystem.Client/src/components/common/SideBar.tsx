import type React from "react";
import { Layout, Menu, Image } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  AccountBookOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router";
import { useThemeStore } from "../../stores/themeStore";
import logo from "@/assets/logo.png";

const { Sider } = Layout;

const routeToKey: Record<string, string> = {
  "/admin": "overview",
  "/admin/customers": "customers",
  "/admin/accounts": "accounts",
  "/admin/transactions": "transactions",
};

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey =
    routeToKey[location.pathname] ??
    Object.keys(routeToKey).find((path) =>
      location.pathname.startsWith(path)
    );

  const { sidebarCollapsed, toggleSidebar, isDarkMode } = useThemeStore();

  const menuItems = [
    {
      key: "admin",
      type: "group" as const,
      children: [
        {
          key: "overview",
          icon: <DashboardOutlined />,
          label: "Overview",
          onClick: () => navigate("/admin"),
        },
        {
          key: "customers",
          icon: <UserOutlined />,
          label: "Customers",
          onClick: () => navigate("/admin/customers"),
        },
        {
          key: "accounts",
          icon: <AccountBookOutlined />,
          label: "Accounts",
          onClick: () => navigate("/admin/accounts"),
        },
        {
          key: "transactions",
          icon: <TransactionOutlined />,
          label: "Transactions",
          onClick: () => navigate("/admin/transactions"),
        },
      ],
    },
  ];

  return (
    <Sider
      collapsed={sidebarCollapsed}
      onCollapse={toggleSidebar}
      width={250}
      className={`sidebar ${isDarkMode ? "dark-mode" : ""}`}
      style={{
        background: isDarkMode ? "#141414" : "#ffffff",
      }}
    >
      {/* Logo */}
      <div className="sidebar-logo flex items-center gap-2 px-4 py-4">
        <Image
          src={logo}
          alt="logo"
          width={48}
          preview={false}
          className="border border-[#077dcb] rounded-full shadow-md"
        />
        {!sidebarCollapsed && (
          <span className="text-[#077dcb] font-semibold text-lg">
            BankSy
          </span>
        )}
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        items={menuItems}
        selectedKeys={selectedKey ? [selectedKey] : []}
        theme={isDarkMode ? "dark" : "light"}
        style={{
          background: "transparent",
          border: "none",
        }}
      />
    </Sider>
  );
};
