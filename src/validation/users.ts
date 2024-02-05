import { z } from "zod";

export const UserValidationSchema = z.object({
  userId: z.string().optional(),
  username: z
    .string()
    .min(1, "Username is required and minimum length 1")
    .max(30),
  password: z.string().min(6),
  fullName: z.object({
    firstName: z
      .string()
      .min(1, "First Name is required and min length 1")
      .max(30),
    lastName: z.string().max(30).optional(),
  }),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      country: z.string(),
    })
    .optional(),
  age: z.number(),
  email: z.string().email(),
  isActive: z.boolean().optional(),
  hobbies: z.array(z.string().max(30)).optional(),
});

export type UserValidationProperties = z.infer<typeof UserValidationSchema>;

export const UpdateUserValidationSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  fullName: z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
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
