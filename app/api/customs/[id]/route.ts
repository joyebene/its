import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { auth } from "@/middleware/auth";

import {
  updateCustomsSchema,
} from "@/schema/customs.schema";

import { CustomsService } from "@/services/customs.service";

import {
  success,
  error,
} from "@/utils/api-response";

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

    await auth(req);

    const { id } = await params;

    const customs =
      await CustomsService.findById(id);

    return success(customs);
  } catch (err: any) {
    return error(err.message, 404);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: Props
) {
  try {
    await connectDB();

    const user = await auth(req);

    const { id } = await params;

    const body = await req.json();

    const validated =
      updateCustomsSchema.safeParse(body);

    if (!validated.success) {
      return error(
        "Validation failed",
        400,
        validated.error.flatten()
      );
    }

    const customs =
      await CustomsService.update(
        id,
        user,
        validated.data
      );

    return success(
      customs,
      "Customs record updated."
    );
  } catch (err: any) {
    return error(err.message, 400);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: Props
) {
  try {
    await connectDB();

    await auth(req);

    const { id } = await params;

    await CustomsService.delete(id);

    return success(
      null,
      "Customs record deleted."
    );
  } catch (err: any) {
    return error(err.message, 400);
  }
}