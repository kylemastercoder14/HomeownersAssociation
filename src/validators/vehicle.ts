import { z } from "zod";

export const VehicleValidation = z.object({
  model: z.string().min(1, { message: "Vehicle model is required" }),
  type: z.string().min(1, { message: "Vehicle type is required" }),
  brand: z.string().min(1, { message: "Vehicle brand is required" }),
  plateNumber: z.string().min(1, { message: "Plate number is required" }),
  color: z.string().min(1, { message: "Color is required" }),
  residentId: z.string().min(1, { message: "Owner is required" }),
});
