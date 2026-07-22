import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Organization name is required"),

  email: z
    .email()
    .optional(),

  phone: z
    .string()
    .optional(),

  website: z
    .string()
    .url()
    .optional(),

  address: z
    .string()
    .optional(),

  country: z
    .string()
    .optional(),
});

export type CreateOrganizationInput =
  z.infer<typeof createOrganizationSchema>;