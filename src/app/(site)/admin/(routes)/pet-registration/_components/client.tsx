import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, PetColumn } from "./column";

const PetClient = ({ data }: { data: PetColumn[] }) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default PetClient;
