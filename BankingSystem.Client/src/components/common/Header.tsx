"use client";

import type React from "react";
import {
  Layout,
  Input,
  Button,
  Dropdown,
  Space,
  Avatar,
  Badge,
} from "antd";
import {
  SearchOutlined,
  BgColorsOutlined,
  EllipsisOutlined,
  BellOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useThemeStore } from "@/stores/themeStore";
import { useLogout } from "@/hooks/useAuth";

const { Header } = Layout;

interface HeaderProps {
  onSearch?: (value: string) => void;
}

export const AppHeader: React.FC<HeaderProps> = ({ onSearch }) => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { mutate: logout, isPending } = useLogout();

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
      className={`app-header ${isDarkMode ? "dark-mode" : ""}`}
      style={{
        background: isDarkMode ? "#141414" : "#ffffff",
        borderBottom: `1px solid ${isDarkMode ? "#434343" : "#f0f0f0"}`,
      }}
    >
      <div className="header-content">
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
            <Badge count={3} offset={[-5, 5]}>
              <Button type="text" icon={<BellOutlined />} />
            </Badge>

            <Button type="text" icon={<MailOutlined />} />

            <Button
              type="text"
              icon={<BgColorsOutlined />}
              onClick={toggleDarkMode}
              title="Toggle Dark Mode"
            />

            <Button type="text" icon={<EllipsisOutlined />} />

            <Dropdown menu={{ items: profileMenu }} placement="bottomRight">
              <Avatar
                style={{ cursor: "pointer", background: "#1890ff" }}
                size="large"
              >
                TP
              </Avatar>
            </Dropdown>

            <span className="user-name">Timothy Pena</span>
          </Space>
        </div>
      </div>
    </Header>
  );
};
