import React from "react";
import Link from "next/link";
import {
  User,
  Calendar,
  Phone,
  Mail,
  Briefcase,
  Car,
  PawPrint,
  Home,
  ChevronLeft,
  Edit,
  Trash2,
  FileText,
  Clock,
  Eye,
  Plus,
  Check,
  X,
} from "lucide-react";
import db from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

const Page = async (props: {
  params: Promise<{
    residentId: string;
  }>;
}) => {
  const params = await props.params;
  const resident = await db.residents.findUnique({
    where: { id: params.residentId },
    include: {
      business: true,
      vehicle: true,
      pet: true,
      household: true,
      headOfHousehold: true,
    },
  });

  if (!resident) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between h-16 mb-6">
        <div className="flex items-center space-x-3">
          <Link href="/admin/residents">
            <Button variant="secondary" size="icon">
              <ChevronLeft className="h-4 w-4 mr-2" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Resident Profile
            </h1>
            <p className="text-sm text-gray-500">
              Comprehensive information about {resident.firstName}{" "}
              {resident.lastName}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/residents/${params.residentId}`}>
            <Button variant="outline">
              <Edit className="h-4 w-4" />
              Edit Resident
            </Button>
          </Link>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Resident Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
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
                      {resident.lastName}, {resident.firstName}
                      {resident.middleName && ` ${resident.middleName}`}
                      {resident.extensionName && `, ${resident.extensionName}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Gender</p>
                    <p className="text-base">{resident.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Civil Status
                    </p>
                    <p className="text-base">{resident.civilStatus}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Birthdate & Age
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-base">
                        {resident.birthDate} (Age: {resident.age})
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Contact Information
                    </p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-base">{resident.phoneNumber}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-base">{resident.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Occupation
                    </p>
                    <p className="text-base">{resident.occupation}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Household Information Card */}
          {resident.household && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Household Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Address
                      </p>
                      <p className="text-base">{resident.household.address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Block & Lot
                      </p>
                      <p className="text-base">
                        Block {resident.household.block}, Lot{" "}
                        {resident.household.lot}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Household Type
                      </p>
                      <p className="text-base">{resident.household.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Status
                      </p>
                      <Badge
                        variant="outline"
                        className={
                          resident.household.status === "Active"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : resident.household.status === "Inactive"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }
                      >
                        {resident.household.status}
                      </Badge>
                    </div>
                    {resident.headOfHousehold && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Role
                        </p>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          Head of Household
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assets Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Assets Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Briefcase className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Businesses</p>
                    <div className="flex items-center gap-1">
                      {resident.business.length > 0 ? (
                        <>
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">
                            {resident.business.length} registered
                          </span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-red-500" />
                          <span className="text-sm">None</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Car className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Vehicles</p>
                    <div className="flex items-center gap-1">
                      {resident.vehicle.length > 0 ? (
                        <>
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">
                            {resident.vehicle.length} registered
                          </span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-red-500" />
                          <span className="text-sm">None</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <PawPrint className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">Pets</p>
                    <div className="flex items-center gap-1">
                      {resident.pet.length > 0 ? (
                        <>
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">
                            {resident.pet.length} registered
                          </span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-red-500" />
                          <span className="text-sm">None</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Card */}
          {resident.business.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Businesses ({resident.business.length})
                  </div>
                  <Link
                    href={`/admin/businesses/create?residentId=${resident.id}`}
                  >
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Business
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resident.business.map((business) => (
                    <div
                      key={business.id}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{business.name}</p>
                          <p className="text-sm text-gray-500">
                            {business.type}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/admin/businesses/${business.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vehicles Card */}
          {resident.vehicle.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Vehicles ({resident.vehicle.length})
                  </div>
                  <Link
                    href={`/admin/vehicles/create?residentId=${resident.id}`}
                  >
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Vehicle
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resident.vehicle.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{vehicle.plateNumber}</p>
                          <p className="text-sm text-gray-500">
                            {vehicle.type} • {vehicle.model}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/admin/vehicles/${vehicle.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pets Card */}
          {resident.pet.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PawPrint className="h-5 w-5" />
                    Pets ({resident.pet.length})
                  </div>
                  <Link href={`/admin/pets/create?residentId=${resident.id}`}>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Pet
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resident.pet.map((pet) => (
                    <div
                      key={pet.id}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{pet.name}</p>
                          <p className="text-sm text-gray-500">
                            {pet.type} • {pet.breed}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/admin/pets/${pet.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Stats and Actions */}
        <div className="space-y-6">
          {/* Resident Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resident Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p className="text-base font-medium">{resident.age}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-base font-medium">{resident.gender}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    Civil Status
                  </p>
                  <p className="text-base font-medium">
                    {resident.civilStatus}
                  </p>
                </div>
                {resident.household && (
                  <>
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-500">
                        Household
                      </p>
                      <p className="text-base font-medium">
                        {resident.household.address}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-500">
                        Household Status
                      </p>
                      <Badge
                        variant="outline"
                        className={
                          resident.household.status === "Active"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : resident.household.status === "Inactive"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }
                      >
                        {resident.household.status}
                      </Badge>
                    </div>
                  </>
                )}
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
            <CardContent className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              {resident.household && (
                <Link
                  href={`/admin/household-registration/${resident.household.id}/view-details`}
                >
                  <Button variant="outline" className="w-full">
                    <Home className="h-4 w-4" />
                    View Household
                  </Button>
                </Link>
              )}
              <Link href={`/admin/businesses/create?residentId=${resident.id}`}>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4" />
                  Add Business
                </Button>
              </Link>
              <Link href={`/admin/vehicles/create?residentId=${resident.id}`}>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4" />
                  Add Vehicle
                </Button>
              </Link>
              <Link href={`/admin/pets/create?residentId=${resident.id}`}>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4" />
                  Add Pet
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* System Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    Created At
                  </p>
                  <p className="text-base">
                    {new Date(resident.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    Last Updated
                  </p>
                  <p className="text-base">
                    {new Date(resident.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
