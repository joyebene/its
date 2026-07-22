import { z } from "zod";
import { UserRole, UserStatus } from "@/models/User";

export const inviteMemberSchema = z.object({
  email: z.email("Invalid email address"),

  role: z.enum([
    UserRole.WAREHOUSE,
    UserRole.LOGISTICS,
    UserRole.CUSTOMS,
    UserRole.DELIVERY,
  ]),
});


export const updateMemberSchema =
    z.object({

        role: z
            .nativeEnum(UserRole)
            .optional(),

        status: z
            .nativeEnum(UserStatus)
            .optional(),

    });

export type UpdateMemberInput =
    z.infer<typeof updateMemberSchema>;

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;