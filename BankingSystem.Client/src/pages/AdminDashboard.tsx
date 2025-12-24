import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { useAccountStore } from "@/stores/accountStore";

import type { User } from "@/entities/user";
import type { Transaction } from "@/entities/transaction";

import {
  Layout,
  Menu,
  Card,
  Statistic,
  Table,
  Button,
  Tag,
  Row,
  Col,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Typography,
  Space,
  Select,
} from "antd";

import {
  DashboardOutlined,
  UserOutlined,
  TransactionOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  PlusOutlined,
  DollarOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export function AdminDashboard() {
  const navigate = useNavigate();

  /* =======================
     Stores
  ======================== */
  const logout = useAuthStore((s) => s.logout);

  const { users, createUser, updateUserStatus } = useUserStore();

  const { depositMoney } = useAccountStore();

  const { transactions, addTransaction } = useTransactionStore();

  /* =======================
     Local State
  ======================== */
  const [createUserModalVisible, setCreateUserModalVisible] = useState(false);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [createForm] = Form.useForm();
  const [depositForm] = Form.useForm();

  /* =======================
     Derived Data
  ======================== */
  const allTransactions = useMemo(() => transactions, [transactions]);

  const totalVolume = useMemo(
    () => allTransactions.reduce((acc, t) => acc + t.amount, 0),
    [allTransactions]
  );

  /* =======================
     Handlers
  ======================== */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCreateUser = (values: {
    name: string;
    phone: string;
    password: string;
  }) => {
    createUser({
      name: values.name,
      phoneNumber: values.phone,
      isActive: true,
      password: values.password,
    });

    message.success("User created successfully");
    createForm.resetFields();
    setCreateUserModalVisible(false);
  };

  const handleDeposit = (values: { amount: number }) => {
    if (!selectedUserId) return;

    depositMoney(selectedUserId, values.amount);

    addTransaction({
      senderAccountId: "ADMIN",
      receiverAccountId: selectedUserId,
      amount: values.amount,
      type: "DEPOSIT",
      status: "COMPLETED",
      description: "Admin Deposit",
      createdAt: new Date(),
    });

    message.success("Deposit successful");
    depositForm.resetFields();
    setDepositModalVisible(false);
    setSelectedUserId(null);
  };

  /* =======================
     Table Columns
  ======================== */
  const userColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "success" : "error"}>
          {isActive ? "ACTIVE" : "SUSPENDED"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: User) => (
        <Space>
          <Button
            size="small"
            icon={<DollarOutlined />}
            onClick={() => {
              setSelectedUserId(record.id || null);
              setDepositModalVisible(true);
            }}
          >
            Deposit
          </Button>

          <Select
            size="small"
            value={record.isActive ? "active" : "suspended"}
            style={{ width: 120 }}
            onChange={(value) =>
              updateUserStatus(record.id || "", value === "active")
            }
          >
            <Option value="active">Active</Option>
            <Option value="suspended">Suspended</Option>
          </Select>
        </Space>
      ),
    },
  ];

  const transactionColumns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: Transaction["type"]) => (
        <Tag color={type === "DEPOSIT" ? "success" : "processing"}>{type}</Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => <Text code>${amount.toFixed(2)}</Text>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: Date) => new Date(date).toLocaleString(),
    },
  ];

  /* =======================
     Render
  ======================== */
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark" breakpoint="lg" collapsedWidth="0">
        <div className="p-4 flex items-center gap-2">
          <SafetyCertificateOutlined
            style={{ fontSize: 24, color: "#52c41a" }}
          />
          <span className="font-bold text-lg text-white">Admin Panel</span>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            { key: "1", icon: <DashboardOutlined />, label: "Overview" },
            { key: "2", icon: <UserOutlined />, label: "Users" },
            { key: "3", icon: <TransactionOutlined />, label: "Transactions" },
            {
              key: "4",
              icon: <LogoutOutlined />,
              label: "Logout",
              danger: true,
              onClick: handleLogout,
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header className="flex items-center justify-between border-b bg-white px-6">
          <Title level={4} style={{ margin: 0 }}>
            System Overview
          </Title>
          <Tag color="success">System Operational</Tag>
        </Header>

        <Content className="m-6 p-6 bg-white">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={users.length}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card>
                <Statistic
                  title="Total Volume"
                  value={totalVolume}
                  precision={2}
                  prefix="$"
                />
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card>
                <Statistic
                  title="Transactions"
                  value={allTransactions.length}
                  prefix={<TransactionOutlined />}
                />
              </Card>
            </Col>

            <Col span={24}>
              <Card
                title="User Management"
                extra={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setCreateUserModalVisible(true)}
                  >
                    Add User
                  </Button>
                }
              >
                <Table
                  columns={userColumns}
                  dataSource={users}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
              </Card>
            </Col>

            <Col span={24}>
              <Card title="Recent Transactions">
                <Table
                  columns={transactionColumns}
                  dataSource={allTransactions}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>

      {/* Create User Modal */}
      <Modal
        title="Create New User"
        open={createUserModalVisible}
        footer={null}
        onCancel={() => setCreateUserModalVisible(false)}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreateUser}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Create User
          </Button>
        </Form>
      </Modal>

      {/* Deposit Modal */}
      <Modal
        title="Deposit Funds"
        open={depositModalVisible}
        footer={null}
        onCancel={() => setDepositModalVisible(false)}
      >
        <Form form={depositForm} layout="vertical" onFinish={handleDeposit}>
          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Confirm Deposit
          </Button>
        </Form>
      </Modal>
    </Layout>
  );
}
