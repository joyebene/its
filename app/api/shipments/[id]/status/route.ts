import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";

import {
  updateShipmentStatusSchema,
} from "@/schema/shipment.schema";

import { ShipmentService } from "@/services/shipment.service";

import {
  success,
  error,
} from "@/utils/api-response";

interface Props {
  params: Promise<{
    id: string;
  }>;
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
      updateShipmentStatusSchema.safeParse(
        body
      );

    if (!validated.success) {
      return error(
        "Validation failed",
        400,
        validated.error.flatten()
      );
    }

    const shipment =
      await ShipmentService.updateStatus(
        id,
        user,
        validated.data
      );

    return success(
      shipment,
      "Shipment status updated."
    );
  } catch (err: any) {
    return error(err.message, 400);
  }
}