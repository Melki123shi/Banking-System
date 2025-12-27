import { useEffect, useState } from "react";
import { useGetPaginatedTransactions } from "@/hooks/useTransaction";
import { DataTable } from "@/components/DataTable";
import { Layout, Card, Statistic, Tag, Row, Col, message } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
} from "@ant-design/icons";

export const TransactionComponent = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const {data: transactions, isLoading, refetch} = useGetPaginatedTransactions(pageNumber, pageSize);

  const transactionColumns = [
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
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
      title: "Sender Account",
      dataIndex: "senderAccountId",
      key: "senderAccountId",
      render: (id?: string) => id ?? "—",
    },
    {
      title: "Receiver Account",
      dataIndex: "receiverAccountId",
      key: "receiverAccountId",
      render: (id?: string) => id ?? "—",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  // const totalCredits = transactions
  //   ?.filter((t) => t.type === "Withdrawal")
  //   .reduce((sum, t) => sum + t.amount, 0);

  // const totalDebits = transactions
  //   ?.filter((t) => t.type === "Deposit")
  //   .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Layout className="min-h-screen">
      <Layout.Content className="p-8">
        {/* Stats */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Transactions"
                value={transactions?.length || 0}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
          {/* <Col span={8}>
            <Card>
              <Statistic
                title="Total Credits"
                value={totalCredits || 0}
                prefix={<ArrowDownOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Debits"
                value={totalDebits || 0}
                prefix={<ArrowUpOutlined />}
              />
            </Card>
          </Col> */}
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
