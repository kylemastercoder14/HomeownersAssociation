import React from "react";
import { SectionCards } from './_components/section-cards';
import { HOAChartAreaInteractive } from './_components/chart-area';
import { DataTable } from './_components/data-table';
import data from "./_components/data.json"

const Page = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div>
            <HOAChartAreaInteractive />
          </div>
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
};

export default Page;
