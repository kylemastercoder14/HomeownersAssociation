"use client";

import { Residents } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ResidentValidation } from "@/validators/resident";

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
import PhoneInput from "react-phone-number-input";
import CalendarInput from "@/components/ui/calendar-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { calculateAge } from "@/lib/utils";
import { createResident, updateResident } from "@/actions/resident";

const ResidentForm = ({ initialData }: { initialData: Residents | null }) => {
  const title = initialData ? "Edit Resident" : "Add Resident";
  const description = initialData
    ? "Edit the resident details below"
    : "Fill in the details below to create a new resident.";
  const action = initialData ? "Save Changes" : "Submit";
  const router = useRouter();

  const form = useForm<z.infer<typeof ResidentValidation>>({
    resolver: zodResolver(ResidentValidation),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      middleName: initialData?.middleName || "",
      extensionName: initialData?.extensionName || "",
      birthDate: initialData?.birthDate || "",
      email: initialData?.email || "",
      phoneNumber: initialData?.phoneNumber || "",
      age: initialData?.age || 18,
      civilStatus: initialData?.civilStatus || "",
      gender: initialData?.gender || "",
      occupation: initialData?.occupation || "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof ResidentValidation>) => {
    try {
      if (initialData) {
        const res = await updateResident(initialData.id, values);
        if (res.success) {
          toast.success(res.success);
          router.push("/admin/residents");
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createResident(values);
        if (res.success) {
          toast.success(res.success);
          router.push("/admin/residents");
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the resident.");
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
            <div className="grid lg:grid-cols-10 grid-cols-1 gap-4">
              <div className="lg:col-span-3">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First Name <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="Enter the first name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="lg:col-span-3">
                <FormField
                  control={form.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Middle Name{" "}
                        <span className="text-muted-foreground">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="Enter the middle name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="lg:col-span-3">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Last Name <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="Enter the last name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="lg:col-span-1">
                <FormField
                  control={form.control}
                  name="extensionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Ext. Name{" "}
                        <span className="text-muted-foreground">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. Jr., Sr., III"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email Address <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      disabled={isSubmitting}
                      placeholder="Enter the email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <PhoneInput
                      className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
                      placeholder="Enter the phone number"
                      defaultCountry="PH"
                      countries={["PH"]}
                      international
                      countryCallingCodeEditable={false}
                      withCountryCallingCode
                      limitMaxLength={true}
                      value={field.value}
                      onChange={field.onChange}
                      numberInputProps={{
                        className: `rounded-md px-4 focus:outline-none bg-transparent h-full w-full !bg-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed`,
                      }}
                      maxLength={16}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Date of Birth <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <CalendarInput
                        value={field.value ? new Date(field.value) : null}
                        onChange={(date) => {
                          field.onChange(date);
                          if (date) {
                            form.setValue("age", calculateAge(new Date(date)));
                          }
                        }}
                        disabled={isSubmitting}
                        placeholder="Select date of birth"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Age <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled
                        placeholder="Enter the age"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="civilStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Civil Status <span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the civil status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Separated">Separated</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Occupation <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Enter the occupation"
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
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Gender <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Male" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Female" />
                        </FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end items-center mt-3 gap-2">
            <Button
              disabled={isSubmitting}
              type="button"
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

export default ResidentForm;
