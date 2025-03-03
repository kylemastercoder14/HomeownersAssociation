import React from "react";
import db from "@/lib/db";
import BusinessForm from "@/components/forms/business-form";

const Page = async (props: {
  params: Promise<{
    businessId: string;
  }>;
}) => {
  const params = await props.params;
  const business = await db.business.findUnique({
    where: {
      id: params.businessId,
    },
  });

  const residents = await db.residents.findMany({
    orderBy: {
      lastName: "asc",
    },
  });
  return (
    <div>
      <BusinessForm initialData={business} residents={residents} />
    </div>
  );
};

export default Page;
