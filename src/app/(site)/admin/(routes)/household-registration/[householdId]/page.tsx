import React from "react";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import db from "@/lib/db";
import { HouseholdForm } from "@/components/forms/household-form";
import { Button } from "@/components/ui/button";

const Page = async (props: {
  params: Promise<{
    householdId: string;
  }>;
}) => {
  const params = await props.params;
  const household = await db.household.findUnique({
    where: {
      id: params.householdId,
    },
    include: {
      head: true,
      residents: true,
    },
  });

  const residents = await db.residents.findMany({
    orderBy: {
      lastName: "asc",
    },
  });

  const isEditMode = household !== null;
  const pageTitle = isEditMode ? "Edit Household" : "Register Household";
  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin/household-registration">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Home className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {pageTitle}
              </h1>
              <p className="text-sm text-gray-500">
                {isEditMode
                  ? `Managing household: Block ${household.block}, Lot ${household.lot}`
                  : "Add a new household to the barangay registry"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {residents.length}
            </div>
            <div className="text-xs text-gray-500">Available Residents</div>
          </div>
          {isEditMode && (
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {household.residents?.length || 0}
              </div>
              <div className="text-xs text-gray-500">Current Members</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-8 pt-4">
        <HouseholdForm initialData={household} residents={residents} />
      </div>
    </div>
  );
};

export default Page;
