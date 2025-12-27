import type React from "react";
import { Layout as AntLayout } from "antd";
import { Sidebar } from "@/components/SideBar";
import { AppHeader } from "./Header";
import { useThemeStore } from "../stores/themeStore";

interface LayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode } = useThemeStore()

  return (
    <AntLayout
      className={`app-layout ${isDarkMode ? "dark-mode" : ""}`}
      style={{
        height: "100vh",          
        // overflow: "hidden",  
        background: isDarkMode ? "#000000" : "#f5f5f5",
      }}
    >
      <Sidebar />

      <AntLayout style={{ height: "100%" }}>
        <AppHeader />

        <AntLayout.Content
          className="layout-content"
          style={{
            overflowY: "auto",   
            padding: 24,
          }}
        >
          {children}
        </AntLayout.Content>
      </AntLayout>
    </AntLayout>
  )
}
