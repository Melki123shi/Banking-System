import { useState } from "react";
import { useAccountStore } from "@/stores/accountStore";
import { useDeleteAccount, useGetAccounts } from "@/hooks/useAccount";
import { DataTable } from "@/components/common/DataTable";
import {
  Layout,
  Card,
  Statistic,
  Tag,
  Row,
  Col,
  message,
  Button,
  Form,
  Modal,
  Input,
  InputNumber,
  Select,
  Tooltip,
} from "antd";
import {
  DollarOutlined,
  CreditCardOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ConfirmationModal from "../common/ConfirmationModal";
import {
  useDepositMoney,
  useUpdateAccount,
  useWithdrawMoney,
  useTransferMoney,
} from "@/hooks/useAccount";
import { useThemeStore } from "@/stores/themeStore";

const { Option } = Select;

export const AccountComponent = () => {
  const pageNumber = 1;
  const pageSize = 10;
  const {
    data: accounts,
    isLoading,
    refetch,
  } = useGetAccounts(pageNumber, pageSize);
  const { error } = useTransferMoney();
  const setSelectedAccount = useAccountStore(
    (state) => state.setSelectedAccount
  );

  const deleteAccountMutation = useDeleteAccount();
  const updateAccountMutation = useUpdateAccount();
  const withdrawMoneyMutation = useWithdrawMoney();
  const depositMoneyMutation = useDepositMoney();
  const transferMoneyMutation = useTransferMoney();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [isUpdateAccountModalOpen, setIsUpdateAccountModalOpen] =
    useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [updateAccountForm] = Form.useForm();
  const [depositForm] = Form.useForm();
  const [withdrawForm] = Form.useForm();
  const [transferForm] = Form.useForm();
  const [pendingDeleteAccountId, setPendingDeleteAccountId] = useState<
    string | null
  >(null);

  /** ---------- Handlers ---------- **/

  const openDeleteConfirm = (accountId: string) => {
    setPendingDeleteAccountId(accountId);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteAccount = async () => {
    if (!pendingDeleteAccountId) return;
    try {
      await deleteAccountMutation.mutateAsync(pendingDeleteAccountId);
      message.success("User deleted successfully");
      refetch();
    } catch {
      message.error("Failed to delete account");
    } finally {
      setIsConfirmModalOpen(false);
      setPendingDeleteAccountId(null);
    }
  };

  const handleUpdateAccount = async (values: any) => {
    const selectedAccount = useAccountStore.getState().selectedAccount;
    if (!selectedAccount) {
      message.error("No account selected");
      return;
    }
    try {
      await updateAccountMutation.mutateAsync({
        accountId: selectedAccount.id,
        accountData: values,
      });
      message.success("Account updated successfully");
      setIsUpdateAccountModalOpen(false);
      updateAccountForm.resetFields();
    } catch {
      message.error("Failed to update account");
    }
  };

  const handleDepositMoney = async (values: any) => {
    const selectedAccount = useAccountStore.getState().selectedAccount;
    if (!selectedAccount) {
      message.error("No account selected");
      return;
    }
    try {
      await depositMoneyMutation.mutateAsync({
        accountId: selectedAccount.id,
        amount: values.amount,
      });
      message.success("Money deposited successfully");
      setIsDepositModalOpen(false);
      depositForm.resetFields();
    } catch {
      message.error("Failed to deposit money");
    }
  };

  const handleWithdrawMoney = async (values: any) => {
    const selectedAccount = useAccountStore.getState().selectedAccount;
    if (!selectedAccount) {
      message.error("No account selected");
      return;
    }
    try {
      await withdrawMoneyMutation.mutateAsync({
        accountId: selectedAccount.id,
        amount: values.amount,
        description: values.description,
      });
      message.success("Money withdrawn successfully");
      setIsWithdrawModalOpen(false);
      withdrawForm.resetFields();
    } catch {
      message.error("Failed to withdraw money");
    }
  };

  const handleTransferMoney = async (values: any) => {
    const selectedAccount = useAccountStore.getState().selectedAccount;
    if (!selectedAccount) {
      message.error("No account selected");
      return;
    }
    try {
      await transferMoneyMutation.mutateAsync({
        fromAccountId: selectedAccount.id,
        toAccountNumber: values.toAccountNumber,
        amount: values.amount,
        description: values.description,
      });
      message.success("Money transferred successfully");
      setIsTransferModalOpen(false);
      transferForm.resetFields();
    } catch {
      message.error(error?.message || "Failed to transfer money");
    }
  };

  const accountColumns = [
    {
      title: "",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <EditOutlined
            onClick={() => {
              setSelectedAccount(record);
              updateAccountForm.setFieldsValue({
                accountNumber: record.accountNumber,
                accountType: record.accountType,
                balance: record.balance,
                status: record.status,
              });
              setIsUpdateAccountModalOpen(true);
            }}
          />

          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => openDeleteConfirm(record.id)}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Account No.",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "Owner",
      dataIndex: ["userName"],
      key: "user",
      render: (userName?: string) => userName ?? "—",
    },
    {
      title: "Type",
      dataIndex: "accountType",
      key: "accountType",
      render: (type: string) => {
        const color =
          type === "Savings"
            ? "green"
            : type === "Credit"
            ? "orange"
            : type === "Checking"
            ? "blue"
            : "default";

        return <Tag color={color}>{type?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (balance: number) => <span>${balance?.toLocaleString()}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "active"
            ? "green"
            : status === "frozen"
            ? "orange"
            : status === "inactive"
            ? "red"
            : "default";

        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-3">
          <Button
            color="green"
            onClick={() => {
              if (record.status.toString().toLowerCase() !== "active") {
                return message.error("Cannot deposit to an inactive account");
              }
              setSelectedAccount(record);
              setIsDepositModalOpen(true);
            }}
          >
            Deposit
          </Button>
          <Button
            color="red"
            onClick={() => {
              if (record.status.toString().toLowerCase() !== "active") {
                return message.error("Cannot deposit to an inactive account");
              }
              setSelectedAccount(record);
              setIsWithdrawModalOpen(true);
            }}
          >
            Withdraw
          </Button>
          <Button
            color="gold"
            onClick={() => {
              if (record.status.toString().toLowerCase() !== "active") {
                return message.error("Cannot deposit to an inactive account");
              }
              setSelectedAccount(record);
              setIsTransferModalOpen(true);
            }}
          >
            Transfer
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Layout.Content>
        {/* Page Header */}
        <div className="mb-8">
          <h1
            className={`text-2xl font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Accounts Overview
          </h1>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
            Manage customer accounts and view balance summaries
          </p>
        </div>

        {/* Summary Cards */}
        <Row gutter={[16, 16]} className="mb-10">
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-sm">
              <Statistic
                title="Total Accounts"
                value={Array.isArray(accounts) ? accounts.length : 0}
                prefix={<CreditCardOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-sm">
              <Statistic
                title="Total Balance"
                value={
                  Array.isArray(accounts)
                    ? accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)
                    : 0
                }
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Row className="mb-7" gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card style={{
                      backgroundColor: isDarkMode ? "#1a3d1aff" : "#b1f4cbff",
                    }}>
              <h1 className="text-lg mb-2">Active Accounts</h1>
              <Row className="justify-between">
                <Col xl={10} sm={12} md={6}>

                    <Statistic
                      title={`Counts ${isDarkMode}`} 
                      value={
                        Array.isArray(accounts)
                          ? accounts.filter(
                              (account) => account.status === "active"
                            ).length
                          : 0
                      }
                      prefix={<CreditCardOutlined />}
                    />
                </Col>
                <Col xl={10} sm={12} md={6}>

                    <Statistic
                      title="Balance"
                      value={
                        Array.isArray(accounts)
                          ? accounts.filter(
                              (account) => account.status === "active"
                            ).length
                          : 0
                      }
                      prefix={<DollarOutlined />}
                    />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                backgroundColor: isDarkMode ? "#821111ff" :  "#fbb7b7ff",
              }}
            >
              <h1 className="text-lg mb-2">Inactive Accounts</h1>
              <Row className="justify-between">
                <Col xl={10} sm={12} md={6}>
                  <Statistic
                    title="Counts"
                    value={
                      Array.isArray(accounts)
                        ? accounts.filter(
                            (account) => account.status === "active"
                          ).length
                        : 0
                    }
                    prefix={<CreditCardOutlined />}
                  />
                </Col>
                <Col xl={10} sm={12} md={6}>
                  <Statistic
                    title="Balance"
                    value={
                      Array.isArray(accounts)
                        ? accounts.filter(
                            (account) => account.status === "active"
                          ).length
                        : 0
                    }
                    prefix={<DollarOutlined />}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        {/* Accounts Table */}
          <DataTable
          title="Accounts Table"
            loading={isLoading}
            dataSource={Array.isArray(accounts) ? accounts : []}
            columns={accountColumns}
            rowKey="id"
          />
  
        {/* Confirmation Modal */}
        <ConfirmationModal
          open={isConfirmModalOpen}
          text="Are you sure you want to delete this account?"
          onSucess={handleDeleteAccount}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      </Layout.Content>

      {/* Deposit Modal */}
      <Modal
        title="Depoit Money"
        open={isDepositModalOpen}
        onCancel={() => setIsDepositModalOpen(false)}
        onOk={() => depositForm.submit()}
      >
        <Form
          form={depositForm}
          layout="vertical"
          onFinish={(value) => {
            handleDepositMoney(value);
          }}
        >
          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              { required: true, type: "number" },
              {
                validator: (_, value) =>
                  value >= 0
                    ? Promise.resolve()
                    : Promise.reject(new Error("Balance must be ≥ 0")),
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={0} prefix="ETB" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        title="Withdraw Money"
        open={isWithdrawModalOpen}
        onCancel={() => setIsWithdrawModalOpen(false)}
        onOk={() => withdrawForm.submit()}
      >
        <Form
          form={withdrawForm}
          layout="vertical"
          onFinish={(value) => {
            handleWithdrawMoney(value);
          }}
        >
          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              { required: true, type: "number" },
              {
                validator: (_, value) =>
                  value >= 0
                    ? Promise.resolve()
                    : Promise.reject(new Error("Balance must be ≥ 0")),
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={0} prefix="ETB" />
          </Form.Item>
          <Form.Item name="description" label="Description (Optional)">
            <Input.TextArea
              name="description"
              placeholder="Description (optional)"
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Transfer Modal */}
      <Modal
        title="Transfer Money"
        open={isTransferModalOpen}
        onCancel={() => setIsTransferModalOpen(false)}
        onOk={() => withdrawForm.submit()}
      >
        <Form
          form={withdrawForm}
          layout="vertical"
          onFinish={(value) => {
            handleTransferMoney(value);
          }}
        >
          <Form.Item
            name="toAccountNumber"
            label="To Account Number"
            rules={[{ required: true, message: "Please enter account number" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              { required: true, type: "number" },
              {
                validator: (_, value) =>
                  value >= 0
                    ? Promise.resolve()
                    : Promise.reject(new Error("Balance must be ≥ 0")),
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={0} prefix="ETB" />
          </Form.Item>
          <Form.Item name="description" label="Description (Optional)">
            <Input.TextArea
              name="description"
              placeholder="Description (optional)"
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Update Account Modal */}
      <Modal
        title="Update Account"
        open={isUpdateAccountModalOpen}
        onCancel={() => setIsUpdateAccountModalOpen(false)}
        onOk={() => updateAccountForm.submit()}
      >
        <Form
          form={updateAccountForm}
          layout="vertical"
          onFinish={handleUpdateAccount}
        >
          <Form.Item
            name="accountNumber"
            label="Account Number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="accountType"
            label="Account Type"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select type">
              <Option value="Checking">Checking</Option>
              <Option value="Savings">Savings</Option>
              <Option value="Credit">Credit</Option>
              <Option value="Business">Business</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="balance"
            label="Initial Balance"
            rules={[
              { required: true, type: "number" },
              {
                validator: (_, value) =>
                  value >= 0
                    ? Promise.resolve()
                    : Promise.reject(new Error("Balance must be ≥ 0")),
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={0} prefix="ETB" />
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="Active">
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
              <Option value="Frozen">Frozen</Option>
              <Option value="Closed">Closed</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AccountComponent;
