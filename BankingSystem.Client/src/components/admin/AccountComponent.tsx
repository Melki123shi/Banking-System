import { useEffect, useState } from "react";
import { useAccountStore } from "@/stores/accountStore";
import { useDeleteAccount, useGetAccounts } from "@/hooks/useAccount";
import { DataTable } from "@/components/DataTable";
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
} from "antd";
import {
  DollarOutlined,
  CreditCardOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ConfirmationModal from "../ConfirmationModal";

const AccountComponent = () => {
  const pageNumber = 1;
  const pageSize = 10;
  const { data: accounts,  isLoading, refetch } = useGetAccounts(pageNumber, pageSize);
  const setSelectedAccount = useAccountStore((state) => state.setSelectedAccount);

  const deleteUserMutation = useDeleteAccount();

  const [isUpdateAccountModalOpen, setIsUpdateAccountModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [updateAccountForm] = Form.useForm();
  const [pendingDeleteAccountId, setPendingDeleteAccountId] = useState<string | null>(
    null
  );

  /** ---------- Handlers ---------- **/

  const openDeleteConfirm = (accountId: string) => {
    setPendingDeleteAccountId(accountId);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteAccount = async () => {
    if (!pendingDeleteAccountId) return;
    try {
      await deleteUserMutation.mutateAsync(pendingDeleteAccountId);
      message.success("User deleted successfully");
      refetch();
    } catch {
      message.error("Failed to delete account");
    } finally {
      setIsConfirmModalOpen(false);
      setPendingDeleteAccountId(null);
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
              // console.log("clicked")
              updateAccountForm.setFieldsValue({
                accountNumber: record.accountNumber,
                userName: record.userName,
                accountType: record.accountType,
                balance: record.balance,
                status: record.status,
              });
              setIsUpdateAccountModalOpen(true);
            }}
          />

          <DeleteOutlined onClick={() => openDeleteConfirm(record.id)} />
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
      render: (type: string) => <Tag color="blue">{type?.toUpperCase()}</Tag>,
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
          status === "Active"
            ? "green"
            : status === "Frozen"
            ? "orange"
            : status === "Closed"
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
  ];

  return (
    <Layout className="min-h-screen">
      <Layout.Content className="p-8">
        {/* Stats */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Accounts"
                value={Array.isArray(accounts) ? accounts.length : 0}
                prefix={<CreditCardOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
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

        {/* Table */}
        <Card>
          <DataTable
            title="Accounts"
            loading={isLoading}
            dataSource={Array.isArray(accounts) ? accounts : []}
            columns={accountColumns}
            rowKey="id"
          />
        </Card>

        {/* Confirmation Modal */}
        <ConfirmationModal
          open={isConfirmModalOpen}
          text="Are you sure you want to delete this user?"
          onSucess={handleDeleteAccount}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      </Layout.Content>
    </Layout>
  );
};

export default AccountComponent;
