import React from "react";
import Link from "next/link";
import {
  Home,
  Users,
  Plus,
  Filter,
  MapPin,
  User,
  Heart,
  Shield,
  Baby,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  Activity,
} from "lucide-react";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HouseholdFilters } from "./_components/household-filters";
import { HouseholdControls } from "./_components/household-controls";

const Page = async ({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) => {
  // Extract and type cast search params
  const searchTerm =
    typeof searchParams.search === "string" ? searchParams.search : "";
  const statusFilter =
    typeof searchParams.status === "string" ? searchParams.status : "";
  const typeFilter =
    typeof searchParams.type === "string" ? searchParams.type : "";
  const currentPage = parseInt(
    typeof searchParams.page === "string" ? searchParams.page : "1"
  );
  const pageSize = parseInt(
    typeof searchParams.pageSize === "string" ? searchParams.pageSize : "10"
  );

  const whereClause = {
    AND: [
      {
        OR: [
          {
            address: {
              contains: searchTerm,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            block: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
          },
          { lot: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
        ],
      },
      statusFilter ? { status: statusFilter } : {},
      typeFilter ? { type: typeFilter } : {},
    ],
  };

  const [data, totalCount] = await Promise.all([
    db.household.findMany({
      where: whereClause,
      include: {
        residents: true,
        head: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    db.household.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const stats = {
    total: totalCount,
    active: await db.household.count({
      where: { ...whereClause, status: "Active" },
    }),
    inactive: await db.household.count({
      where: { ...whereClause, status: "Inactive" },
    }),
    vacant: await db.household.count({
      where: { ...whereClause, status: "Vacant" },
    }),
    totalResidents: data.reduce(
      (sum, h) => sum + (h.residents?.length || 0),
      0
    ),
    totalSpecialResidents: data.reduce(
      (sum, h) =>
        sum +
        (h.seniorCitizenCount || 0) +
        (h.pwdCount || 0) +
        (h.soloParentCount || 0),
      0
    ),
  };

  const statusColors = {
    Active: "bg-green-100 text-green-800 border-green-200",
    Inactive: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Vacant: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Home className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Household Management
            </h1>
            <p className="text-sm text-gray-500">
              Manage all registered households in the barangay
            </p>
          </div>
        </div>
        <Link href="/admin/household-registration/create">
          <Button>
            <Plus className="h-4 w-4" />
            Add Household
          </Button>
        </Link>
      </div>

      <div>
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 mt-3 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Home className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Households
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Households
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.active}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Residents
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalResidents}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Special Categories
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalSpecialResidents}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Search Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HouseholdFilters searchParams={searchParams} />
          </CardContent>
        </Card>

        {/* Households Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Households ({totalCount})
              </div>
              <HouseholdControls
                searchParams={searchParams}
                totalPages={totalPages}
                currentPage={currentPage}
                totalCount={totalCount}
                pageSize={pageSize}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property Info</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Head of Household</TableHead>
                    <TableHead>Residents</TableHead>
                    <TableHead>Special Categories</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Home className="h-12 w-12 text-gray-400" />
                          <p className="text-gray-500">
                            No households found matching your criteria
                          </p>
                          <Link href="/admin/household-registration">
                            <Button variant="outline" size="sm">
                              Clear Filters
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((household) => (
                      <TableRow key={household.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium">
                                Block {household.block}
                              </p>
                              <p className="text-sm text-gray-500">
                                Lot {household.lot}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{household.address}</p>
                            <p className="text-sm text-gray-500">
                              {household.type}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <div>
                              {household.head ? (
                                <>
                                  <p className="font-medium">
                                    {household.head.lastName},{" "}
                                    {household.head.firstName}
                                  </p>
                                  <p className="text-sm text-gray-500">Head</p>
                                </>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  No head assigned
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <Badge variant="outline">
                              {household.residents?.length || 0} residents
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {(household.seniorCitizenCount || 0) > 0 && (
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3 text-gray-500" />
                                <span className="text-xs">
                                  {household.seniorCitizenCount} Senior
                                </span>
                              </div>
                            )}
                            {(household.pwdCount || 0) > 0 && (
                              <div className="flex items-center gap-1">
                                <Shield className="h-3 w-3 text-gray-500" />
                                <span className="text-xs">
                                  {household.pwdCount} PWD
                                </span>
                              </div>
                            )}
                            {(household.soloParentCount || 0) > 0 && (
                              <div className="flex items-center gap-1">
                                <Baby className="h-3 w-3 text-gray-500" />
                                <span className="text-xs">
                                  {household.soloParentCount} Solo Parent
                                </span>
                              </div>
                            )}
                            {(household.seniorCitizenCount || 0) +
                              (household.pwdCount || 0) +
                              (household.soloParentCount || 0) ===
                              0 && (
                              <span className="text-xs text-gray-400">
                                None
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              statusColors[
                                household.status as keyof typeof statusColors
                              ]
                            }
                          >
                            {household.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">
                              {new Date(
                                household.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/admin/household-registration/${household.id}/view-details`}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/admin/household-registration/${household.id}`}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Footer */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {stats.active}
              </p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.inactive}
              </p>
              <p className="text-sm text-gray-600">Inactive</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">{stats.vacant}</p>
              <p className="text-sm text-gray-600">Vacant</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {stats.totalResidents}
              </p>
              <p className="text-sm text-gray-600">Total Residents</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
