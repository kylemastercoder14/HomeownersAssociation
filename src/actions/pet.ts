/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
"use server";

import db from "@/lib/db";
import { z } from "zod";
import { PetValidation } from "@/validators/pet";
import { useUser } from "@/hooks/use-user";

export const createPet = async (values: z.infer<typeof PetValidation>) => {
  const { user } = await useUser();
  if (!user) {
    return { error: "You must be logged in to register a pet." };
  }

  const validatedField = PetValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { residentId, type, breed, color, age, name } = validatedField.data;

  try {
    await db.pet.create({
      data: {
        type,
        ownerId: residentId,
        breed,
        color,
        name,
        age,
      },
    });

    const action = `Created pet ${name} (${type}) at ${new Date().toISOString()}`;

    await db.logs.create({
      data: {
        action,
        adminId: user.id,
      },
    });

    return { success: "Pet registered successfully" };
  } catch (error: any) {
    return {
      error: `Failed to register pet. Please try again. ${error.message || ""}`,
    };
  }
};

export const updatePet = async (
  id: string,
  values: z.infer<typeof PetValidation>
) => {
  const { user } = await useUser();
  if (!user) {
    return { error: "You must be logged in to update a pet." };
  }

  const validatedField = PetValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { residentId, type, breed, color, age, name } = validatedField.data;

  try {
    await db.pet.update({
      data: {
        type,
        ownerId: residentId,
        breed,
        color,
        name,
        age,
      },
      where: {
        id,
      },
    });

    const action = `Updated pet ${name} (${type}) at ${new Date().toISOString()}`;

    await db.logs.create({
      data: {
        action,
        adminId: user.id,
      },
    });

    return { success: "Pet updated successfully" };
  } catch (error: any) {
    return {
      error: `Failed to update pet. Please try again. ${error.message || ""}`,
    };
  }
};

export const deletePet = async (id: string) => {
  const { user } = await useUser();
  if (!user) {
    return { error: "You must be logged in to delete a pet." };
  }

  try {
    await db.pet.delete({
      where: {
        id,
      },
    });

    const action = `Deleted pet at ${new Date().toISOString()}`;

    await db.logs.create({
      data: {
        action,
        adminId: user.id,
      },
    });

    return { success: "Pet deleted successfully" };
  } catch (error: any) {
    return {
      error: `Failed to delete pet. Please try again. ${error.message || ""}`,
    };
  }
};
