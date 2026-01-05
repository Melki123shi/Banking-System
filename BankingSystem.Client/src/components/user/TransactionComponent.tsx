"use client";

import { useState, useEffect } from "react";
import { useUserTransactions } from "@/hooks/useTransaction";
import { useAuthStore } from "@/stores/authStore";
import { DataTable } from "@/components/common/DataTable";
import { Layout, Card, Tag, Typography, Avatar, Space, Button } from "antd";
import type { ColumnType } from "antd/es/table/interface";
import SearchBar from "../common/SearchBar";
import type { UserTransactionDetail } from "@/lib/types";
import { ReloadOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const TransactionComponent = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const user = useAuthStore((state: any) => state.user);
  if (!user) {
    return <div>Please log in to view your transactions.</div>;
  }
  // Debounce logic: update 'debouncedSearch' 500ms after user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPageNumber(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading } = useUserTransactions(user.id,{
    name: debouncedSearch,
    accountNumber: undefined,
    pageNumber,
    pageSize,
  });

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
      render: (_: any, record: UserTransactionDetail) => {
        const name = record.counterpartyName !== "" ? record.counterpartyName : "System";
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
      // filters: (accounts?.data ?? []).map((account) => ({
      //   text: account.accountNumber,
      //   value: account.accountNumber,
      // })),
      // filterMode: "menu",
      // onFilter: (value: any, record: any) =>
      //   record.customerAccountNumber === value,
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
        <Title level={4} style={{
          marginBottom: "33px"
        }}> Transactions </Title>
        <div className="flex justify-between">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <Button onClick={() => setPageNumber(1)}>
            <ReloadOutlined />
            Refresh
          </Button>
        </div>
        {/* Table */}
        <Card>
          <DataTable<UserTransactionDetail>
            title="Recent Transactions"
            loading={isLoading}
            dataSource={data?.items}
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
