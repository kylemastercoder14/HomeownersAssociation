"use client";

import { Residents, Pet } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PetValidation } from "@/validators/pet";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/globals/submit-button";
import Heading from "@/components/ui/heading";
import ComboBox from "@/components/ui/combo-box";
import { createPet, updatePet } from '@/actions/pet';

const PetForm = ({
  initialData,
  residents,
}: {
  initialData: Pet | null;
  residents: Residents[];
}) => {
  const title = initialData ? "Edit Pet" : "Add Pet";
  const description = initialData
    ? "Edit the pet details below"
    : "Fill in the details below to create a new pet.";
  const action = initialData ? "Save Changes" : "Submit";
  const router = useRouter();

  const form = useForm<z.infer<typeof PetValidation>>({
    resolver: zodResolver(PetValidation),
    defaultValues: {
      type: initialData?.type || "",
      name: initialData?.name || "",
      color: initialData?.color || "",
      age: initialData?.age || 1,
      breed: initialData?.breed || "",
      residentId: initialData?.ownerId || "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof PetValidation>) => {
    try {
      if (initialData) {
        const res = await updatePet(initialData.id, values);
        if (res.success) {
          toast.success(res.success);
          router.push("/admin/pet-registration");
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createPet(values);
        if (res.success) {
          toast.success(res.success);
          router.push("/admin/pet-registration");
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the pet.");
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
                    Pet Name <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Enter the pet name (e.g. Lulu)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Pet Breed <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Enter the pet breed (e.g. Japanese Spitz)"
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
                      Pet Type <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Enter the pet type (e.g. Dog, Cat, Fish)"
                        {...field}
                      />
                    </FormControl>
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
                      Pet Color <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Enter the pet color (e.g. White)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="lg:grid-cols-2 grid grid-cols-1 gap-4">
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
                        disabled={isSubmitting}
                        placeholder="Enter the age (e.g. 1)"
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

export default PetForm;
