import { Row, Col, Statistic, Select, Typography } from "antd";
import { TransactionComponent } from "@/components/user/TransactionComponent";
import { AccountInfoCard } from "@/components/user/AccountInfoCard";
import { useAuthStore } from "@/stores/authStore";
import { useUserAccounts } from "@/hooks/useAccount";
import { AppLayout } from "@/components/common/Layout";
import { useThemeStore } from "@/stores/themeStore";

export const UserDashboard = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <div>Loading...</div>;
  }
  const accounts = useUserAccounts(user.id);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  console.log("account", accounts);

  return (
    <AppLayout isAdmin={false}>
      <Col span={24} style={{ display: "flex", flexDirection: "column", gap: "24px", margin: "auto" , maxWidth: "80%" }}>
        <Typography.Title level={2} style={{ margin: 0, color: isDarkMode ? "#ccc" : "#444"} }>
          Hello, {user.name} 👋
        </Typography.Title>

        <Col>
          <Typography.Title
            level={3}
            style={{ margin: 0, color: isDarkMode ? "#ccc" : "#444" }}
          >
            Your Accounts
          </Typography.Title>
        </Col>
        <Row gutter={[24, 24]}>
          {accounts.data?.map((account) => (
            <Col xs={24} md={12} lg={8} key={account.id}>
              <AccountInfoCard account={account} />
            </Col>
          ))}
        </Row>

        <Typography.Title level={3} style={{ margin: 0, color: isDarkMode ? "#ccc" : "#444" }}>
          Recent Transactions
        </Typography.Title>

        <Col xs={24} md={24} lg={24}>
          <TransactionComponent />
        </Col>
      </Col>
    </AppLayout>
  );
};

export default UserDashboard;
