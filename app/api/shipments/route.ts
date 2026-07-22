import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";

import {
  createShipmentSchema,
} from "@/schema/shipment.schema";

import { ShipmentService } from "@/services/shipment.service";

import {
  error,
  success,
} from "@/utils/api-response";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = await auth(req);

    const body = await req.json();

    const validated =
      createShipmentSchema.safeParse(body);

    if (!validated.success) {
      return error(
        "Validation failed",
        400,
        validated.error.flatten()
      );
    }

    const shipment =
      await ShipmentService.create(
        user,
        validated.data
      );

    return success(
      shipment,
      "Shipment created successfully.",
      201
    );
  } catch (err: any) {
    return error(err.message, 400);
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await auth(req);

    const shipments =
      await ShipmentService.findAll(user);

    return success(shipments);
  } catch (err: any) {
    return error(err.message, 400);
  }
}