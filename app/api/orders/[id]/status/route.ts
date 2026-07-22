import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";

import { authorize } from "@/middleware/authorize";

import {
  UserRole,
} from "@/models/User";

import {
  updateOrderStatusSchema,
} from "@/schema/order.schema";

import {
  OrderService,
} from "@/services/order.service";

import {
  success,
  error,
} from "@/utils/api-response";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  req: NextRequest,
  { params }: Params
) {

  try {

    await connectDB();

    const user =
      await auth(req);

    authorize(user, [
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.ORG_ADMIN,
    ]);

    const body =
      await req.json();

    const validated =
      updateOrderStatusSchema.safeParse(
        body
      );

    if (!validated.success) {

      return error(
        "Validation failed",
        400,
        validated.error.flatten()
      );

    }

    const { id } =
      await params;

    const order =
      await OrderService.updateStatus(
        id,
        validated.data.status
      );

    return success(
      order,
      "Status updated."
    );

  } catch (err: any) {

    return error(
      err.message,
      400
    );

  }

}