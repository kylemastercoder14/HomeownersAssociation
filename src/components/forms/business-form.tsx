"use client";

import { Business, Residents } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BusinessValidation } from "@/validators/business";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/globals/submit-button";
import Heading from "@/components/ui/heading";
import "react-phone-number-input/style.css";
import ComboBox from "@/components/ui/combo-box";
import { sectors } from "@/data/sector";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { createBusiness, updateBusiness } from "@/actions/business";

const BusinessForm = ({
  initialData,
  residents,
}: {
  initialData: Business | null;
  residents: Residents[];
}) => {
  const title = initialData ? "Edit Business" : "Add Business";
  const description = initialData
    ? "Edit the business details below"
    : "Fill in the details below to create a new business.";
  const action = initialData ? "Save Changes" : "Submit";
  const router = useRouter();

  const [isSameAddress, setIsSameAddress] = React.useState(false);

  const form = useForm<z.infer<typeof BusinessValidation>>({
    resolver: zodResolver(BusinessValidation),
    defaultValues: {
      name: initialData?.name || "",
      scale: initialData?.scale || "",
      address: initialData?.address || "",
      type: initialData?.type || "",
      sector: initialData?.sector || "",
      operationType: initialData?.operationType || "",
      occupancy: initialData?.occupancy || "",
      area: initialData?.area || "",
      residentId: initialData?.ownerId || "",
    },
  });

  const selectedResident = residents.find(
    (resident) => resident.id === form.watch("residentId")
  );

  React.useEffect(() => {
    if (isSameAddress && selectedResident) {
      form.setValue(
        "address",
        "Sample address selectedResident.address dapat dito"
      );
    }
  }, [isSameAddress, selectedResident, form]);

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof BusinessValidation>) => {
    try {
      if (initialData) {
        const res = await updateBusiness(initialData.id, values);
        if (res.success) {
          toast.success(res.success);
          router.push("/admin/business-registration");
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createBusiness(values);
        if (res.success) {
          toast.success(res.success);
          router.push("/admin/business-registration");
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the business.");
    }
  };
  return (
    <div>
      <Heading title={title} description={description} />
      <Form {...form}>
        <form
          autoComplete="off"
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-5"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Store Name <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Enter the store name (e.g. Juan's Sari Sari Store)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="scale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Scale <span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the business scale" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Micro">
                          Micro (Not more than 3M or having 1-9 employees)
                        </SelectItem>
                        <SelectItem value="Small">
                          Small (3M - 15M or having 10-99 employees)
                        </SelectItem>
                        <SelectItem value="Medium">
                          Medium (15M - 100M or having 100-199 employees)
                        </SelectItem>
                        <SelectItem value="Large">
                          Large (More than 100M or asset size of more than 100M)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Type <span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the business type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Sole Proprietorship">
                          Sole Proprietorship
                        </SelectItem>
                        <SelectItem value="Partnership">Partnership</SelectItem>
                        <SelectItem value="Insitutional">
                          Insitutional
                        </SelectItem>
                        <SelectItem value="Corporation">Corporation</SelectItem>
                        <SelectItem value="Cooperative">Cooperative</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Sector <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <ComboBox
                        className="w-full"
                        disabled={isSubmitting}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select the business sector"
                        data={sectors.map((sector) => ({
                          label: sector,
                          value: sector,
                        }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="operationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Operation <span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the business operation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Day time">Day time</SelectItem>
                        <SelectItem value="Night shift">Night shift</SelectItem>
                        <SelectItem value="Both day and night">
                          Both day and night
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="occupancy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Occupancy <span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the business occupancy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Owned">Owned</SelectItem>
                        <SelectItem value="Rented">Rented</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Area (sqm){" "}
                      <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Enter the business area (e.g. 20 sqm)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="residentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Owner <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <ComboBox
                        className="w-full"
                        disabled={isSubmitting}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select the owner"
                        data={residents.map((resident) => ({
                          label: resident.lastName + ", " + resident.firstName,
                          value: resident.id,
                        }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Address <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting}
                        placeholder="Enter the business address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center mt-3 space-x-2">
                <Checkbox
                  id="isAddress"
                  checked={isSameAddress}
                  onCheckedChange={(checked) => {
                    setIsSameAddress(checked === true);
                    if (checked && selectedResident) {
                      form.setValue(
                        "address",
                        "Sample address selectedResident.address dapat dito"
                      );
                    } else {
                      form.setValue("address", "");
                    }
                  }}
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="isAddress"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Same as {"owner's"} address
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center mt-3 gap-2">
            <Button type="button" disabled={isSubmitting} onClick={() => router.back()} variant="ghost">
              Cancel
            </Button>
            <SubmitButton loading={isSubmitting} label={action} />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BusinessForm;
