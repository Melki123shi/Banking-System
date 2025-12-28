// components/AccountInfoCard.tsx
import {
  Card,
  Button,
  Space,
  Typography,
  Tag,
  message,
  Form,
  Modal,
  Input,
  InputNumber,
} from "antd";
import { MinusOutlined, SwapOutlined, CopyOutlined } from "@ant-design/icons";
import type { Account } from "@/entities/account";
import { useAccountStore } from "@/stores/accountStore";
import { useWithdrawMoney } from "@/hooks/useAccount";
import { useTransferMoney } from "@/hooks/useAccount";

import { useState } from "react";
import type { AxiosError } from "axios";

const { Title, Text } = Typography;

interface Props {
  account: Account;
}

export const AccountInfoCard = ({ account }: Props) => {
  const withdrawMoneyMutation = useWithdrawMoney();
  const transferMoneyMutation = useTransferMoney();

  const [withdrawForm] = Form.useForm();
  const [transferForm] = Form.useForm();

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const setSelectedAccount = useAccountStore(
    (state) => state.setSelectedAccount
  );

  const handleWithdrawMoney = async (values: any) => {
    if (!account) {
      message.error("No account selected");
      return;
    }
    try {
      await withdrawMoneyMutation.mutateAsync({
        accountId: account.id,
        amount: values.amount,
      });
      message.success("Money withdrawn successfully");
      setIsWithdrawModalOpen(false);
      withdrawForm.resetFields();
    } catch {
      message.error("Failed to withdraw money");
    }
  };

  const handleTransferMoney = async (values: any) => {
    if (!account) {
      message.error("No account selected");
      return;
    }
    try {
      await transferMoneyMutation.mutateAsync({
        fromAccountId: account.id,
        toAccountNumber: values.toAccountNumber,
        amount: values.amount,
        description: values.description,
      });
      message.success("Money transferred successfully");
      setIsTransferModalOpen(false);
      transferForm.resetFields();
    } catch (error: AxiosError | any) {
      message.error(error?.message || "Failed to transfer money");
    }
  };

  return (
    <Card
      hoverable
      onClick={() => setSelectedAccount(account)}
      style={{
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        cursor: "pointer",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Title level={5} style={{ marginBottom: 0 }}>
            {account.type}
          </Title>
          <Text type="secondary">{account.userName}</Text>
        </div>

        <Tag
          color={
            account.status.toString().toLowerCase() === "active"
              ? "green"
              : "red"
          }
        >
          {account.status}
        </Tag>
      </div>

      {/* Balance */}
      <div style={{ marginTop: 20 }}>
        <Text type="secondary">Account Balance</Text>
        <Title level={2} style={{ margin: "4px 0" }}>
          ${account.balance.toLocaleString()}
        </Title>
      </div>

      {/* Account Number */}
      <div className="flex flex-col">
        <Space style={{ marginBottom: 20 }}>
          <Text strong>{account.accountNumber}</Text>
          <Button
            size="small"
            icon={<CopyOutlined />}
            onClick={(e) => {
              e.stopPropagation(); // prevent card selection
              navigator.clipboard.writeText(account.accountNumber);
            }}
          />
        </Space>

        {/* Actions */}
        <Space size="middle">
          <Tag color="red" icon={<MinusOutlined />} onClick={() => {
             setSelectedAccount(account)
             setIsWithdrawModalOpen(true)
          }}>
            Withdraw
          </Tag>
          <Tag color="gold" icon={<SwapOutlined />} onClick={() => {
             setSelectedAccount(account)
             setIsTransferModalOpen(true)
          }}>
            Transfer
          </Tag>
        </Space>
      </div>

      {/* Withdraw Modal */}
      <Modal
        title="Withdraw Money"
        open={isWithdrawModalOpen}
        onCancel={() => setIsWithdrawModalOpen(false)}
        onOk={() => {
          withdrawForm.submit()}}
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
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
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
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
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
    </Card>
  );
};
