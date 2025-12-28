import { Row, Col } from "antd";
import { TransactionComponent } from "@/components/user/TransactionComponent";
import { AppLayout } from "@/components/common/Layout";
import { AccountInfoCard } from "@/components/user/AccountInfoCard";
import { useAuthStore } from "@/stores/authStore";
import { useUserAccounts } from "@/hooks/useAccount";

export const UserDashboard = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <div>Loading...</div>;
  }
  const accounts = useUserAccounts(user.id);
  console.log("account", accounts)

  return (
    <AppLayout>
      <Col>
        <h1>Accounts</h1>
      <Row gutter={[24, 24]}>
        {accounts.data?.map((account) => (
          <Col xs={24} md={12} lg={8} key={account.id}>
            <AccountInfoCard account={account} />
          </Col>
        ))}
      </Row>

        <Col xs={24}>
          <TransactionComponent />
        </Col>
      </Col>
    </AppLayout>
  );
};

export default UserDashboard;
