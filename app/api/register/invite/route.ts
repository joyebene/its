import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import {
  invitationRegisterSchema,
} from "@/schema/auth.schema";

import { AuthService } from "@/services/auth.service";

import { error } from "@/utils/api-response";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const validated =
      invitationRegisterSchema.safeParse(body);

    if (!validated.success) {
      return error(
        "Validation failed",
        400,
        validated.error.flatten()
      );
    }

    return await AuthService.registerByInvitation(
      validated.data
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