/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
"use server";

import db from "@/lib/db";
import { z } from "zod";
import { BusinessValidation } from "@/validators/business";
import { useUser } from "@/hooks/use-user";

export const createBusiness = async (
  values: z.infer<typeof BusinessValidation>
) => {
  const { user } = await useUser();
  if (!user) {
    return { error: "You must be logged in to register a business." };
  }

  const validatedField = BusinessValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    name,
    address,
    area,
    occupancy,
    operationType,
    residentId,
    scale,
    sector,
    type,
  } = validatedField.data;

  try {
    await db.business.create({
      data: {
        name,
        address,
        area,
        occupancy,
        sector,
        type,
        operationType,
        scale,
        ownerId: residentId,
      },
    });

    const action = `Created Business ${name} at ${new Date().toISOString()}`;

    await db.logs.create({
      data: {
        action,
        adminId: user.id,
      },
    });

    return { success: "Business registered successfully" };
  } catch (error: any) {
    return {
      error: `Failed to register business. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updateBusiness = async (
  id: string,
  values: z.infer<typeof BusinessValidation>
) => {
  const { user } = await useUser();
  if (!user) {
    return { error: "You must be logged in to update a business." };
  }

  const validatedField = BusinessValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    name,
    address,
    area,
    occupancy,
    operationType,
    residentId,
    scale,
    sector,
    type,
  } = validatedField.data;

  try {
    await db.business.update({
      data: {
        name,
        address,
        area,
        occupancy,
        sector,
        type,
        operationType,
        scale,
        ownerId: residentId,
      },
      where: {
        id,
      },
    });

    const action = `Updated Resident ${name} at ${new Date().toISOString()}`;

    await db.logs.create({
      data: {
        action,
        adminId: user.id,
      },
    });

    return { success: "Business updated successfully" };
  } catch (error: any) {
    return {
      error: `Failed to update business. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deleteBusiness = async (id: string) => {
  const { user } = await useUser();
  if (!user) {
    return { error: "You must be logged in to delete a business." };
  }

  try {
    await db.business.delete({
      where: {
        id,
      },
    });

    const action = `Deleted business at ${new Date().toISOString()}`;

    await db.logs.create({
      data: {
        action,
        adminId: user.id,
      },
    });

    return { success: "Business deleted successfully" };
  } catch (error: any) {
    return {
      error: `Failed to delete business. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
