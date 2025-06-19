import React from "react";
import Link from "next/link";
import {
  Home,
  Users,
  User,
  Shield,
  Baby,
  Calendar,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  Phone,
  Mail,
  FileText,
  Clock,
  Briefcase,
  HeartPulse,
  Plus,
  Car,
  PawPrint,
} from "lucide-react";
import db from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

const Page = async (props: {
  params: Promise<{
    householdId: string;
  }>;
}) => {
  const params = await props.params;
  const household = await db.household.findUnique({
    where: { id: params.householdId },
    include: {
      head: true,
      residents: {
        orderBy: {
          lastName: "asc",
        },
        include: {
          business: true,
          vehicle: true,
          pet: true,
        },
      },
    },
  });

  if (!household) {
    notFound();
  }

  // Calculate statistics
  const residentCount = household.residents.length;
  const seniorCount = household.seniorCitizenCount;
  const pwdCount = household.pwdCount;
  const soloParentCount = household.soloParentCount;

  // Aggregate all businesses, vehicles, and pets from residents
  const allBusinesses = household.residents.flatMap((resident) =>
    resident.business.map((business) => ({
      ...business,
      residentName: `${resident.firstName} ${resident.lastName}`,
    }))
  );

  const allVehicles = household.residents.flatMap((resident) =>
    resident.vehicle.map((vehicle) => ({
      ...vehicle,
      residentName: `${resident.firstName} ${resident.lastName}`,
    }))
  );

  const allPets = household.residents.flatMap((resident) =>
    resident.pet.map((pet) => ({
      ...pet,
      residentName: `${resident.firstName} ${resident.lastName}`,
    }))
  );

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between h-16 mb-6">
        <div className="flex items-center space-x-3">
          <Link href="/admin/household-registration">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Household Details
            </h1>
            <p className="text-sm text-gray-500">
              Comprehensive information about this household
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/household-registration/${params.householdId}/edit`}
          >
            <Button variant="outline">
              <Edit className="h-4 w-4" />
              Edit Household
            </Button>
          </Link>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Household Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Property Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-base">{household.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Block & Lot
                    </p>
                    <p className="text-base">
                      Block {household.block}, Lot {household.lot}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Household Type
                    </p>
                    <p className="text-base">{household.type}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <Badge
                      variant="outline"
                      className={
                        household.status === "Active"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : household.status === "Inactive"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                      }
                    >
                      {household.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Date Registered
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-base">
                        {new Date(household.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Last Updated
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <p className="text-base">
                        {new Date(household.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Head of Household Card */}
          {household.head && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Head of Household
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Full Name
                      </p>
                      <p className="text-base">
                        {household.head.lastName}, {household.head.firstName}{" "}
                        {household.head.middleName}
                        {household.head.extensionName &&
                          `, ${household.head.extensionName}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Birthdate
                      </p>
                      <p className="text-base">
                        {new Date(
                          household.head.birthDate
                        ).toLocaleDateString()}{" "}
                        (Age: {household.head.age})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Civil Status
                      </p>
                      <p className="text-base">{household.head.civilStatus}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Contact Information
                      </p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="text-base">
                          {household.head.phoneNumber}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="text-base">{household.head.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Occupation
                      </p>
                      <p className="text-base">{household.head.occupation}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Special Categories
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {household.seniorCitizenCount > 0 && (
                          <Badge variant="outline">
                            <Shield className="h-3 w-3 mr-1" />
                            Senior Citizen
                          </Badge>
                        )}
                        {household.pwdCount > 0 && (
                          <Badge variant="outline">
                            <HeartPulse className="h-3 w-3 mr-1" />
                            PWD
                          </Badge>
                        )}
                        {household.soloParentCount > 0 && (
                          <Badge variant="outline">
                            <Baby className="h-3 w-3 mr-1" />
                            Solo Parent
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Residents Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Household Members ({residentCount})
                </div>
                <div className="flex gap-2">
                  {seniorCount > 0 && (
                    <Badge variant="outline">
                      {seniorCount} Senior{" "}
                      {seniorCount !== 1 ? "Citizens" : "Citizen"}
                    </Badge>
                  )}
                  {pwdCount > 0 && (
                    <Badge variant="outline">
                      {pwdCount} PWD{pwdCount !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  {soloParentCount > 0 && (
                    <Badge variant="outline">
                      {soloParentCount} Solo Parent
                      {soloParentCount !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {household.residents.map((resident) => (
                  <div
                    key={resident.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {resident.lastName}, {resident.firstName}
                          {resident.middleName && ` ${resident.middleName}`}
                          {resident.extensionName &&
                            `, ${resident.extensionName}`}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{resident.gender}</Badge>
                          <Badge variant="outline">
                            {resident.civilStatus}
                          </Badge>
                          <Badge variant="outline">
                            {resident.age} years old
                          </Badge>
                          {resident.id === household.headId && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              Head
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/residents/${resident.id}/view-profile`} passHref>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Resident's Businesses */}
                    {resident.business.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Businesses:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {resident.business.map((business) => (
                            <Badge key={business.id} variant="outline">
                              <Briefcase className="h-3 w-3 mr-1" />
                              {business.name} ({business.type})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resident's Vehicles */}
                    {resident.vehicle.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Vehicles:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {resident.vehicle.map((vehicle) => (
                            <Badge key={vehicle.id} variant="outline">
                              <Car className="h-3 w-3 mr-1" />
                              {vehicle.plateNumber} ({vehicle.type})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resident's Pets */}
                    {resident.pet.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Pets:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {resident.pet.map((pet) => (
                            <Badge key={pet.id} variant="outline">
                              <PawPrint className="h-3 w-3 mr-1" />
                              {pet.name} ({pet.type})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          {/* Household Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Household Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    Total Members
                  </p>
                  <p className="text-base font-medium">{residentCount}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    Senior Citizens
                  </p>
                  <p className="text-base font-medium">{seniorCount}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500">PWDs</p>
                  <p className="text-base font-medium">{pwdCount}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    Solo Parents
                  </p>
                  <p className="text-base font-medium">{soloParentCount}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    Total Businesses
                  </p>
                  <p className="text-base font-medium">
                    {allBusinesses.length}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    Total Vehicles
                  </p>
                  <p className="text-base font-medium">{allVehicles.length}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    Total Pets
                  </p>
                  <p className="text-base font-medium">{allPets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid lg:grid-cols-2 grid-cols-1 gap-3">
              <Link
                href={`/admin/residents/create`}
              >
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4" />
                  Add Resident
                </Button>
              </Link>
              <Link
                href={`/admin/business-registration/create`}
              >
                <Button variant="default" className="w-full">
                  <Plus className="h-4 w-4" />
                  Add Business
                </Button>
              </Link>
              <Link
                href={`/admin/vehicle-registration/create`}
              >
                <Button variant="default" className="w-full">
                  <Plus className="h-4 w-4" />
                  Add Vehicle
                </Button>
              </Link>
              <Link
                href={`/admin/pet-registration/create`}
              >
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4" />
                  Add Pet
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
