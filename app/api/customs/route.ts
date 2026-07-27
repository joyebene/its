import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { auth } from "@/middleware/auth";

import {
  createCustomsSchema,
} from "@/schema/customs.schema";

import { CustomsService } from "@/services/customs.service";

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
      createCustomsSchema.safeParse(body);

    if (!validated.success) {
      return error(
        "Validation failed",
        400,
        validated.error.flatten()
      );
    }

    const customs =
      await CustomsService.create(
        user,
        validated.data
      );

    return success(
      customs,
      "Customs record created successfully.",
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

    const customs =
      await CustomsService.findAll();

    return success(customs);
  } catch (err: any) {
    return error(err.message, 400);
  }
}