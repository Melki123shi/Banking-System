import { useEffect } from "react";
import { useAccountStore } from "@/stores/accountStore";
import { useGetAccounts } from "@/hooks/useAccount";
import { DataTable } from "@/components/DataTable";
import { Layout, Card, Statistic, Tag, Row, Col, message } from "antd";
import {
  DollarOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";

const AccountComponent = () => {
  const { accounts } = useAccountStore();
  const { isLoading } = useGetAccounts(); // fetch on mount
  const getAccountsMutation = useGetAccounts();

  const handleGetAccounts = async () => {
    try {
      await getAccountsMutation.refetch();
      message.success("Accounts fetched successfully");
    } catch {
      message.error("Failed to fetch accounts");
    }
  };

  useEffect(() => {
    handleGetAccounts();
  }, []);

  const accountColumns = [
    {
      title: "Account No.",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "Owner",
      dataIndex: ["userName"],
      key: "user",
      render: (userName?: string) => userName ?? "—",
    },
    {
      title: "Type",
      dataIndex: "accountType",
      key: "accountType",
      render: (type: string) => <Tag color="blue">{type?.toUpperCase()}</Tag>,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (balance: number) => <span>${balance?.toLocaleString()}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "Active"
            ? "green"
            : status === "Frozen"
            ? "orange"
            : status === "Closed"
            ? "red"
            : "default";

        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Layout.Content className="p-8">
        {/* Stats */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Accounts"
                value={Array.isArray(accounts) ? accounts.length : 0}
                prefix={<CreditCardOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Balance"
                value={
                  Array.isArray(accounts)
                    ? accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)
                    : 0
                }
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Card>
          <DataTable
            title="Accounts"
            loading={isLoading}
            dataSource={Array.isArray(accounts) ? accounts : []}
            columns={accountColumns}
            rowKey="id"
          />
        </Card>
      </Layout.Content>
    </Layout>
  );
};

export default AccountComponent;
