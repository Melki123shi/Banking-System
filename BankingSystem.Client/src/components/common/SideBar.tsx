import type React from "react";
import { Layout, Menu, Image, Button } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  AccountBookOutlined,
  TransactionOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
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
  const { sidebarCollapsed, toggleSidebar, isDarkMode } = useThemeStore();

  const getSelectedKey = () => {
    const path = location.pathname;
    if (routeToKey[path]) return [routeToKey[path]];

    const matchedPath = Object.keys(routeToKey).find((key) => 
      path.startsWith(key) && key !== "/admin"
    );
    return matchedPath ? [routeToKey[matchedPath]] : ["overview"];
  };

  const menuItems = [
    {
      key: "admin-group",
      type: "group" as const,
      label: !sidebarCollapsed ? "ADMINISTRATION" : null,
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
     collapsible
      collapsed={sidebarCollapsed}
      trigger={null} // This hides the default bottom bar
      width={250}
      theme={isDarkMode ? "dark" : "light"}
      className={`sidebar transition-all duration-300 ${isDarkMode ? "dark-mode" : ""}`}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
        background: isDarkMode ? "#141414" : "#ffffff",
        borderRight: `1px solid ${isDarkMode ? "#434343" : "#f0f0f0"}`,
      }}
    >
      {/* Logo Section */}
      <div 
        className="sidebar-logo flex items-center gap-3 px-4 py-6"
        style={{ minHeight: "64px" }}
      >
        <Image
          src={logo}
          alt="logo"
          width={40}
          preview={false}
          className="border border-[#077dcb] rounded-full shadow-sm"
        />
        {!sidebarCollapsed && (
          <span className="text-[#077dcb] font-bold text-xl tracking-tight whitespace-nowrap">
            BankSy
          </span>
        )}
        <Button
          type="text"
          icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => toggleSidebar()}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
            color: isDarkMode ? "#e7e7e7" : "#2c2c2c"
          }}
        />
      </div>

      {/* Menu Section */}
      <Menu
        mode="inline"
        items={menuItems}
        selectedKeys={getSelectedKey()}
        theme={isDarkMode ? "dark" : "light"}
        style={{
          background: "transparent",
          border: "none",
        }}
      />
    </Sider>
  );
};