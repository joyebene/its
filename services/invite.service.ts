import crypto from "crypto";

import Invitation from "@/models/Invitation";
import { IUser } from "@/models/User";
import { InviteInput } from "@/schema/invite.schema";

export class MemberService {
  static async invite(owner: IUser, data: InviteInput) {

    const existing = await Invitation.findOne({
      email: data.email.toLowerCase(),
      accepted: false,
    });

    if (existing) {
      throw new Error("An active invitation already exists.");
    }

    const token = crypto.randomUUID();

    const invitation = await Invitation.create({
      email: data.email.toLowerCase(),
      organization: owner.organization,
      invitedBy: owner._id,
      role: data.role,
      token,
      expiresAt: new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 7
      ),
    });

    return invitation;
  }
}