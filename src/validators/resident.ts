import { z } from "zod";

export const ResidentValidation = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  middleName: z.string().optional(),
  extensionName: z.string().optional(),
  gender: z.string().min(1, { message: "Gender is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  email: z.string().min(1, { message: "Email address is required" }),
  age: z.coerce.number().min(1, { message: "Age is required" }),
  birthDate: z.string().min(1, { message: "Birthdate is required" }),
  civilStatus: z.string().min(1, { message: "Civil status is required" }),
  occupation: z.string().min(1, { message: "Occupation is required" }),
});
