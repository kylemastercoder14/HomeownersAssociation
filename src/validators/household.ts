import { z } from "zod";

export const HouseHoldSchema = z.object({
  block: z.string().min(1, "Block is required"),
  lot: z.string().min(1, "Lot is required"),
  type: z.string().min(1, "Type is required"),
  status: z.enum(["Active", "Inactive", "Vacant"]),
  address: z.string().min(5, "Address must be at least 5 characters long"),
  seniorCitizenCount: z.coerce.number().int().min(0),
  pwdCount: z.coerce.number().int().min(0),
  soloParentCount: z.coerce.number().int().min(0),
  headId: z.string().min(1, "Head Resident is required"),
  residentIds: z.array(z.string()).min(1, "Select at least one resident"),
});

export type HouseholdFormValues = z.infer<typeof HouseHoldSchema>;
