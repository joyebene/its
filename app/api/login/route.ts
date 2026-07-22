import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { loginSchema } from "@/schema/auth.schema";

import { success, error } from "@/utils/api-response";

import { AuthService } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      return error(
        "Validation failed",
        400,
        validated.error.flatten()
      );
    }

    const result = await AuthService.login(validated.data);

    const response = success(
      {
        accessToken: result.accessToken,
        user: {
          id: result.user._id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          role: result.user.role,
          accountType: result.user.accountType,
        },
      },
      "Login successful"
    );

    response.cookies.set({
      name: "refreshToken",
      value: result.refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    return error(
      err instanceof Error ? err.message : "Login failed",
      401
    );
  }
}