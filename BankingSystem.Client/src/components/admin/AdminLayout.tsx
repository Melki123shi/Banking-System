import { Layout } from "antd";
import { Outlet } from "react-router";
import { Sidebar } from "@/components/common/SideBar";
import { AppLayout } from "../common/Layout";

const { Content } = Layout;

const AdminLayout = () => {
  return (
    <Layout>
      <Sidebar />

      <AppLayout>
        <Content
          style={{
            padding: 24,
            overflowY: "auto",
          }}
        >
          <Outlet />
        </Content>
      </AppLayout>
    </Layout>
  );
};

export default AdminLayout;
