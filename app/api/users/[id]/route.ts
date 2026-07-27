import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";

import { UserService } from "@/services/user.service";

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

    const user =
      await UserService.findById(id);

    return success(user);
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

    const user =
      await UserService.update(
        id,
        body
      );

    return success(
      user,
      "User updated."
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

    await UserService.delete(id);

    return success(
      null,
      "User deleted."
    );
  } catch (err: any) {
    return error(err.message, 400);
  }
}