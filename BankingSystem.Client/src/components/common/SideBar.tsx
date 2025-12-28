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
  "/": "dashboard",
  "/payments": "payments",
  "/invoices": "invoices",
  "/cards": "cards",
  "/insight": "insight",
  "/rewards": "rewards",
  "/help": "help",
  "/feedback": "feedback",
};

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = routeToKey[location.pathname];

  const { sidebarCollapsed, toggleSidebar, isDarkMode } = useThemeStore();

  const menuItems = [
    {
      key: "",
      label: "",
      type: "group" as const,
      children: [
        {
          key: "overview",
          icon: <DashboardOutlined />,
          label: "Overview",
          onClick: () => navigate("/"),
        },
        {
          key: "users",
          icon: <UserOutlined />,
          label: "Users",
          onClick: () => navigate("/users"),
        },
        {
          key: "accounts",
          icon: <AccountBookOutlined />,
          label: "Accounts",
          onClick: () => navigate("/accounts"),
        },
        {
          key: "transactions",
          icon: <TransactionOutlined />,
          label: "Transactions",
          onClick: () => navigate("/transactions"),
        },
      ],
    },
  ];

  return (
    <Sider
      collapsed={sidebarCollapsed}
      onCollapse={toggleSidebar}
      width={250}
      className={`sidebar ${isDarkMode ? "dark-mode" : ""} h-full`}
      style={{
        background: isDarkMode ? "#141414" : "#ffffff",
      }}
    >
      <div className="sidebar-logo">
        <Image
          src={logo}
          alt="logo"
          width={64}
          className="border border-[#077dcb] rounded-full shadow-md"
        ></Image>
        {!sidebarCollapsed && <span className="text-[#077dcb]">BankSy</span>}
      </div>
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
