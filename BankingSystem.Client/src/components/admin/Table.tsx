// import { Button, Space, Tag, Select } from "antd";
// import { DollarOutlined } from "@ant-design/icons";
// import type { User } from "@/entities/user";

// const { Option } = Select;

// export  const userColumns = [
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Phone",
//       dataIndex: "phoneNumber",
//       key: "phoneNumber",
//     },
//     {
//       title: "Status",
//       dataIndex: "isActive",
//       key: "isActive",
//       render: (isActive: boolean) => (
//         <Tag color={isActive ? "success" : "error"}>
//           {isActive ? "ACTIVE" : "SUSPENDED"}
//         </Tag>
//       ),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: unknown, record: User) => (
//         <Space>
//           <Button
//             size="small"
//             icon={<DollarOutlined />}
//             onClick={() => {
//               setSelectedUserId(record.id);
//               setDepositModalVisible(true);
//             }}
//           >
//             Deposit
//           </Button>

//           <Select
//             size="small"
//             value={record.isActive ? "active" : "suspended"}
//             style={{ width: 120 }}
//             onChange={(value) =>
//               updateUserStatus(record.id, value === "active")
//             }
//           >
//             <Option value="active">Active</Option>
//             <Option value="suspended">Suspended</Option>
//           </Select>
//         </Space>
//       ),
//     },
//   ];