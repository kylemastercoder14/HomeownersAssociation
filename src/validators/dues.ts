import { DueStatus, DueType } from "@prisma/client";
import { z } from "zod";

export const DueFormSchema = z.object({
  householdId: z.string().min(1, "Household is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  dueDate: z.date(),
  fiscalMonth: z.number().min(1).max(12),
  fiscalYear: z.number().min(2000).max(2100),
  description: z.string().optional(),
  status: z.nativeEnum(DueStatus),
  lateFee: z.number().min(0).default(0),
  type: z.nativeEnum(DueType),
  meterReading: z.number().optional(),
  previousReading: z.number().optional(),
});

export type DueFormValues = z.infer<typeof DueFormSchema>;
