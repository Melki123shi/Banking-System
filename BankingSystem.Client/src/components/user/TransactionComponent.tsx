import { useState } from "react";
import { useGetUserTransactions } from "@/hooks/useTransaction";
import { useAuthStore } from "@/stores/authStore";
import { DataTable } from "@/components/common/DataTable";
import { Layout, Card, Statistic, Tag, Row, Col } from "antd";
import {
  DollarOutlined,
} from "@ant-design/icons";

export const TransactionComponent = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const user = useAuthStore((state : any) => state.user);
  if (!user) {
    return <div>Please log in to view your transactions.</div>;
  }
  const {data: transactions, isLoading, refetch} = useGetUserTransactions(user.id, pageNumber, pageSize);
  console.log(transactions, "dataaaaaaaaaaaaaaa")

  const transactionColumns = [
    {
      title: "Recipent Name",
      dataIndex: "recipentName",
      key: "recipentName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (id?: string) => id ?? "—",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag color={type === "Deposit" ? "green" : type === "Transfer" ? "gold" : "red"}>{type}</Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number, record: any) => (
        <span>
          {record.type === "Deposit" ? "+" : "-"} ${amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "Completed"
            ? "green"
            : status === "Pending"
            ? "orange"
            : status === "Failed"
            ? "red"
            : "default";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "From Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
      render: (id?: string) => id ?? "—",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
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
                title="Recent Transactions"
                value={transactions?.length || 0}
                prefix={<DollarOutlined />}
              />
              {/* <Tag> */}
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Card>
          <DataTable
            title="Transactions"
            loading={isLoading}
            dataSource={transactions || []}
            columns={transactionColumns}
            rowKey="id"
            pagination={{
              current: pageNumber,
              pageSize,
              onChange: (page, size) => {
                setPageNumber(page);
                setPageSize(size);
              },
              total: transactions?.length || 0,
            }}
          />
        </Card>
      </Layout.Content>
    </Layout>
  );
};

export default TransactionComponent;
