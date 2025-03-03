import React from "react";
import db from "@/lib/db";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { BusinessColumn } from "./_components/column";
import BusinessClient from "./_components/client";
import { format } from "date-fns";

const Page = async () => {
  const data = await db.business.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      owner: true,
    },
  });

  const formattedData: BusinessColumn[] =
    data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        address: item.address,
        owner: item.owner.firstName + " " + item.owner.lastName,
        scale: item.scale,
        type: item.type,
        sector: item.sector,
        availability: "Active",
        area: item.area,
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Business Records"
          description="Manage all the business record."
        />
        <Button size="sm">
          <Link href={`/admin/business-registration/create`}>
            + Register Business
          </Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <BusinessClient data={formattedData} />
    </div>
  );
};

export default Page;
