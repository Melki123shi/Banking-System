import { useState } from "react";
import { useGetPaginatedTransactions } from "@/hooks/useTransaction";
import { DataTable } from "@/components/common/DataTable";
import { Layout, Card, Statistic, Tag, Row, Col } from "antd";
import { DollarOutlined } from "@ant-design/icons";

export const TransactionComponent = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useGetPaginatedTransactions(pageNumber, pageSize);

  const transactions = data?.items ?? [];
  const total = data?.totalCount ?? 0;

 const transactionColumns = [
  {
    title: "Transaction ID",
    dataIndex: "transactionId",
    key: "transactionId",
    render: (id: string) => (
      <span style={{ fontFamily: "monospace" }}>{id}</span>
    ),
  },
  {
    title: "Type",
    dataIndex: "transactionType",
    key: "transactionType",
    render: (type: string) => (
      <Tag
        color={
          type === "Deposit"
            ? "green"
            : type === "Transfer"
            ? "gold"
            : "red"
        }
      >
        {type}
      </Tag>
    ),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (amount: number, record: any) => (
      <span>
        {record.transactionType === "Deposit" ? "+" : "-"} $
        {amount.toLocaleString()}
      </span>
    ),
  },
  {
    title: "Sender Account",
    dataIndex: "senderAccountNumber",
    key: "senderAccountNumber",
    render: (value?: string) => value || "—",
  },
  {
    title: "Receiver Account",
    dataIndex: "receiverAccountNumber",
    key: "receiverAccountNumber",
    render: (value?: string) =>
      value && value !== "-" ? value : "—",
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
    title: "Date",
    dataIndex: "completedAt",
    key: "completedAt",
    render: (date: string) => new Date(date).toLocaleString(),
  },
];


  return (
    <Layout className="min-h-screen">
      <Layout.Content  className="py-6">
        {/* Stats */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Transactions"
                value={total}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Card>
          <DataTable
            title="Transactions"
            loading={isLoading}
            dataSource={transactions}
            columns={transactionColumns}
            rowKey="id"
            pagination={{
              current: pageNumber,
              pageSize,
              total,
              showSizeChanger: true,
              onChange: (page, size) => {
                setPageNumber(page);
                setPageSize(size ?? 10);
              },
            }}
          />
        </Card>
      </Layout.Content>
    </Layout>
  );
};
