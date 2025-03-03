"use client";

import { Vehicle, Residents } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { VehicleValidation } from "@/validators/vehicle";

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
import { createVehicle, updateVehicle } from "@/actions/vehicle";
import ComboBox from '@/components/ui/combo-box';

const VehicleForm = ({
  initialData,
  residents,
}: {
  initialData: Vehicle | null;
  residents: Residents[];
}) => {
  const title = initialData ? "Edit Vehicle" : "Add Vehicle";
  const description = initialData
    ? "Edit the vehicle details below"
    : "Fill in the details below to create a new vehicle.";
  const action = initialData ? "Save Changes" : "Submit";
  const router = useRouter();

  const form = useForm<z.infer<typeof VehicleValidation>>({
    resolver: zodResolver(VehicleValidation),
    defaultValues: {
      type: initialData?.type || "",
      model: initialData?.model || "",
      color: initialData?.color || "",
      brand: initialData?.brand || "",
      plateNumber: initialData?.plateNumber || "",
      residentId: initialData?.ownerId || "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof VehicleValidation>) => {
    try {
      if (initialData) {
        const res = await updateVehicle(initialData.id, values);
        if (res.success) {
          toast.success(res.success);
          router.push("/admin/vehicle-registration");
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createVehicle(values);
        if (res.success) {
          toast.success(res.success);
          router.push("/admin/vehicle-registration");
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the vehicle.");
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
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Vehicle Brand <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Enter the vehicle brand (e.g. Honda)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Vehicle Model <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Enter the vehicle model (e.g. Civic)"
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Vehicle Type <span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the vehicle type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Bicycle">Bicycle</SelectItem>
                        <SelectItem value="E-bicycle">E-bicycle</SelectItem>
                        <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                        <SelectItem value="Tricycle">Tricycle</SelectItem>
                        <SelectItem value="Car">Car</SelectItem>
                        <SelectItem value="Jeepney">Jeepney</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
                        <SelectItem value="Truck">Truck</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Vehicle Color <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Enter the vehicle color (e.g. Black)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="plateNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Plate/Induction/MV number{" "}
                    <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Enter the vehicle plate number"
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
                        className="w-[500px]"
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
          <div className="flex justify-end items-center mt-3 gap-2">
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => router.back()}
              variant="ghost"
            >
              Cancel
            </Button>
            <SubmitButton loading={isSubmitting} label={action} />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VehicleForm;
