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
      <Layout.Content  className="">
        <div className="mb-8">
      <h1 className="text-2xl font-semibold text-gray-800">
        Transactions Overview
      </h1>
      <p className="text-gray-500">
        Review and monitor all financial transactions in the system
      </p>
    </div>

         <Row gutter={[16, 16]} className="mb-10">
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Total Transactions"
            value={total}
            prefix={<DollarOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Completed"
            value={transactions.filter(t => t.status === "Completed").length}
            valueStyle={{ color: "#16a34a" }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Pending"
            value={transactions.filter(t => t.status === "Pending").length}
            valueStyle={{ color: "#f59e0b" }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Failed"
            value={transactions.filter(t => t.status === "Failed").length}
            valueStyle={{ color: "#dc2626" }}
          />
        </Card>
      </Col>
    </Row>

        {/* Table */}
         <Card
      title="Transaction Records"
      className="shadow-sm"
      bodyStyle={{ padding: 0 }}
    >
      <DataTable
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
        {/* Stats */}
      </Layout.Content>
    </Layout>
  );
};
