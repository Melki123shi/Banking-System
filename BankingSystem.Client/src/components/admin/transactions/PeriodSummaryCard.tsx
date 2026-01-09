import { Card, Col, Row, Statistic } from "antd";
import type { TransactionSummaryDto, TransactionType } from "@/lib/types";
import { SummaryStatBlock } from "@/components/admin/transactions/SummaryStatBlock";
import { resolveSummaryValue } from "@/utils/transactionSummary";
import type { Color } from "antd/es/color-picker";

interface Props {
  title: string;
  summary?: TransactionSummaryDto;
  selectedType: TransactionType;
}

export const PeriodSummaryCard: React.FC<Props> = ({
  title,
  summary,
  selectedType,
}) => {

  const totalAmount = resolveSummaryValue(
    summary,
    selectedType,
    (s) => s.totalAmount,
    (t) => t?.totalAmount
  );

  const completedCount = resolveSummaryValue(
    summary,
    selectedType,
    (s) => s.completedTransactions,
    (t) => t?.completedTransactions
  );

  const completedAmount = resolveSummaryValue(
    summary,
    selectedType,
    (s) => s.completedAmount,
    (t) => t?.completedAmount
  );

  const pendingCount = resolveSummaryValue(
    summary,
    selectedType,
    (s) => s.pendingTransactions,
    (t) => t?.pendingTransactions
  );

  const pendingAmount = resolveSummaryValue(
    summary,
    selectedType,
    (s) => s.pendingAmount,
    (t) => t?.pendingAmount
  );

  const failedCount = resolveSummaryValue(
    summary,
    selectedType,
    (s) => s.failedTransactions,
    (t) => t?.failedTransactions
  );

  const failedAmount = resolveSummaryValue(
    summary,
    selectedType,
    (s) => s.failedAmount,
    (t) => t?.failedAmount
  );

  return (
    <Card >
      <Statistic
        title={title}
        value={totalAmount}
        suffix=" ETB"
        style={{ marginBottom: 21 }}
      />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <SummaryStatBlock
            title="Completed"
            count={completedCount}
            amount={completedAmount}
          />
        </Col>
        <Col span={24}>
          <SummaryStatBlock
            title="Pending"
            count={pendingCount}
            amount={pendingAmount}
          />
        </Col>
        <Col span={24}>
          <SummaryStatBlock
            title="Failed"
            count={failedCount}
            amount={failedAmount}
          />
        </Col>
      </Row>
    </Card>
  );
};
