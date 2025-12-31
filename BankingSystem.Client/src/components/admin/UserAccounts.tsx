import { Tag, Spin } from "antd";
import { useUserAccounts } from "@/hooks/useAccount";

interface Props {
  userId: string;
}

export const UserAccounts = ({ userId }: Props) => {
  const { data, isLoading } = useUserAccounts(userId);

  if (isLoading) {
    return <Spin size="small" />;
  }

  if (!data || data.length === 0) {
    return <Tag>No Accounts</Tag>;
  }

  

  return (
    <div className="flex flex-col gap-2">
      {data.map((account) => (
        <p className={`${account.status === 'active' ? 'text-green-600' : 'text-red-600'}`} key={account.id}>
          {account.accountNumber}
        </p>
      ))}
    </div>
  );
};

export default UserAccounts;
