import { connectDB } from "@/lib/db";
import { auth } from "@/middleware/auth";
import { IUser } from "@/models/User";
import { trackingUpdateSchema } from "@/schema/product.schema";
import { ProductService } from "@/services/product.service";
import { error, success } from "@/utils/api-response";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const user = await auth(req) as IUser;

  if (!user) {
    return error("Unauthorized", 401);
  }

  const body = await req.json();

  const validated = trackingUpdateSchema.safeParse(body);

  if (!validated.success) {
    console.log(validated.error.flatten());

    return error("Validation failed", 400);
  }

  const { id } = await params;

  try {
    const result = await ProductService.addTrackingUpdate(
      id,
      user,
      validated.data
    );

    return success(result);
  } catch (err: any) {
    return error(err.message, 400);
  }

}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = (await auth(req)) as IUser;

    if (!user) {
      return error("Unauthorized", 401);
    }

    const { id } = await params;

    const tracking = await ProductService.getTrackingHistory(id);

    return success(tracking);
  } catch (err: any) {
    console.error(err);

    return error(err.message || "Failed to fetch tracking history", 500);
  }
}