import React from "react";
import db from "@/lib/db";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { ResidentColumn } from "./_components/column";
import ResidentClient from "./_components/client";
import { format } from "date-fns";

const Page = async () => {
  const data = await db.residents.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedData: ResidentColumn[] =
    data.map((item) => {
      return {
        id: item.id,
        name: `${item.firstName} ${item.middleName} ${item.lastName} ${item.extensionName}`,
        phoneNumber: item.phoneNumber,
        email: item.email,
        occupation: item.occupation,
        gender: item.gender,
        civilStatus: item.civilStatus,
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
          <Link href={`/admin/business-registration/create`}>+ Register Business</Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <ResidentClient data={formattedData} />
    </div>
  );
};

export default Page;
