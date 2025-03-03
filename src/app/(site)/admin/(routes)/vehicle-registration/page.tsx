import React from "react";
import db from "@/lib/db";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { VehicleColumn } from "./_components/column";
import VehicleClient from "./_components/client";
import { format } from "date-fns";

const Page = async () => {
  const data = await db.vehicle.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      owner: true,
    },
  });

  const formattedData: VehicleColumn[] =
    data.map((item) => {
      return {
        id: item.id,
        brand: `${item.brand} (${item.model})`,
        color: item.color,
        type: item.type,
        owner: item.owner.firstName + " " + item.owner.lastName,
        plateNumber: item.plateNumber,
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Vehicle Records"
          description="Manage all the vehicle record."
        />
        <Button size="sm">
          <Link href={`/admin/vehicle-registration/create`}>
            + Register Vehicle
          </Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <VehicleClient data={formattedData} />
    </div>
  );
};

export default Page;
