// user-schema.ts
import { z } from "zod";

export const userSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter email")
    .email("Invalid Email"),
  password: z
    .string()
    .min(1, "Please enter password")
    .min(8, "Password is too short")
    .max(15, "Password is too large")
    .regex(/[A-Z]/, "Password Must Contain one Capital Letter")
    .regex(/[a-z]/, "Password Must Contain one small Letter")
    .regex(/[@-_]/, "Password Must Contain one special Letter"),
  confirmPassword: z.string(),
}).refine(
  (schemaObject) => schemaObject.password === schemaObject.confirmPassword,
  { message: "Password and Confirm Password must be the same", path: ["confirmPassword"] }
);

export type UserSchema = z.infer<typeof userSchema>;
