"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/common/DataTable";
import {
  Layout,
  Card,
  Statistic,
  Tag,
  Row,
  Col,
  Button,
  Typography,
} from "antd";
import { DollarOutlined, ReloadOutlined } from "@ant-design/icons";
import { useTransactions } from "@/hooks/useTransaction";
import SearchBar from "../common/SearchBar";
import type { Transaction } from "@/entities/transaction";
import type { ColumnsType } from "antd/es/table/interface";
import { useGetUserSummary } from "@/hooks/useUser";
import { useThemeStore } from "@/stores/themeStore";

const { Text } = Typography;

export const TransactionComponent = () => {
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

  const { data, isLoading } = useTransactions({
    name: undefined,
    accountNumber: debouncedSearch,
    pageNumber,
    pageSize,
  });
  const { data: userSummary } = useGetUserSummary();

  console.log("ummary", userSummary);

  const transactions = data?.items ?? [];
  const total = data?.totalCount ?? 0;
  const totalInactiveUsers = userSummary?.inactiveCustomers;
  const totalActiveUsers = userSummary?.activeCustomers;
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const transactionColumns: ColumnsType<Transaction> = [
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
      dataIndex: "completedAt",
      key: "completedAt",
      // defaultSortOrder: "descend",
      // sorter: {
      //   compare: (a: any, b: any) =>
      //     new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime(),
      //   multiple: 1,
      // },
      render: (date: string) => new Date(date).toLocaleString(),
    },
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
        <Row gutter={[16, 16]} className="mb-10">
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div className="flex gap-6">
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: isDarkMode ? "#dddbdbff" : "#141414",
                    marginBottom: 12,
                  }}
                >
                  Total Transactions
                </Text>
              </div>
              <Statistic value={total} prefix={<DollarOutlined />} />

              <Card style={{ marginTop: 16 }}>

              <Row>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Completed"
                    value={totalActiveUsers}
                    style={{ color: "#16a34a" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Pending"
                    value={totalInactiveUsers}
                    style={{ color: "#f59e0b" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Failed"
                    value={
                      transactions.filter((t) => t.status === "Failed").length
                    }
                    style={{ color: "#dc2626" }}
                  />
                </Col>
              </Row>
              </Card>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="mb-10">
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div className="flex gap-6">
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: isDarkMode ? "#dddbdbff" : "#141414",
                    marginBottom: 12,
                  }}
                >
                  This Week
                </Text>
              </div>
              <Row>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Completed"
                    value={totalInactiveUsers}
                    style={{ color: "#f59e0b" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Pending"
                    value={
                      transactions.filter((t) => t.status === "Failed").length
                    }
                    style={{ color: "#dc2626" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Failed"
                    value={
                      transactions.filter((t) => t.status === "Failed").length
                    }
                    style={{ color: "#dc2626" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <div className="flex gap-6">
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: isDarkMode ? "#dddbdbff" : "#141414",
                    marginBottom: 12,
                  }}
                >
                  This Month
                </Text>
              </div>
              <Row>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Completed"
                    value={totalInactiveUsers}
                    style={{ color: "#f59e0b" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Pending"
                    value={
                      transactions.filter((t) => t.status === "Failed").length
                    }
                    style={{ color: "#dc2626" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Failed"
                    value={
                      transactions.filter((t) => t.status === "Failed").length
                    }
                    style={{ color: "#dc2626" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <div className="flex gap-6">
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: isDarkMode ? "#dddbdbff" : "#141414",
                    marginBottom: 12,
                  }}
                >
                  This Year
                </Text>
              </div>
              <Row>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Completed"
                    value={totalInactiveUsers}
                    style={{ color: "#f59e0b" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Pending"
                    value={
                      transactions.filter((t) => t.status === "Failed").length
                    }
                    style={{ color: "#dc2626" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Failed"
                    value={
                      transactions.filter((t) => t.status === "Failed").length
                    }
                    style={{ color: "#dc2626" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
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
          dataSource={data?.items || []}
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
