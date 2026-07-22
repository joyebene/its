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
  } catch (err) {
    console.error(err);

    return error("Internal Server Error", 500);
  }
}