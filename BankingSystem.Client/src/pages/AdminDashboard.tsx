import {UserComponent} from "@/components/admin/UserComponent";
import {AccountComponent} from "@/components/admin/AccountComponent";
import {TransactionComponent} from "@/components/admin/TransactionComponent";
import { AppLayout } from "@/components/common/Layout";
import { Space } from "antd";

export function AdminDashboard() {
  return (
    <AppLayout isAdmin={true}>
      <div
        className="
      "
      >
        <UserComponent />
        <AccountComponent />
        <TransactionComponent />
        <Space style={{ height: "40px" }} />
      </div>
    </AppLayout>
  );
}
