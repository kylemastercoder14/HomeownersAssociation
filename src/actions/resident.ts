/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
"use server";

import db from "@/lib/db";
import { z } from "zod";
import { ResidentValidation } from "@/validators/resident";
import { useUser } from "@/hooks/use-user";
import { getResidentByEmail } from "@/data/resident";

export const createResident = async (
  values: z.infer<typeof ResidentValidation>
) => {
  const { user } = await useUser();
  if (!user) {
    return { error: "You must be logged in to create a resident." };
  }

  const validatedField = ResidentValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    firstName,
    middleName,
    lastName,
    extensionName,
    age,
    gender,
    birthDate,
    occupation,
    email,
    phoneNumber,
    civilStatus,
  } = validatedField.data;

  try {
    const existingResident = await getResidentByEmail(email);

    if (existingResident) {
      return { error: "Resident with the same email already exists." };
    }

    await db.residents.create({
      data: {
        firstName,
        middleName,
        lastName,
        extensionName,
        age,
        gender,
        civilStatus,
        email,
        phoneNumber,
        occupation,
        birthDate,
      },
    });

    const action = `Created Resident ${firstName} ${middleName} ${lastName} ${extensionName} at ${new Date().toISOString()}`;

    await db.logs.create({
      data: {
        action,
        adminId: user.id,
      },
    });

    return { success: "Resident created successfully" };
  } catch (error: any) {
    return {
      error: `Failed to create resident. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updateResident = async (
  id: string,
  values: z.infer<typeof ResidentValidation>
) => {
  const { user } = await useUser();
  if (!user) {
    return { error: "You must be logged in to update a resident." };
  }

  const validatedField = ResidentValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    firstName,
    middleName,
    lastName,
    extensionName,
    age,
    gender,
    birthDate,
    occupation,
    email,
    phoneNumber,
    civilStatus,
  } = validatedField.data;

  try {
    await db.residents.update({
      data: {
        firstName,
        middleName,
        lastName,
        extensionName,
        age,
        gender,
        civilStatus,
        email,
        phoneNumber,
        occupation,
        birthDate,
      },
      where: {
        id,
      },
    });

    const action = `Updated Resident ${firstName} ${middleName} ${lastName} ${extensionName} at ${new Date().toISOString()}`;

    await db.logs.create({
      data: {
        action,
        adminId: user.id,
      },
    });

    return { success: "Resident updated successfully" };
  } catch (error: any) {
    return {
      error: `Failed to update resident. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deleteResident = async (id: string) => {
  const { user } = await useUser();
  if (!user) {
    return { error: "You must be logged in to delete a resident." };
  }

  try {
    await db.residents.delete({
      where: {
        id,
      },
    });

    const action = `Deleted resident at ${new Date().toISOString()}`;

    await db.logs.create({
      data: {
        action,
        adminId: user.id,
      },
    });

    return { success: "Resident deleted successfully" };
  } catch (error: any) {
    return {
      error: `Failed to delete resident. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
