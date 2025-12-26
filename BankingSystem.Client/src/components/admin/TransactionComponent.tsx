import { useState, useMemo } from "react";
import { Layout, Card, Tag } from "antd";
import { DataTable } from "@/components/DataTable";
import { useGetTransactions } from "@/hooks/useGetTransactions";
// import { useUsersForTransactions } from "@/hooks/useUsersForTransactions";
import type { Transaction } from "@/entities/transaction";

const PAGE_SIZE = 10;

const TransactionComponent = () => {
//   const [page, setPage] = useState(1);

//   const { data: transactions = [], isLoading } =
//     useGetTransactions(page, PAGE_SIZE);

//   /* ---------------- Collect accountIds ---------------- */
//   const accountIds = useMemo(
//     () =>
//       transactions.flatMap((tx) => [
//         tx.senderAccountId,
//         tx.receiverAccountId,
//       ]),
//     [transactions]
//   );

//   /* ---------------- Fetch users ---------------- */
//   const { userMap } = useUsersForTransactions(accountIds);

//   /* ---------------- Columns ---------------- */
//   const columns = [
//     {
//       title: "Transaction ID",
//       dataIndex: "transactionId",
//       key: "transactionId",
//     },
//     {
//       title: "Sender",
//       key: "sender",
//       render: (_: any, record: Transaction) =>
//         record.senderAccountId
//           ? userMap[record.senderAccountId]?.name ?? "—"
//           : "—",
//     },
//     {
//       title: "Receiver",
//       key: "receiver",
//       render: (_: any, record: Transaction) =>
//         record.receiverAccountId
//           ? userMap[record.receiverAccountId]?.name ?? "—"
//           : "—",
//     },
//     {
//       title: "Amount",
//       dataIndex: "amount",
//       key: "amount",
//       render: (amount: number) => `$${amount.toLocaleString()}`,
//     },
//     {
//       title: "Type",
//       dataIndex: "type",
//       key: "type",
//       render: (type: string) => (
//         <Tag color="blue">{type.toUpperCase()}</Tag>
//       ),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status: string) => {
//         const color =
//           status === "Completed"
//             ? "green"
//             : status === "Pending"
//             ? "orange"
//             : "red";

//         return <Tag color={color}>{status.toUpperCase()}</Tag>;
//       },
//     },
//     {
//       title: "Created At",
//       dataIndex: "createdAt",
//       key: "createdAt",
//       render: (date: string) =>
//         new Date(date).toLocaleString(),
//     },
//   ];

//   return (
//     <Layout className="min-h-screen">
//       <Layout.Content className="p-8">
//         <Card>
//           <DataTable
//             title="Transactions"
//             loading={isLoading}
//             dataSource={transactions}
//             columns={columns}
//             rowKey="id"
//             pagination={{
//               current: page,
//               pageSize: PAGE_SIZE,
//               onChange: setPage,
//             }}
//           />
//         </Card>
//       </Layout.Content>
//     </Layout>
//   );
};

export default TransactionComponent;
