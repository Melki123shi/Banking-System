// components/DataTable.tsx
import { Table } from "antd";
import type { TableProps } from "antd/es/table";

type DataTableProps<T> = Omit<TableProps<T>, "title"> & {
  title?: React.ReactNode; // your header text/node
  extra?: React.ReactNode;
};

export function DataTable<T extends object>({ title, extra, ...props }: DataTableProps<T>) {
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {extra}
      </div>
      <Table {...props} bordered />
    </div>
  );
}
