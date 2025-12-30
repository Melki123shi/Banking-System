import React from 'react';
import { Modal, Descriptions, Tag, Row, Col, Card, Skeleton, Empty } from 'antd';
import { useUserAccounts } from '@/hooks/useAccount';
import type { User } from '@/entities/user';
import type { Account } from '@/entities/account';


interface Props {
  open: boolean;
  onClose: () => void;
  selectedUser: User;
}

const UserDetailModal: React.FC<Props> = ({
  open,
  onClose,
  selectedUser
}) => {
  const { data: accounts, isLoading } = useUserAccounts(selectedUser.id);

  const statusColor = (status: any) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'frozen': return 'orange';
      case 'closed': return 'gray';
      default: return 'default';
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={850}
      title="User Details"
    >
      {/* USER INFO */}
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Name">
          {selectedUser.name}
        </Descriptions.Item>
        <Descriptions.Item label="Phone">
          {selectedUser.phoneNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Role">
          {selectedUser.role}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={selectedUser.isActive ? "green" : "red"}>
            {selectedUser.isActive ? "active" : "inactive"}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      {/* ACCOUNTS */}
      <h3 style={{ margin: "24px 0 12px" }}>Accounts</h3>

      {isLoading && (
        <Row gutter={[16, 16]}>
          {[1, 2, 3].map(i => (
            <Col xs={24} sm={12} md={8} key={i}>
              <Skeleton active />
            </Col>
          ))}
        </Row>
      )}

      {!isLoading && accounts?.length === 0 && (
        <Empty description="No accounts found" />
      )}

      {!isLoading && accounts && (
        <Row gutter={[16, 16]}>
          {accounts.map(account => (
            <Col xs={24} sm={12} md={8} key={account.id}>
              <Card
                hoverable
                style={{
                  borderRadius: 12,
                  boxShadow: "0 8px 20px rgba(31, 131, 218, 0.08)",
                  border: "1px solid #f0f0f0"
                }}
              >
                <div style={{ fontSize: 13, color: "#888" }}>
                  Account Number
                </div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  {account.accountNumber}
                </div>

                <div style={{ fontSize: 13, color: "#888" }}>
                  Total Balance
                </div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  ETB {account.balance.toLocaleString()}
                </div>

                <div style={{ marginTop: 10 }}>
                  <Tag color={statusColor(account.status)}>
                    {account.status}
                  </Tag>
                </div>

                <div style={{ marginTop: 10, fontSize: 12, color: "#999" }}>
                  Created: {new Date(account.createdAt).toLocaleDateString()}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Modal>
  );
};

export default UserDetailModal;