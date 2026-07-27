import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { auth } from "@/middleware/auth";

import { UserService } from "@/services/user.service";

import {
  success,
  error,
} from "@/utils/api-response";

export async function GET(
  req: NextRequest
) {
  try {
    await connectDB();

    await auth(req);

    const users =
      await UserService.findAll();

    return success(users);
  } catch (err: any) {
    return error(err.message, 400);
  }
}

import { createUserSchema } from "@/schema/user.schema";


export async function POST(
  req: NextRequest
) {
  try {
    await connectDB();

    const currentUser = await auth(req);

    if (
      currentUser.role !== "ADMIN" &&
      currentUser.role !== "SUPER_ADMIN"
    ) {
      return error("Unauthorized", 403);
    }

    const body = await req.json();

    const validated =
      createUserSchema.safeParse(body);

    if (!validated.success) {
      return error(
        "Validation failed",
        400,
        validated.error.flatten()
      );
    }

    const user =
      await UserService.create(
        validated.data
      );

    return success(
      user,
      "User created successfully.",
      201
    );
  } catch (err: any) {
    return error(err.message, 400);
  }
}