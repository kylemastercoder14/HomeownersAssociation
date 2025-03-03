import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, BusinessColumn } from "./column";

const BusinessClient = ({ data }: { data: BusinessColumn[] }) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default BusinessClient;
