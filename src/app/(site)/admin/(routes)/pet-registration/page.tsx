import React from "react";
import db from "@/lib/db";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { PetColumn } from "./_components/column";
import PetClient from "./_components/client";
import { format } from "date-fns";

const Page = async () => {
  const data = await db.pet.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      owner: true,
    },
  });

  const formattedData: PetColumn[] =
    data.map((item) => {
      return {
        id: item.id,
        breed: item.breed,
        color: item.color,
        type: item.type,
        owner: item.owner.firstName + " " + item.owner.lastName,
        name: item.name,
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading title="Pet Records" description="Manage all the pet record." />
        <Button size="sm">
          <Link href={`/admin/pet-registration/create`}>+ Register Pet</Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <PetClient data={formattedData} />
    </div>
  );
};

export default Page;
