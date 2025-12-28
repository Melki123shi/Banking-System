import { Card, Typography } from "antd";
import { useAccountStore } from "@/stores/accountStore";

const { Title, Text } = Typography;

export const SelectedAccountSummary = () => {
  const selectedAccount = useAccountStore(
    (state) => state.selectedAccount
  );

  if (!selectedAccount) return null;

  return (
    <Card>
      <Title level={4}>Selected Account</Title>
      <Text>{selectedAccount.accountNumber}</Text>
    </Card>
  );
};
