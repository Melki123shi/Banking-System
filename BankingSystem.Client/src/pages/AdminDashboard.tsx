import UserComponent from "@/components/admin/UserComponent";
import AccountComponent from "@/components/admin/AccountComponent";
import TransactionComponent from "@/components/admin/TransactionComponent";
import { AppLayout } from "@/components/Layout";

export function AdminDashboard() {
  return (
    <AppLayout>
      <UserComponent />
      <AccountComponent />
      <TransactionComponent />
    </AppLayout>
  );
}
