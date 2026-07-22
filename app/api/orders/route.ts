import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { auth } from "@/middleware/auth";

import { OrderService } from "@/services/order.service";

import {
  createOrderSchema,
} from "@/schema/order.schema";

import {
  success,
  error,
} from "@/utils/api-response";

export async function POST(
  req: NextRequest
) {
  try {
    await connectDB();

    const user = await auth(req);

    const body = await req.json();

    const validated =
      createOrderSchema.safeParse(body);

    if (!validated.success) {
      return error(
        "Validation failed",
        400,
        validated.error.flatten()
      );
    }

    const order =
      await OrderService.create(
        user,
        validated.data
      );

    return success(
      order,
      "Order created successfully.",
      201
    );

  } catch (err: any) {

    return error(
      err.message,
      400
    );

  }
}

export async function GET(
  req: NextRequest
) {

  try {

    await connectDB();

    const user = await auth(req);

    const orders =
      await OrderService.findAll(user);

    return success(orders);

  } catch (err: any) {

    return error(
      err.message,
      400
    );

  }

}