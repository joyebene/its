import { connectDB } from "@/lib/db";
import { auth } from "@/middleware/auth";
import { authorize } from "@/middleware/authorize";
import { UserRole } from "@/models/User";
import { createOrganizationSchema } from "@/schema/organization.schema";
import { OrganizationService } from "@/services/organization.service";
import { error, success } from "@/utils/api-response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {

    await connectDB();

    const user = await auth(req);

    // Check if the user already has an organization
    if (user.organization) {
        return error(
            "You already own an organization.",
            400
        );
    }

    const body = await req.json();

    const validated =
        createOrganizationSchema.safeParse(body);

    if (!validated.success) {
        return error(
            "Validation failed",
            400,
            validated.error.flatten()
        );
    }

    const organization =
        await OrganizationService.create(
            validated.data, user
        );

    return success(
        organization,
        "Organization created.",
        201
    );
}

//get orgs
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const user = await auth(req);

        authorize(user, [UserRole.SUPER_ADMIN]);

        const organizations =
            await OrganizationService.findAll();

        return success(
            organizations,
            "Organizations retrieved successfully."
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