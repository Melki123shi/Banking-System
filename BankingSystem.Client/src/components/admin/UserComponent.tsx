import  { useState } from "react";
import type { ColumnsType } from "antd/es/table";
import type { User } from "@/entities/user";
import UserDetailModal from "./UserDetailModal";
import {
  useGetUsers,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useGetUserSummary,
} from "@/hooks/useUser";
import { useUserStore } from "@/stores/userStore";
import { useCreateAccount } from "@/hooks/useAccount";
import { DataTable } from "@/components/common/DataTable";
import {
  Layout,
  Card,
  Statistic,
  Button,
  Tag,
  Row,
  Col,
  Modal,
  Select,
  InputNumber,
  Form,
  Input,
  message,
  Space,
  Tooltip,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  TeamOutlined,
  PhoneOutlined,
  UserOutlined,
  LockOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import UserAccounts from "./UserAccounts";
import ConfirmationModal from "../common/ConfirmationModal";
import { validateEthioPhone } from "@/lib/validation";
import { useThemeStore } from "@/stores/themeStore";

const { Option } = Select;
const { Title, Text } = Typography;

export const UserComponent = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(2);

  const setSelectedUser = useUserStore((s) => s.setSelectedUser);
  const selectedUser = useUserStore((state) => state.selectedUser);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

;

  // User list
  const { data, isLoading, refetch } = useGetUsers(pageNumber, pageSize);

  // Mutations
  const createUserMutation = useCreateUser();
  const createAccountMutation = useCreateAccount();
  const deleteUserMutation = useDeleteUser();
  const updateUserMutation = useUpdateUser();
  const { data: userSummary } = useGetUserSummary();

  // Forms & modal states
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] =
    useState(false);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false);

  const [createUserForm] = Form.useForm();
  const [updateUserForm] = Form.useForm();
  const [createAccountForm] = Form.useForm();
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState<string | null>(
    null
  );

  /** ---------- Handlers ---------- **/

  const openDeleteConfirm = (userId: string) => {
    setPendingDeleteUserId(userId);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!pendingDeleteUserId) return;
    try {
      await deleteUserMutation.mutateAsync(pendingDeleteUserId);
      message.success("User deleted successfully");
      refetch();
    } catch {
      message.error("Failed to delete user");
    } finally {
      setIsConfirmModalOpen(false);
      setPendingDeleteUserId(null);
    }
  };

  const handleCreateUser = async (values: any) => {
    try {
      await createUserMutation.mutateAsync(values);
      message.success("User created successfully");
      setIsCreateUserModalOpen(false);
      createUserForm.resetFields();
      refetch();
    } catch {
      message.error("Failed to create user");
    }
  };

  const handleUpdateUser = async (values: any) => {
    const selectedUser = useUserStore.getState().selectedUser;
    if (!selectedUser) return;

    values.isActive = values.status === "Active" ? true : false;
    delete values.status;

    try {
      await updateUserMutation.mutateAsync({
        id: selectedUser.id,
        data: values,
      });
      message.success("User updated successfully");
      setIsUpdateUserModalOpen(false);
      updateUserForm.resetFields();
      refetch();
    } catch {
      message.error("Failed to update user");
    }
  };

  const handleCreateAccount = async (values: any) => {
    const selectedUser = useUserStore.getState().selectedUser;
    if (!selectedUser) return;
    values.userId = selectedUser.id;

    try {
      await createAccountMutation.mutateAsync(values);
      message.success("Account created successfully");
      setIsCreateAccountModalOpen(false);
      createAccountForm.resetFields();
    } catch {
      message.error("Failed to create account");
    }
  };

  /** ---------- Table columns ---------- **/
  const userColumns: ColumnsType<User> = [
    {
      width: 1,
      title: "",
      key: "actions",
      render: (_: any, record: any) => {
        return (
          <div className="flex">
            <Tooltip title="View Details">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => {
                  setSelectedUser(record);
                  setIsUserDetailModalOpen(true);
                }}
              />
            </Tooltip>

            <Tooltip title="Edit">
              <Button
                type="text"
                icon={<EditOutlined className="text-blue-500" />}
                onClick={() => {
                  setSelectedUser(record);
                  updateUserForm.setFieldsValue({
                    name: record.name,
                    phoneNumber: record.phoneNumber,
                    status: record.isActive ? "Active" : "Inactive",
                  });
                  setIsUpdateUserModalOpen(true);
                }}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => openDeleteConfirm(record.id)}
              />
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <Space>
          <UserOutlined className="text-slate-400" />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Accounts",
      key: "accounts",
      render: (_: any, record: any) => <UserAccounts userId={record.id} />,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (active: boolean) => (
        <Tag color={active ? "success" : "error"} className="rounded-full px-3">
          {active ? "Active" : "Inactive"}
        </Tag>
      ),
      filters: [
        {
          text: "Active",
          value: "Active",
        },
        {
          text: "Inactive",
          value: "Inactive",
        },
      ],
      filterMode: "menu",
      onFilter: (value, record) => {
        if (value === "Active") return record.isActive === true;
        if (value === "Inactive") return record.isActive === false;
        return false;
      },
    },
    {
      title: "Add Account",
      key: "addAccount",
      render: (_: any, record: any) => (
        <Button
          className="p-4"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedUser(record);
            setIsCreateAccountModalOpen(true);
          }}
        >
          Account
        </Button>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Layout.Content>
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <Title level={2} style={{ margin: 0 }}>
              Customer Directory
            </Title>
            <Text type="secondary">
              Monitor user status and manage linked financial accounts
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateUserModalOpen(true)}
            className="shadow-md"
          >
            Add New Customer
          </Button>
        </div>

        {/* Stats Section */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-sm border-none">
              <Statistic
                title="Total Users"
                value={data?.totalCount ?? 0}
                prefix={<TeamOutlined className="mr-2 text-blue-500" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-sm border-none"style={
              {
                backgroundColor:  isDarkMode ? "#1a3d1aff" : "#b1f4cbff"
              }}>
              <Statistic
                title="Active Users"
                value={userSummary?.activeCustomers ?? 0}
                prefix={<TeamOutlined className="mr-2 text-blue-500" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-sm border-none" style={
              {
                backgroundColor: isDarkMode ? "#821111ff" : "#fbb7b7ff",
              }}>
              <Statistic
                title="Inactive Users"
                value={userSummary?.inactiveCustomers ?? 0}
                prefix={<TeamOutlined className="mr-2 text-blue-500" />}
              />
            </Card>
          </Col>
        </Row>
        <Col xs={24} sm={12} md={6}>
           <Card className="shadow-sm border-none" style={
              {
                backgroundColor: isDarkMode ? "#16477bff" : "#a3d7fcff",
              }}>
              <Statistic
                title="New Users This Month"
                value={userSummary?.newUsersThisMonth ?? 0}
                prefix={<TeamOutlined className="mr-2 text-blue-500" />}
              />
            </Card>
          </Col>


            
        {/* User Table Card */}
        <Title level={4} className="mb-4 my-6">Customers Table</Title>
        <DataTable
          loading={isLoading}
          dataSource={data?.items ?? []}
          columns={userColumns}
          rowKey="id"
          pagination={{
            current: pageNumber,
            pageSize,
            total: data?.totalCount,
            showSizeChanger: true,
            onChange: (page, size) => {
              setPageNumber(page);
              setPageSize(size);
            },
          }}
        />

        {/* user detail modal */}
        {selectedUser && (
        <UserDetailModal
          open={isUserDetailModalOpen}
          onClose={() => setIsUserDetailModalOpen(false)}
          selectedUser={selectedUser}
        />
      )}
        {/* Create User Modal */}
        <Modal
          title="Register New Customer"
          open={isCreateUserModalOpen}
          onCancel={() => setIsCreateUserModalOpen(false)}
          onOk={() => createUserForm.submit()}
          okText="Create User"
          confirmLoading={createUserMutation.isPending}
        >
          <Form
            form={createUserForm}
            layout="vertical"
            onFinish={handleCreateUser}
            className="mt-4"
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: "Please enter full name" }]}
            >
              <Input
                prefix={<UserOutlined className="text-slate-400" />}
                placeholder="John Doe"
              />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true, validator: validateEthioPhone }]}
            >
              <Input
                prefix={<PhoneOutlined className="text-slate-400" />}
                placeholder="09 / 07..."
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Secure Password"
              rules={[{ required: true, min: 6 }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-slate-400" />}
                placeholder="Minimum 6 characters"
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* Update User Modal */}
        <Modal
          title="Edit Customer Details"
          open={isUpdateUserModalOpen}
          onCancel={() => setIsUpdateUserModalOpen(false)}
          onOk={() => updateUserForm.submit()}
          okText="Update Details"
          confirmLoading={updateUserMutation.isPending}
        >
          <Form
            form={updateUserForm}
            layout="vertical"
            onFinish={handleUpdateUser}
            className="mt-4"
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone"
              rules={[{ required: true, validator: validateEthioPhone }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="New Password"
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="status"
              label="Account Status"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* Create Account Modal */}
        <Modal
          title="Open New Account"
          open={isCreateAccountModalOpen}
          onCancel={() => setIsCreateAccountModalOpen(false)}
          onOk={() => createAccountForm.submit()}
          confirmLoading={createAccountMutation.isPending}
        >
          <Form
            form={createAccountForm}
            layout="vertical"
            onFinish={handleCreateAccount}
            className="mt-4"
          >
            <Form.Item
              name="accountNumber"
              label="Account Number"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter unique account number" />
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
              label="Initial Deposit"
              rules={[{ required: true, type: "number", min: 0 }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                prefix="ETB"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
              />
            </Form.Item>
            <Form.Item
              name="status"
              label="Initial Status"
              initialValue="Active"
            >
              <Select>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
                <Option value="Frozen">Frozen</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <ConfirmationModal
          open={isConfirmModalOpen}
          text="This action cannot be undone. Are you sure you want to delete this user?"
          onSucess={handleDeleteUser}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      </Layout.Content>
    </Layout>
  );
};

export default UserComponent;
