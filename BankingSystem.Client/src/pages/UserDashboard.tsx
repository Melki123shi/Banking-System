import React, { useState } from "react";
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
} from "antd";
import {
  DashboardOutlined,
  CreditCardOutlined,
  SettingOutlined,
  LogoutOutlined,
  BankOutlined,
  SwapOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../stores/authStore";
import { useUserStore } from "../stores/userStore";
import { useAccountStore } from "@/stores/accountStore";
import { useTransactionStore } from "../stores/transactionStore";
import { useNavigate } from "react-router";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { users } = useUserStore();
  const { withdrawMoney, depositMoney } = useAccountStore();
  const { transactions, addTransaction, getUserTransactions } =
    useTransactionStore();
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [withdrawForm] = Form.useForm();
  const currentUser = users.find((u) => u.id === user?.id);
  const userTransactions = getUserTransactions(user?.id || "");
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleTransfer = (values: any) => {
    if (!currentUser) return;
    let account = getAccountByUserId(currentUser.id);
    if (account.balance < values.amount) {
      message.error("Insufficient funds");
      return;
    }
    // Deduct from sender
    withdrawMoney(currentUser.id, values.amount);
    addTransaction({
      userId: currentUser.id,
      type: "transfer",
      amount: values.amount,
      description: `Transfer to ${values.recipient}`,
      relatedUserId: values.recipient,
    });
    // Find recipient and deposit (mock logic since we use phone as ID sometimes)
    const recipient = users.find(
      (u) =>
        u.phone === values.recipient || u.accountNumber === values.recipient
    );
    if (recipient) {
      depositMoney(recipient.id, values.amount);
      addTransaction({
        userId: recipient.id,
        type: "deposit",
        amount: values.amount,
        description: `Transfer from ${currentUser.name}`,
        relatedUserId: currentUser.id,
      });
    }
    message.success("Transfer successful");
    setTransferModalVisible(false);
    form.resetFields();
  };
  const handleWithdraw = (values: any) => {
    if (!currentUser) return;
    if (currentUser.balance < values.amount) {
      message.error("Insufficient funds");
      return;
    }
    withdrawMoney(currentUser.id, values.amount);
    addTransaction({
      userId: currentUser.id,
      type: "withdrawal",
      amount: values.amount,
      description: "Withdrawal to bank account",
    });
    message.success("Withdrawal successful");
    setWithdrawModalVisible(false);
    withdrawForm.resetFields();
  };
  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        let color = "default";
        let icon = <SwapOutlined />;
        if (type === "deposit") {
          color = "success";
          icon = <ArrowDownOutlined />;
        }
        if (type === "withdrawal") {
          color = "error";
          icon = <ArrowUpOutlined />;
        }
        if (type === "transfer") {
          color = "processing";
          icon = <SwapOutlined />;
        }
        return (
          <Tag
            icon={icon}
            color={color}
            style={{
              textTransform: "capitalize",
            }}
          >
            {type}
          </Tag>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "right" as const,
      render: (amount: number, record: any) => (
        <Text
          type={record.type === "deposit" ? "success" : "danger"}
          code
          strong
        >
          {record.type === "deposit" ? "+" : "-"}${amount.toFixed(2)}
        </Text>
      ),
    },
  ];
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
        className="border-r border-slate-200"
      >
        <div className="p-4 flex items-center gap-2">
          <div className="h-8 w-8 bg-[#1677ff] rounded-lg flex items-center justify-center text-white">
            <BankOutlined />
          </div>
          <span className="font-bold text-lg text-[#1677ff]">FinTech</span>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "2",
              icon: <CreditCardOutlined />,
              label: "Cards",
            },
            {
              key: "3",
              icon: <SettingOutlined />,
              label: "Settings",
            },
            {
              key: "4",
              icon: <LogoutOutlined />,
              label: "Logout",
              onClick: handleLogout,
              danger: true,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
          }}
          className="flex items-center justify-between border-b border-slate-200"
        >
          <Title
            level={4}
            style={{
              margin: 0,
            }}
          >
            My Dashboard
          </Title>
          <Space>
            <div className="text-right hidden sm:block">
              <Text strong block>
                {currentUser?.name}
              </Text>
              <Text
                type="secondary"
                style={{
                  fontSize: 12,
                }}
              >
                {currentUser?.accountNumber}
              </Text>
            </div>
          </Space>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card
                title="Total Balance"
                extra={<Tag color="blue">Active</Tag>}
              >
                <Statistic
                  value={currentUser?.balance || 0}
                  precision={2}
                  prefix="$"
                  valueStyle={{
                    fontSize: 48,
                    fontWeight: "bold",
                    fontFamily: "monospace",
                  }}
                />
                <div className="mt-4 flex gap-4">
                  <Button
                    type="primary"
                    icon={<SwapOutlined />}
                    onClick={() => setTransferModalVisible(true)}
                  >
                    Transfer
                  </Button>
                  <Button
                    icon={<ArrowUpOutlined />}
                    onClick={() => setWithdrawModalVisible(true)}
                  >
                    Withdraw
                  </Button>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card
                className="bg-[#001529] text-white h-full flex flex-col justify-between"
                bordered={false}
              >
                <div className="flex justify-between items-start mb-8">
                  <BankOutlined
                    style={{
                      fontSize: 24,
                      color: "#fff",
                    }}
                  />
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "monospace",
                    }}
                  >
                    DEBIT
                  </Text>
                </div>
                <div>
                  <Text
                    style={{
                      color: "#rgba(255,255,255,0.8)",
                      fontSize: 18,
                      letterSpacing: 2,
                      fontFamily: "monospace",
                    }}
                    block
                  >
                    **** **** **** {currentUser?.accountNumber?.slice(-4)}
                  </Text>
                  <div className="flex justify-between mt-4">
                    <div>
                      <Text
                        style={{
                          color: "#rgba(255,255,255,0.5)",
                          fontSize: 10,
                        }}
                      >
                        CARD HOLDER
                      </Text>
                      <Text
                        style={{
                          color: "#fff",
                        }}
                        block
                      >
                        {currentUser?.name.toUpperCase()}
                      </Text>
                    </div>
                    <div>
                      <Text
                        style={{
                          color: "#rgba(255,255,255,0.5)",
                          fontSize: 10,
                        }}
                      >
                        EXPIRES
                      </Text>
                      <Text
                        style={{
                          color: "#fff",
                        }}
                        block
                      >
                        12/25
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            <Col span={24}>
              <Card title="Recent Transactions">
                <Table
                  columns={columns}
                  dataSource={userTransactions}
                  rowKey="id"
                  pagination={{
                    pageSize: 5,
                  }}
                />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>

      {/* Transfer Modal */}
      <Modal
        title="Transfer Money"
        open={transferModalVisible}
        onCancel={() => setTransferModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleTransfer}>
          <Form.Item
            name="recipient"
            label="Recipient (Phone or Account #)"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              prefix={<UserOutlinedIcon />}
              placeholder="Enter recipient details"
            />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              min={1}
              max={currentUser?.balance}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Send Money
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        title="Withdraw Funds"
        open={withdrawModalVisible}
        onCancel={() => setWithdrawModalVisible(false)}
        footer={null}
      >
        <Form form={withdrawForm} layout="vertical" onFinish={handleWithdraw}>
          <Form.Item
            name="amount"
            label="Amount to Withdraw"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              min={1}
              max={currentUser?.balance}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Withdraw
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}
// Helper icon component since we can't import UserOutlined directly in the render
const UserOutlinedIcon = () => (
  <span role="img" aria-label="user" className="anticon anticon-user">
    <svg
      viewBox="64 64 896 896"
      focusable="false"
      data-icon="user"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path>
    </svg>
  </span>
);
