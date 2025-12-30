import { useState } from "react";
import { useGetUserTransactions } from "@/hooks/useTransaction";
import { useAuthStore } from "@/stores/authStore";
import { DataTable } from "@/components/common/DataTable";
import { Avatar, Space } from "antd";
import { Layout, Card, Tag } from "antd";
import type { ColumnType } from "antd/es/table/interface";
import type { UserTransactionDetail } from "@/lib/types";
import { useUserAccounts } from "@/hooks/useAccount";

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

  const accounts = useUserAccounts(user.id);

  const transactionColumns: ColumnType<UserTransactionDetail>[] = [
    {
      title: "Name",
      dataIndex: "counterpartyName",
      key: "counterpartyName",
      sorter: {
        compare: (a: any, b: any) =>
          (a.counterpartyName ?? "").localeCompare(b.counterpartyName ?? ""),
        multiple: 3,
      },
      render: (_: any, record: any) => {
        const name = record.counterpartyName ?? "Unknown";
        return (
          <Space>
            <Avatar
              size="large"
              style={{ backgroundColor: "#6581e6ff", verticalAlign: "middle" }}
            >
              {name[0].toUpperCase()}
            </Avatar>
            <span>{name}</span>
          </Space>
        );
      },
    },
    {
      title: "To Account",
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
      filters: [
        {
          text: "Deposit",
          value: "Deposit",
        },
        {
          text: "Transfer",
          value: "Transfer",
        },
        {
          text: "Withdrawal",
          value: "Withdrawal",
        },
      ],
      filterMode: "menu",
      onFilter: (value: any, record: any) => record.transactionType === value,
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
      title: "From Account",
      dataIndex: "customerAccountNumber",
      key: "customerAccountNumber",
      render: (v?: string) => v ?? "—",
      filters: (accounts?.data ?? []).map((account) => ({
        text:account.accountNumber,
        value:account.accountNumber,
      })) ,
      filterMode: "menu",
      onFilter: (value: any, record: any) => record.customerAccountNumber === value,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleString(),
      defaultSortOrder: "descend",
      sorter: {
        compare: (a: any, b: any) =>
          new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime(),
        multiple: 3,
      },
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
