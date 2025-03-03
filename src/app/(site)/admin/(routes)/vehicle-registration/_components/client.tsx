import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, VehicleColumn } from "./column";

const VehicleClient = ({ data }: { data: VehicleColumn[] }) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default VehicleClient;
