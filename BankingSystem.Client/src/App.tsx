"use client";

import { Outlet } from "react-router";
import { ConfigProvider, theme as antdTheme } from "antd";
import { useThemeStore } from "@/stores/themeStore";

function App() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        components: {
          Card: {
            colorBgContainer: "transparent",
          },
          Input: {
            colorBgContainer: "transparent",
          },
          Table: {
            colorBgContainer: isDarkMode ? "#141414" : "fff",
          },
        },
        token: {
          colorBgLayout: isDarkMode ? "#141414" : "#fff",
        },
      }}
    >
      <Outlet />
    </ConfigProvider>
  );
}

export default App;
