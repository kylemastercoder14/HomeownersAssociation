import React from "react";
import db from "@/lib/db";
import { MonthlyDuesTable } from './_components/monthly-dues-table';

const Page = async () => {
  const data = await db.due.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      payments: true,
      household: {
        include: {
          head: true
        },
      },
    },
  });

  // Map description: null => undefined and meterReading: null => undefined to match DueWithRelations type
  const mappedData = data.map(due => ({
    ...due,
    description: due.description === null ? undefined : due.description,
    meterReading: due.meterReading === null ? undefined : due.meterReading,
    previousReading: due.previousReading === null ? undefined : due.previousReading,
    payments: due.payments.map(payment => ({
      ...payment,
      referenceNo: payment.referenceNo === null ? undefined : payment.referenceNo,
      receivedBy: payment.receivedBy === null ? undefined : payment.receivedBy,
    })),
  }));

  return (
    <div className="pb-6">
      <MonthlyDuesTable data={mappedData} />
    </div>
  );
};

export default Page;
