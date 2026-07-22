import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";
import { authorize } from "@/middleware/authorize";

import { UserRole } from "@/models/User";

import { inviteSchema } from "@/schema/invite.schema";

import { MemberService } from "@/services/member.service";

import { error, success } from "@/utils/api-response";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const user = await auth(req);

        authorize(user, [
            UserRole.ORG_ADMIN,
        ]);

        const body = await req.json();

        const validated = inviteSchema.safeParse(body);

        if (!validated.success) {
            return error(
                "Validation failed",
                400,
                validated.error.flatten()
            );
        }

        const invitation =
            await MemberService.invite(
                user,
                validated.data
            );

        /**
         * TODO:
         * Send email here
         */

        return success(
            invitation,
            "Invitation sent successfully.",
            201
        );

    } catch (err) {
        return error(
            err instanceof Error
                ? err.message
                : "Internal Server Error",
            500
        );
    }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await auth(req);

    authorize(user, [UserRole.ORG_ADMIN]);

    const members = await MemberService.getMembers(user);

    return success(
      members,
      "Members retrieved successfully."
    );
  } catch (err) {
    console.error(err);

    return error(
      err instanceof Error
        ? err.message
        : "Internal Server Error",
      500
    );
  }
}