import { Card, Row, Statistic } from "antd";

interface Props {
  title: string;
  count?: number;
  amount?: number;
}

export const SummaryStatBlock: React.FC<Props> = ({
  title,
  count,
  amount,
}) => (
  <Card size="small">
    <Row justify="space-between">
      <Statistic
        title={title}
        value={count}
      />
      <Statistic
        title="Amount"
        value={amount}
        suffix=" ETB"
      />
    </Row>
  </Card>
);
