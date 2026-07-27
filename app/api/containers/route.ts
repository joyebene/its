import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { auth } from "@/middleware/auth";

import {
  createContainerSchema,
} from "@/schema/container.schema";

import { ContainerService } from "@/services/container.service";

import {
  success,
  error,
} from "@/utils/api-response";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = await auth(req);

    const body = await req.json();

    const validated =
      createContainerSchema.safeParse(body);

    if (!validated.success) {
      return error(
        "Validation failed",
        400,
        validated.error.flatten()
      );
    }

    const container =
      await ContainerService.create(
        user,
        validated.data
      );

    return success(
      container,
      "Container created successfully.",
      201
    );

  } catch (err: any) {
    return error(err.message, 400);
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    await auth(req);

    const containers =
      await ContainerService.findAll();

    return success(containers);

  } catch (err: any) {
    return error(err.message, 400);
  }
}