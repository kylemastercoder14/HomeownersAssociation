import React from "react";
import db from "@/lib/db";
import PetForm from "@/components/forms/pet-form";

const Page = async (props: {
  params: Promise<{
    petId: string;
  }>;
}) => {
  const params = await props.params;
  const pet = await db.pet.findUnique({
    where: {
      id: params.petId,
    },
  });

  const residents = await db.residents.findMany({
    orderBy: {
      lastName: "asc",
    },
  });
  return (
    <div>
      <PetForm initialData={pet} residents={residents} />
    </div>
  );
};

export default Page;
