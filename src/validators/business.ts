import { z } from "zod";

export const BusinessValidation = z.object({
  name: z.string().min(1, { message: "Business name is required" }),
  scale: z.string().min(1, { message: "Business scale is required" }),
  address: z.string().min(1, { message: "Business address is required" }),
  type: z.string().min(1, { message: "Business type is required" }),
  sector: z.string().min(1, { message: "Business sector is required" }),
  operationType: z
    .string()
    .min(1, { message: "Business operation is required" }),
  occupancy: z.string().min(1, { message: "Business occupancy is required" }),
  area: z.string().min(1, { message: "Business area is required" }),
  residentId: z.string().min(1, { message: "Owner is required" }),
});
