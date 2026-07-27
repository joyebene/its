import { z } from "zod";
import {
  UserRole,
  UserStatus,
  AccountType,
} from "@/models/User";

export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name is required"),

  lastName: z
    .string()
    .min(2, "Last name is required"),

  email: z
    .string()
    .email("Invalid email address"),

  phone: z.string().optional(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  accountType: z.nativeEnum(AccountType),

  role: z.nativeEnum(UserRole),

  status: z
    .nativeEnum(UserStatus)
    .optional(),

  avatar: z.string().optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),

  lastName: z.string().min(2).optional(),

  email: z
    .string()
    .email()
    .optional(),

  phone: z.string().optional(),

  accountType: z
    .nativeEnum(AccountType)
    .optional(),

  role: z
    .nativeEnum(UserRole)
    .optional(),

  status: z
    .nativeEnum(UserStatus)
    .optional(),

  avatar: z.string().optional(),
});

export type CreateUserInput = z.infer<
  typeof createUserSchema
>;

export type UpdateUserInput = z.infer<
  typeof updateUserSchema
>;