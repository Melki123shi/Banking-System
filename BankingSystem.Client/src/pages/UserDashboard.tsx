import { Row, Col, Typography } from "antd";
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

  return (
    <AppLayout>
      <Col span={24} style={{ display: "flex", flexDirection: "column", gap: "24px", margin: "auto" , maxWidth: "80%"}}>
        <Typography.Title level={2} style={{ margin: 0, color: isDarkMode ? "#ffffffff" : "#111"} }>
          Hello, {user.name} 👋
        </Typography.Title>

        <Col>
         <h3 className="text-lg font-semibold">Your Accounts  </h3>
        </Col>
        <Row gutter={[24, 24]}>
          {(accounts?.data || []).map((account) => (
            <Col xs={24} md={12} lg={8} key={account.id}>
              <AccountInfoCard account={account} />
            </Col>
          ))}
        </Row>

        <Col xs={24} md={24} lg={24}>
          <TransactionComponent />
        </Col>
      </Col>
    </AppLayout>
  );
};

export default UserDashboard;
