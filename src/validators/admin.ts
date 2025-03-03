import { z } from "zod";

export const AdminValidation = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email address is required",
    })
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});
