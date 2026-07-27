import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { auth } from "@/middleware/auth";

import {
  updateContainerSchema,
} from "@/schema/container.schema";

import {
  success,
  error,
} from "@/utils/api-response";
import { ContainerService } from "@/services/container.service";

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

    const container =
      await ContainerService.findById(id);

    return success(container);

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

    await auth(req);

    const { id } = await params;

    const body = await req.json();

    const validated =
      updateContainerSchema.safeParse(body);

    if (!validated.success) {
      return error(
        "Validation failed",
        400,
        validated.error.flatten()
      );
    }

    const container =
      await ContainerService.update(
        id,
        validated.data
      );

    return success(
      container,
      "Container updated."
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

    await ContainerService.delete(id);

    return success(
      null,
      "Container deleted."
    );

  } catch (err: any) {
    return error(err.message, 400);
  }
}