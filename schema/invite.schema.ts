import { z } from "zod";
import { UserRole } from "@/models/User";

export const inviteSchema = z.object({
  email: z.email(),

  role: z.enum([
    UserRole.WAREHOUSE,
    UserRole.LOGISTICS,
    UserRole.CUSTOMS,
    UserRole.DELIVERY,
  ]),
});

export type InviteInput = z.infer<typeof inviteSchema>;