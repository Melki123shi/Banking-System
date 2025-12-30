"use client";

import type React from "react";
import { Layout, Input, Button, Dropdown, Space, Avatar, Image } from "antd";
import { SearchOutlined, BgColorsOutlined } from "@ant-design/icons";
import { useThemeStore } from "@/stores/themeStore";
import { useLogout } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import LogoImage from "@/assets/logo.png";

const { Header } = Layout;

interface HeaderProps {
  onSearch?: (value: string) => void;
}

export const AppHeader: React.FC<HeaderProps> = ({ onSearch }) => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { mutate: logout, isPending } = useLogout();
  const user = useAuthStore((state) => state.user);

  const profileMenu = [
    {
      key: "logout",
      label: "Logout",
      onClick: () => logout(),
      disabled: isPending,
    },
  ];

  return (
    <Header
      style={{
        background: isDarkMode ? "#000" : "#ffffff",
        borderBottom: `1px solid ${isDarkMode ? "#434343" : "#f0f0f0"}`,
      }}
    >
      <div className="header-content">
        {user?.role === "Customer" && <div className="flex gap-5 items-center">
          <Image
            src={LogoImage}
            alt="logo"
            width={48}
            preview={false}
            className="border border-[#077dcb] rounded-full shadow-md"
          />
          <span className="text-[#077dcb] font-semibold text-lg">BankSy</span>
        </div>}
        <div className="header-left">
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            className="search-input"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>

        <div className="header-right">
          <Space size="large">
            <Button
              type="text"
              icon={<BgColorsOutlined />}
              onClick={toggleDarkMode}
              title="Toggle Dark Mode"
            />
            <Dropdown menu={{ items: profileMenu }} placement="bottomRight">
              <Avatar
                style={{ cursor: "pointer", background: "#073c6dff" }}
                size="large"
              >
                {user?.name[0].toUpperCase()}
              </Avatar>
            </Dropdown>

            <span className="user-name">{user?.name}</span>
          </Space>
        </div>
      </div>
    </Header>
  );
};
