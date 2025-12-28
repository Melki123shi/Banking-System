import { Tag, Spin } from "antd";
import { useUserAccounts } from "@/hooks/useAccount";

interface Props {
  userId: string;
}

const UserAccounts = ({ userId }: Props) => {
  const { data, isLoading } = useUserAccounts(userId);
  // console.log("-------------------->>>>>>>>>>");
  // console.log(data, data?.length);

  if (isLoading) {
    return <Spin size="small" />;
  }

  if (!data || data.length === 0) {
    return <Tag>No Accounts</Tag>;
  }

  

  return (
    <div className="flex flex-col gap-2">
      {data.map((account) => (
        <Tag color="blue" key={account.id}>
          {account.accountNumber}
        </Tag>
      ))}
    </div>
  );
};

export default UserAccounts;
