import { z } from "zod";

export const OrderValidationSchema = z.object({
  productName: z
    .string({ required_error: "Product name is required" })
    .min(1, "Product name minimum length is 1"),
  price: z.number({ required_error: "Price is required" }),
  quantity: z.number({ required_error: "Quantity is required" }),
});

export type OrderValidationProperties = z.infer<typeof OrderValidationSchema>;
