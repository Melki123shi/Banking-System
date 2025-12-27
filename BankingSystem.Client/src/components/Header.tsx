"use client"

import type React from "react"
import { Layout, Input, Button, Dropdown, Space, Avatar, Tabs, Badge } from "antd"
import { SearchOutlined, BgColorsOutlined, EllipsisOutlined, BellOutlined, MailOutlined } from "@ant-design/icons"
import { useThemeStore } from "../stores/themeStore";

const { Header } = Layout

interface HeaderProps {
  onSearch?: (value: string) => void
}

export const AppHeader: React.FC<HeaderProps> = ({ onSearch }) => {
  const { isDarkMode, toggleDarkMode } = useThemeStore()

  const profileMenu = [
    {
      key: "profile",
      label: "Profile",
    },
    {
      key: "settings",
      label: "Settings",
    },
    {
      key: "logout",
      label: "Logout",
    },
  ]

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
              <Button type="text" icon={<BellOutlined style={{ fontSize: "16px" }} />} />
            </Badge>

            <Button type="text" icon={<MailOutlined style={{ fontSize: "16px" }} />} />

            <Button
              type="text"
              icon={<BgColorsOutlined style={{ fontSize: "16px" }} />}
              onClick={toggleDarkMode}
              title="Toggle Dark Mode"
            />

            <Button type="text" icon={<EllipsisOutlined style={{ fontSize: "16px" }} />} />

            <Dropdown menu={{ items: profileMenu }} placement="bottomRight">
              <Avatar style={{ cursor: "pointer", background: "#1890ff" }} size="large">
                TP
              </Avatar>
            </Dropdown>

            <span className="user-name">Timothy Pena</span>
          </Space>
        </div>
      </div>
    </Header>
  )
}
