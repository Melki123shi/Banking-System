"use client";

import type React from "react";
import { Layout, Button, Dropdown, Space, Avatar, Image } from "antd";
import { BgColorsOutlined } from "@ant-design/icons";
import { useThemeStore } from "@/stores/themeStore";
import { useLogout } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import LogoImage from "@/assets/logo.png";

const { Header } = Layout;

export const AppHeader: React.FC = () => {
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
        background: isDarkMode ? "#141414" : "#ffffff",
        borderBottom: `1px solid ${isDarkMode ? "#434343" : "#f0f0f0"}`,
      }}
    >
      <div
        className={`header-content flex ${
          user?.role === "Customer" ? "justify-between" : "justify-end"
        }`}
      >
        {user?.role === "Customer" && (
          <div className="flex gap-5 items-center">
            <Image
              src={LogoImage}
              alt="logo"
              width={48}
              preview={false}
              className="border border-[#077dcb] rounded-full shadow-md"
            />
            <span className="text-[#077dcb] font-semibold text-lg">BankSy</span>
          </div>
        )}

        <div>
          <Space size="large" style={{
            lineHeight: "25px"
          }}>
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

            <span
              className={`text-[16px] font-[500] min-w-[120px] my-2 ${
                isDarkMode ? "text-[#155399ff]" : "text-[#073c6dff]"
              }`}
            >
                <span>{user?.name}</span> 
                <br />
                {user?.role === "Admin" && <span className="text-green-500">@admin</span>}
            </span>
          </Space>
        </div>
      </div>
    </Header>
  );
};
