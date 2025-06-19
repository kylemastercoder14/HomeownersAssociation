import React from "react";
import db from "@/lib/db";
import { DueForm } from "@/components/forms/dues-form";
import Link from "next/link";
import { Button } from "../../../../../../components/ui/button";
import { ArrowLeft, Wallet } from "lucide-react";

const Page = async (props: {
  params: Promise<{
    dueId: string;
  }>;
}) => {
  const params = await props.params;
  const dues = await db.due.findUnique({
    where: { id: params.dueId },
    include: {
      payments: true,
    },
  });

  const households = await db.household.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const isEditMode = dues !== null;
  const pageTitle = isEditMode ? "Edit Monthly Dues" : "Create Monthly Dues";

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin/monthly-dues">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {pageTitle}
              </h1>
              <p className="text-sm text-gray-500">
                {isEditMode
                  ? `Managing monthly dues for ${dues.fiscalMonth} ${dues.fiscalYear}`
                  : "Create a new monthly dues entry for the barangay"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {households.length}
            </div>
            <div className="text-xs text-gray-500">Available Households</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {households.length}
            </div>
            <div className="text-xs text-gray-500">Registered Households</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-8 pt-4">
        <DueForm initialData={dues} households={households} />
      </div>
    </div>
  );
};

export default Page;
