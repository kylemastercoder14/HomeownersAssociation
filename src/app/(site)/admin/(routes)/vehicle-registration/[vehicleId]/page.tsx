import React from "react";
import db from "@/lib/db";
import VehicleForm from "@/components/forms/vehicle-form";

const Page = async (props: {
  params: Promise<{
    vehicleId: string;
  }>;
}) => {
  const params = await props.params;
  const vehicle = await db.vehicle.findUnique({
    where: {
      id: params.vehicleId,
    },
  });

  const residents = await db.residents.findMany({
    orderBy: {
      lastName: "asc",
    },
  });
  return (
    <div>
      <VehicleForm initialData={vehicle} residents={residents} />
    </div>
  );
};

export default Page;
