/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
"use server";

import db from "@/lib/db";
import { z } from "zod";
import { VehicleValidation } from "@/validators/vehicle";
import { useUser } from "@/hooks/use-user";

export const createVehicle = async (
  values: z.infer<typeof VehicleValidation>
) => {
  const { user } = await useUser();
  if (!user) {
    return { error: "You must be logged in to register a vehicle." };
  }

  const validatedField = VehicleValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { residentId, type, model, color, brand, plateNumber } =
    validatedField.data;

  try {
    await db.vehicle.create({
      data: {
        type,
        ownerId: residentId,
        model,
        color,
        brand,
        plateNumber,
      },
    });

    const action = `Created Vehicle ${model} (${type}) at ${new Date().toISOString()}`;

    await db.logs.create({
      data: {
        action,
        adminId: user.id,
      },
    });

    return { success: "Vehicle registered successfully" };
  } catch (error: any) {
    return {
      error: `Failed to register vehicle. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updateVehicle = async (
  id: string,
  values: z.infer<typeof VehicleValidation>
) => {
  const { user } = await useUser();
  if (!user) {
    return { error: "You must be logged in to update a vehicle." };
  }

  const validatedField = VehicleValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { residentId, type, model, color, brand, plateNumber } =
    validatedField.data;

  try {
    await db.vehicle.update({
      data: {
        type,
        ownerId: residentId,
        model,
        color,
        brand,
        plateNumber,
      },
      where: {
        id,
      },
    });

    const action = `Updated Vehicle ${model} (${type}) at ${new Date().toISOString()}`;

    await db.logs.create({
      data: {
        action,
        adminId: user.id,
      },
    });

    return { success: "Vehicle updated successfully" };
  } catch (error: any) {
    return {
      error: `Failed to update vehicle. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deleteVehicle = async (id: string) => {
  const { user } = await useUser();
  if (!user) {
    return { error: "You must be logged in to delete a vehicle." };
  }

  try {
    await db.vehicle.delete({
      where: {
        id,
      },
    });

    const action = `Deleted vehicle at ${new Date().toISOString()}`;

    await db.logs.create({
      data: {
        action,
        adminId: user.id,
      },
    });

    return { success: "Vehicle deleted successfully" };
  } catch (error: any) {
    return {
      error: `Failed to delete vehicle. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
