import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";
import { authorize } from "@/middleware/authorize";

import { UserRole } from "@/models/User";

import { OrganizationService } from "@/services/organization.service";

import { success, error } from "@/utils/api-response";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    req: NextRequest,
    { params }: Props
) {
    try {
        await connectDB();

        const user = await auth(req);

        authorize(user, [
            UserRole.SUPER_ADMIN,
            UserRole.ORG_ADMIN,
        ]);

        const { id } = await params;

        const organization =
            await OrganizationService.findById(id);

        return success(
            organization,
            "Organization retrieved successfully."
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