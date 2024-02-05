import { z } from "zod";

export const UserValidationSchema = z.object({
  userId: z.string().optional(),
  username: z
    .string({ required_error: "Username is required" })
    .min(1, "Username minimum length 1")
    .max(30, "Username is too long"),
  password: z.string({ required_error: "Password is required" }).min(6),
  fullName: z.object({
    firstName: z
      .string({ required_error: "First name is required" })
      .min(1, "First Name min length 1")
      .max(30, "First name is to long"),
    lastName: z.string().max(30, "Last name is too long").optional(),
  }),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      country: z.string(),
    })
    .optional(),
  age: z.number(),
  email: z
    .string({ required_error: "Email is required" })
    .email("Provide a valid email"),
  isActive: z.boolean().optional(),
  hobbies: z.array(z.string().max(30)).optional(),
});

export type UserValidationProperties = z.infer<typeof UserValidationSchema>;

export const UpdateUserValidationSchema = z.object({
  username: z.string().max(30, "Username is too long").optional(),
  password: z.string().optional(),
  fullName: z
    .object({
      firstName: z.string().max(30, "First name is to long").optional(),
      lastName: z.string().max(30, "Last name is to long").optional(),
    })
    .optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  age: z.number().optional(),
  email: z.string().email().optional(),
  isActive: z.boolean().optional(),
  hobbies: z.array(z.string().max(30)).optional(),
});

export type UpdateUserValidationProperties = z.infer<
  typeof UpdateUserValidationSchema
>;
