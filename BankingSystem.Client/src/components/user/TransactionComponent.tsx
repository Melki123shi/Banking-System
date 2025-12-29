import { useState } from "react";
import { useGetUserTransactions } from "@/hooks/useTransaction";
import { useAuthStore } from "@/stores/authStore";
import { DataTable } from "@/components/common/DataTable";
import { Layout, Card, Tag} from "antd";

export const TransactionComponent = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const user = useAuthStore((state: any) => state.user);
  if (!user) {
    return <div>Please log in to view your transactions.</div>;
  }
  const { data, isLoading } = useGetUserTransactions(
    user.id,
    pageNumber,
    pageSize
  );
  
  const transactionColumns = [
    {
      title: "Name",
      dataIndex: "counterpartyName",
      key: "counterpartyName",
    },
    {
      title: "Account",
      dataIndex: "counterpartyAccountNumber",
      key: "counterpartyAccountNumber",
      render: (v?: string) => v ?? "—",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (v?: string) => v ?? "—",
    },
    {
      title: "Type",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (type: string) => (
        <Tag
          color={
            type === "Deposit" ? "green" : type === "Transfer" ? "gold" : "red"
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
        <span
          className={
            record.direction === "IN" ? "text-green-600" : "text-red-600"
          }
        >
          {record.direction === "IN" ? "+" : "-"} ${amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Direction",
      dataIndex: "direction",
      key: "direction",
      render: (d: string) => (
        <Tag color={d === "IN" ? "green" : "red"}>{d}</Tag>
      ),
    },
    {
      title: "Your Account",
      dataIndex: "customerAccountNumber",
      key: "customerAccountNumber",
      render: (v?: string) => v ?? "—",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleString(),
    },

  ];

  return (
    <Layout className="min-h-screen">
      <Layout.Content>
        {/* Table */}
        <Card>
          <DataTable
            title="Recent Transactions"
            loading={isLoading}
            dataSource={data?.items || []}
            columns={transactionColumns}
            rowKey="transactionId"
            pagination={{
              current: pageNumber,
              pageSize,
              total: data?.totalCount || 0,
              onChange: (page, size) => {
                setPageNumber(page);
                setPageSize(size ?? pageSize);
              },
            }}
          />
        </Card>
      </Layout.Content>
    </Layout>
  );
};

export default TransactionComponent;
