import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";

import { OrderService } from "@/services/order.service";

import {
  success,
  error,
} from "@/utils/api-response";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params }: Params
) {

  try {

    await connectDB();

    const user = await auth(req);

    const { id } = await params;

    const order =
      await OrderService.findById(
        id,
        user
      );

    return success(order);

  } catch (err: any) {

    return error(
      err.message,
      400
    );

  }

}

export async function DELETE(
  req: NextRequest,
  { params }: Params
) {

  try {

    await connectDB();

    await auth(req);

    const { id } = await params;

    const order =
      await OrderService.cancel(id);

    return success(
      order,
      "Order cancelled."
    );

  } catch (err: any) {

    return error(
      err.message,
      400
    );

  }

}