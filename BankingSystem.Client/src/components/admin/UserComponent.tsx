import { useState } from "react";
import {
  useGetUsers,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
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
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import UserAccounts from "./UserAccounts";
import ConfirmationModal from "../common/ConfirmationModal";

const { Option } = Select;

export const UserComponent = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const setSelectedUser = useUserStore((s) => s.setSelectedUser);

  // User list
  const { data, isLoading, refetch } = useGetUsers(pageNumber, pageSize);

  // Mutations
  const createUserMutation = useCreateUser();
  const createAccountMutation = useCreateAccount();
  const deleteUserMutation = useDeleteUser();
  const updateUserMutation = useUpdateUser();

  // Forms & modal states
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] =
    useState(false);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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
  const userColumns = [
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <EditOutlined
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

          <DeleteOutlined onClick={() => openDeleteConfirm(record.id)} />
        </div>
      ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Accounts",
      key: "accounts",
      render: (_: any, record: any) => <UserAccounts userId={record.id} />,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "ACTIVE" : "INACTIVE"}
        </Tag>
      ),
    },
    {
      title: "",
      dataIndex: "AddAccount",
      key: "AddAccount",
      render: (_: any, record: any) => (
        <Button
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedUser(record);
            setIsCreateAccountModalOpen(true);
          }}
        >
          Add Account
        </Button>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen bg-transparent">
      <Layout.Content className="p-8">
        {/* Stats */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Users"
                value={data?.totalCount ?? 0}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* User Table */}
        <Card>
          <DataTable
            title="Customers"
            loading={isLoading}
            dataSource={data?.items ?? []}
            columns={userColumns}
            rowKey="id"
            pagination={{
              current: pageNumber,
              pageSize,
              total: data?.totalCount,
              onChange: (page, size) => {
                setPageNumber(page);
                setPageSize(size);
              },
            }}
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsCreateUserModalOpen(true)}
              >
                Add User
              </Button>
            }
          />
        </Card>

        {/* Create User Modal */}
        <Modal
          title="Add Customer"
          open={isCreateUserModalOpen}
          onCancel={() => setIsCreateUserModalOpen(false)}
          onOk={() => createUserForm.submit()}
        >
          <Form
            form={createUserForm}
            layout="vertical"
            onFinish={handleCreateUser}
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
          </Form>
        </Modal>

        {/* Update User Modal */}
        <Modal
          title="Update Customer"
          open={isUpdateUserModalOpen}
          onCancel={() => setIsUpdateUserModalOpen(false)}
          onOk={() => updateUserForm.submit()}
        >
          <Form
            form={updateUserForm}
            layout="vertical"
            onFinish={handleUpdateUser}
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
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
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
          title="Create Account"
          open={isCreateAccountModalOpen}
          onCancel={() => setIsCreateAccountModalOpen(false)}
          onOk={() => createAccountForm.submit()}
        >
          <Form
            form={createAccountForm}
            layout="vertical"
            onFinish={handleCreateAccount}
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
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
              />
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

        {/* Confirmation Modal */}
        <ConfirmationModal
          open={isConfirmModalOpen}
          text="Are you sure you want to delete this user?"
          onSucess={handleDeleteUser}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      </Layout.Content>
    </Layout>
  );
};

export default UserComponent;
