import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";

import {
  ShipmentService,
} from "@/services/shipment.service";

import {
  updateShipmentSchema,
} from "@/schema/shipment.schema";

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

    const { id } = await params;

    const shipment =
      await ShipmentService.findById(
        id
      );

    return success(shipment);
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
      updateShipmentSchema.safeParse(body);

    if (!validated.success) {
      return error(
        "Validation failed",
        400,
        validated.error.flatten()
      );
    }

    const shipment =
      await ShipmentService.update(
        id,
        user,
        validated.data
      );

    return success(
      shipment,
      "Shipment updated."
    );
  } catch (err: any) {
    console.log(err);
    
    return error(err.message, 400);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: Props
) {
  try {
    await connectDB();


    const { id } = await params;

    await ShipmentService.delete(
      id,
    );

    return success(
      null,
      "Shipment deleted."
    );
  } catch (err: any) {
    return error(err.message, 400);
  }
}