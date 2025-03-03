import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, ResidentColumn } from "./column";

const ResidentClient = ({ data }: { data: ResidentColumn[] }) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default ResidentClient;
