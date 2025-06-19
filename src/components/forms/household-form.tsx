"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import {
  Home,
  Users,
  MapPin,
  User,
  Heart,
  Shield,
  Baby,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Household, Residents } from "@prisma/client";
import { HouseholdFormValues, HouseHoldSchema } from "@/validators/household";
import { createHouseHold, updateHouseHold } from "@/actions/household";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface HouseholdFormProps {
  initialData: (Household & { head: Residents; residents: Residents[] }) | null;
  residents: Residents[];
}

export const HouseholdForm = ({
  initialData,
  residents,
}: HouseholdFormProps) => {
  const router = useRouter();
  const form = useForm<HouseholdFormValues>({
    resolver: zodResolver(HouseHoldSchema),
    defaultValues: {
      block: initialData?.block || "",
      lot: initialData?.lot || "",
      type: initialData?.type || "",
      status:
        (initialData?.status as "Active" | "Inactive" | "Vacant") || "Active",
      address: initialData?.address || "",
      seniorCitizenCount: initialData?.seniorCitizenCount || 0,
      pwdCount: initialData?.pwdCount || 0,
      soloParentCount: initialData?.soloParentCount || 0,
      headId: initialData?.head?.id || "",
      residentIds: initialData?.residents?.map((r) => r.id) || [],
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: HouseholdFormValues) => {
    try {
      let result;

      if (initialData) {
        // Update existing household
        result = await updateHouseHold(data, initialData.id);
      } else {
        // Create new household
        result = await createHouseHold(data);
      }

      if (result?.success) {
        // Show success message
        toast.success(
          initialData
            ? "Household updated successfully!"
            : "Household created successfully!"
        );

        router.push("/admin/household-registration");
      } else {
        toast.error(result?.error || "An error occurred");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Submission error:", error);
    }
  };

  const residentOptions = residents.map((resident) => ({
    label: `${resident.lastName}, ${resident.firstName}`,
    value: resident.id,
  }));

  const statusColors = {
    Active: "bg-green-100 text-green-800 border-green-200",
    Inactive: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Vacant: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const specialCounts = form.watch([
    "seniorCitizenCount",
    "pwdCount",
    "soloParentCount",
  ]);
  const totalSpecialResidents = specialCounts.reduce((sum, count) => {
    const numericCount = Number(count) || 0;
    return sum + numericCount;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Status Overview (for edit mode) */}
      {initialData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Current Household Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    statusColors[
                      initialData.status as keyof typeof statusColors
                    ]
                  }
                >
                  {initialData.status}
                </Badge>
                <span className="text-sm text-gray-600">Status</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">
                  {initialData.residents?.length || 0}
                </span>
                <span className="text-sm text-gray-600">Total Residents</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  Block {initialData.block}, Lot {initialData.lot}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Household Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Property Details Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      Property Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="block"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Block Number</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g., A1, B2"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lot"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lot Number</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g., 123, 456"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Type</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                disabled={isSubmitting}
                                className="border border-gray-300 px-3 h-9 focus:ring-1 focus:ring-black w-full rounded-md focus:border-transparent"
                              >
                                <option value="Owned">Owned</option>
                                <option value="Rented">Rented</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Household Status</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                disabled={isSubmitting}
                                className="border border-gray-300 px-3 h-9 focus:ring-1 focus:ring-black w-full rounded-md focus:border-transparent"
                              >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Vacant">Vacant</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Complete Address</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter full address including street name"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Special Categories Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-600" />
                      Special Categories
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="seniorCitizenCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Senior Citizens
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                placeholder="0"
                                disabled={isSubmitting}
                                min="0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pwdCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              PWD Count
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                placeholder="0"
                                disabled={isSubmitting}
                                min="0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="soloParentCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Baby className="h-4 w-4" />
                              Solo Parents
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                placeholder="0"
                                disabled={isSubmitting}
                                min="0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Residents Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      Household Members
                    </h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="headId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Head of Household</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                disabled={isSubmitting}
                                className="border border-gray-300 px-3 h-9 focus:ring-1 focus:ring-black w-full rounded-md focus:border-transparent"
                              >
                                <option value="">
                                  Select Head of Household
                                </option>
                                {residents.map((resident) => (
                                  <option key={resident.id} value={resident.id}>
                                    {resident.lastName}, {resident.firstName}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="residentIds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>All Household Residents</FormLabel>
                            <FormControl>
                              <Select
                                isMulti
                                isSearchable
                                options={residentOptions}
                                value={residentOptions.filter((option) =>
                                  field.value.includes(option.value)
                                )}
                                onChange={(selected) =>
                                  field.onChange(
                                    selected.map((opt) => opt.value)
                                  )
                                }
                                className="react-select-container"
                                classNamePrefix="react-select"
                                placeholder="Search and select residents..."
                                isDisabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {initialData ? "Update Household" : "Register Household"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Information Sidebar */}
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Total Special Residents:
                </span>
                <Badge variant="outline">{totalSpecialResidents}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Selected Residents:
                </span>
                <Badge variant="outline">
                  {form.watch("residentIds")?.length || 0}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge
                  className={
                    statusColors[
                      form.watch("status") as keyof typeof statusColors
                    ]
                  }
                >
                  {form.watch("status")}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Help Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold">Property Details</h4>
                <p className="text-gray-600">
                  Enter accurate block and lot numbers as they appear in
                  official documents.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Special Categories</h4>
                <p className="text-gray-600">
                  Count residents who qualify for special programs or benefits.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Household Head</h4>
                <p className="text-gray-600">
                  Select the primary responsible person for this household.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status Information */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Make sure all information is accurate before submitting. You can
              edit this information later if needed.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};
