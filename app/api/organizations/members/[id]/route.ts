import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";
import { authorize } from "@/middleware/authorize";

import { UserRole } from "@/models/User";

import {
    updateMemberSchema,
} from "@/schema/member.schema";

import { MemberService } from "@/services/member.service";

import {
    success,
    error,
} from "@/utils/api-response";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export async function PATCH(
    req: NextRequest,
    { params }: Props
) {
    try {

        await connectDB();

        const currentUser =
            await auth(req);

        authorize(
            currentUser,
            [UserRole.ORG_ADMIN]
        );

        const { id } =
            await params;

        const body =
            await req.json();

        const validated =
            updateMemberSchema.safeParse(body);

        if (!validated.success) {
            return error(
                "Validation failed",
                400,
                validated.error.flatten()
            );
        }

        const member =
            await MemberService.updateMember(
                currentUser,
                id,
                validated.data
            );

        return success(
            member,
            "Member updated successfully."
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