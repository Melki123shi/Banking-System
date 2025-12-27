import { Card, Row, Col, Button, Statistic, List, Avatar, Space } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { TransactionComponent } from "@/components/user/TransactionComponent";

export const UserDashboard = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <Card
          className={`balance-card`}
          style={{
            background: "#ffffff",
          }}
        >
          <div className="card-header">
            <h3>Main Personal Account</h3>
            <Button type="text">Manage Wallet →</Button>
          </div>

          <div className="balance-section">
            <p className="balance-label">Account Balance</p>
            <h1 className="balance-amount">32</h1>
            <p className="card-number">
              123
              <CopyOutlined style={{ marginLeft: "8px", cursor: "pointer" }} />
            </p>
          </div>

          <Space>
            <Button
              type="primary"
              icon={<ArrowUpOutlined />}
              style={{
                background: "#22c55e",
                borderColor: "#22c55e",
              }}
            >
              New Transfer
            </Button>
            <Button icon={<ArrowDownOutlined />}>Full History</Button>
          </Space>
        </Card>
      </Col>

      <Col xs={24} md={12}>
        <Card
          className={`stats-card`}
          style={{
            background: "#ffffff",
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={12}>
              <Statistic
                title="Monthly Spending"
                value={2500}
                prefix="$"
                valueStyle={{
                  color: "#000000",
                }}
              />
            </Col>
            <Col xs={12}>
              <Statistic
                title="Pending Transfers"
                value={1}
                valueStyle={{
                  color: "#000000",
                }}
              />
            </Col>
            <Col xs={12}>
              <Statistic
                title="Cards Active"
                value={2}
                valueStyle={{
                  color: "#000000",
                }}
              />
            </Col>
            <Col xs={12}>
              <Statistic
                title="Rewards Points"
                value={1250}
                valueStyle={{
                  color: "#000000",
                }}
              />
            </Col>
          </Row>
        </Card>
      </Col>

      <Col xs={24}>
        <Card
          title="Recent Transactions"
          style={{
            background: "#ffffff",
          }}
        >
          <TransactionComponent />
        </Card>
      </Col>
    </Row>
  );
};

export default UserDashboard;
