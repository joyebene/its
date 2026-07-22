import { z } from "zod";


export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  ORG_ADMIN = "ORG_ADMIN",
  WAREHOUSE = "WAREHOUSE",
  LOGISTICS = "LOGISTICS",
  CUSTOMS = "CUSTOMS",
  DELIVERY = "DELIVERY",
}


const baseSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  phone: z.string().optional(),

  role: z
    .nativeEnum(UserRole)
    .default(UserRole.USER),
});

// Normal Registration
export const registerSchema = baseSchema.extend({
  email: z.email("Invalid email address"),
});

// Invitation Registration
export const invitationRegisterSchema = baseSchema.extend({
  token: z.string().min(1, "Invitation token is required"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type RegisterInput = z.infer<typeof registerSchema>;
export type InvitationRegisterInput = z.infer<typeof invitationRegisterSchema>;