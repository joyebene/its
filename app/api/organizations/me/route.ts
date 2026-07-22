import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";

import { OrganizationService } from "@/services/organization.service";

import { success, error } from "@/utils/api-response";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await auth(req);

    const organization =
      await OrganizationService.findMine(user);

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