import { z } from "zod";

export const PetValidation = z.object({
  name: z.string().min(1, { message: "Pet name is required" }),
  type: z.string().min(1, { message: "Pet type is required" }),
  breed: z.string().min(1, { message: "Pet breed is required" }),
  color: z.string().min(1, { message: "Pet color is required" }),
  age: z.coerce.number().min(1, { message: "Pet age is required" }),
  residentId: z.string().min(1, { message: "Owner is required" }),
});
