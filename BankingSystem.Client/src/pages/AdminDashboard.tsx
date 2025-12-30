import { UserComponent } from "@/components/admin/UserComponent";
import { AccountComponent } from "@/components/admin/AccountComponent";
import { TransactionComponent } from "@/components/admin/TransactionComponent";
import { Space } from "antd";

export function AdminDashboard() {
  return (
    <div className="min-h-screen p-8">
      <UserComponent />
      <AccountComponent />
      <TransactionComponent />
      <Space style={{ height: "40px" }} />
    </div>
  );
}
