"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/common/DataTable";
import { Layout, Tag, Row, Col, Button, Dropdown, type MenuProps } from "antd";
import {
  DollarOutlined,
  MoneyCollectOutlined,
  ReloadOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { useTransactions, useTransactionSummary } from "@/hooks/useTransaction";
import { PeriodSummaryCard } from "./PeriodSummaryCard";
import SearchBar from "@/components/common/SearchBar";
import type { Transaction } from "@/entities/transaction";
import type { ColumnsType } from "antd/es/table/interface";
import { useThemeStore } from "@/stores/themeStore";
import type { TransactionType } from "@/lib/types";

export const TransactionComponent: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPageNumber(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);
  const [selectedTransactionType, setSelectedTransactionType] =
    useState<TransactionType>("All");

  const { data, isLoading } = useTransactions({
    name: undefined,
    accountNumber: debouncedSearch,
    pageNumber,
    pageSize,
  });

  const transactions = data?.items ?? [];
  const total = data?.totalCount ?? 0;
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const transactionColumns: ColumnsType<Transaction> = [
    {
      title: "Transaction ID",
      minWidth: 200,
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
            type === "Deposit" ? "green" : type === "Transfer" ? "gold" : "red"
          }
        >
          {type}
        </Tag>
      ),
        filterMode: "menu",
      filters: [
        { text: "Deposit", value: "Deposit" },
        { text: "Withdrawal", value: "Withdrawal" },
        { text: "Transfer", value: "Transfer" },
      ],
      onFilter: (value, record) =>{ 
        console.log(value, "<----- values", "types ---> ",record.transactionType?.toString(), "return value ----> ",record.transactionType === value);
        console.log("record --------->",record)
        return record.transactionType === value
      },  
    },
    {
      title: "Amount",
      minWidth: 100,
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
      minWidth: 200,
      dataIndex: "senderAccountNumber",
      key: "senderAccountNumber",
      render: (value?: string) => value || "—",
    },
    {
      title: "Receiver Account",
      minWidth: 200,
      dataIndex: "receiverAccountNumber",
      key: "receiverAccountNumber",
      render: (value?: string) => (value && value !== "-" ? value : "—"),
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
      minWidth: 180,
      dataIndex: "completedAt",
      key: "completedAt",
      defaultSortOrder: "descend",
      sorter: {
        compare: (a: any, b: any) =>
          new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime(),
        multiple: 1,
      },
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  const summaryParams =
    selectedTransactionType === "All"
      ? {}
      : { types: [selectedTransactionType] as readonly TransactionType[] };

  const summaries = {
    ThisWeek: useTransactionSummary({
      transactionParams: { period: "ThisWeek", ...summaryParams },
    }).data,
    ThisMonth: useTransactionSummary({
      transactionParams: { period: "ThisMonth", ...summaryParams },
    }).data,
    ThisYear: useTransactionSummary({
      transactionParams: { period: "ThisYear", ...summaryParams },
    }).data,
  };

  const transactionTypes: MenuProps["items"] = [
    { key: "All", label: "All Transactions", icon: <MoneyCollectOutlined /> },
    { key: "Deposit", label: "Deposit", icon: <DollarOutlined /> },
    { key: "Withdrawal", label: "Withdrawal", icon: <DollarOutlined /> },
    { key: "Transfer", label: "Transfer", icon: <TransactionOutlined /> },
  ];
  return (
    <Layout className="min-h-screen">
      <Layout.Content className="">
        <div className="mb-8">
          <h1
            className={`text-2xl font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Transactions Overview
          </h1>
          <p className={` ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Review and monitor all financial transactions in the system
          </p>
        </div>

        {/* Stats */}

        <Dropdown
          getPopupContainer={() => document.body}
          menu={{
            items: transactionTypes,
            onClick: (e) =>
              setSelectedTransactionType(e.key as TransactionType),
          }}
        >
          <Button className="mb-6">{selectedTransactionType}</Button>
        </Dropdown>

          <Row gutter={[12, 12]} className="mb-24">
            <PeriodSummaryCard
              title={`${selectedTransactionType} Transactions Summary`}
              summary={
                useTransactionSummary({
                  transactionParams: { period: "All", ...summaryParams },
                }).data
              }
              selectedType={selectedTransactionType}
            />
          </Row>
        <Row gutter={[16, 16]} className="mb-12">
          {Object.entries(summaries).map(([key, summary]) => (
            <Col key={key} xs={24} sm={12} lg={6}>
              <PeriodSummaryCard
                title={key.replace(/([A-Z])/g, " $1")}
                summary={summary}
                selectedType={selectedTransactionType}
              />
            </Col>
          ))}
        </Row>

        {/* Table */}
        <div className="flex justify-between">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />{" "}
          <Button
            onClick={() => {
              setPageNumber(1);
            }}
          >
            Reload
            <ReloadOutlined />
          </Button>
        </div>
        <DataTable
          title="Transactions Table"
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
        {/* Stats */}
      </Layout.Content>
    </Layout>
  );
};
