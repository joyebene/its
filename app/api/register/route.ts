import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { registerSchema } from "@/schema/auth.schema";

import { error } from "@/utils/api-response";

import { AuthService } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      return error(
        "Validation failed",
        400,
        validated.error.flatten()
      );
    }

    return await AuthService.register(validated.data);
  } catch (err: any) {
    console.error("REGISTER ERROR");
    console.error(err);
    console.error(err?.stack);

    return Response.json(
      {
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      { status: 500 }
    );
  }
}