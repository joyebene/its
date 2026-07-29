import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { auth } from "@/middleware/auth";
import { success, error } from "@/utils/api-response";
import { ProductService } from "@/services/product.service";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    await auth(req);

    const stats = await ProductService.getStats();

    return success(stats);
  } catch (err: any) {
    console.error(err);

    return error(
      err.message || "Failed to fetch product statistics",
      err.statusCode || 500
    );
  }
}