import type React from "react";
import { Layout as AntLayout } from "antd";
import { AppHeader } from "./Header";
import { useThemeStore } from "@/stores/themeStore";

interface LayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <AntLayout
      style={{
        height: "100vh",
      }}
    >
      <AntLayout style={{ height: "100%" }}>
        <AppHeader />

        <AntLayout.Content
          className="layout-content"
          style={{
            overflowY: "auto",
            padding: 24,
            backgroundColor: isDarkMode ? "#000" : "#ffffff",
          }}
        >
          {children}
        </AntLayout.Content>
      </AntLayout>
    </AntLayout>
  );
};
