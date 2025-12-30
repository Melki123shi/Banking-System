import type React from "react";
import { Layout as AntLayout } from "antd";
import { AppHeader } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<LayoutProps> = ({ children}) => {

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
          }}
        >
          {children}
        </AntLayout.Content>
      </AntLayout>
    </AntLayout>
  )
}
