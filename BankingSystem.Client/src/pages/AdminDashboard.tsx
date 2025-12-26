import UserComponent from "@/components/admin/UserComponent";
import AccountComponent from "@/components/admin/AccountComponent";
import TransactionComponent from "@/components/admin/TransactionComponent";

export function AdminDashboard() {

  return (
    <>
    <UserComponent />
    <AccountComponent />
    {/* <TransactionComponent /> */}
    </>
  );
}
