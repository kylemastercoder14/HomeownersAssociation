import React from "react";
import db from "@/lib/db";
import ResidentForm from '@/components/forms/resident-form';

const Page = async (props: {
  params: Promise<{
    residentId: string;
  }>;
}) => {
  const params = await props.params;
  const resident = await db.residents.findUnique({
    where: {
      id: params.residentId,
    },
  });
  return (
    <div>
      <ResidentForm initialData={resident} />
    </div>
  );
};

export default Page;
