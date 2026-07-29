import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { success, error } from "@/utils/api-response";
import { ProductService } from "@/services/product.service";
import { IUser } from "@/models/User";
import { auth } from "@/middleware/auth";


export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = await auth(req) as IUser;

    if (!user) {
      return error("Unauthorized", 401);
    }

    const { id } = await params;

    const result = await ProductService.simulateTracking(
      id,
      user
    );

    return success(
      result,
      "Tracking simulation completed successfully."
    );
  } catch (err: any) {
    console.error(err);

    return error(
      err.message || "Internal Server Error",
      500
    );
  }
}