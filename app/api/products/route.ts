import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";
import { authorize } from "@/middleware/authorize";

import { UserRole } from "@/models/User";

import {
  createProductSchema,
} from "@/schema/product.schema";

import { ProductService } from "@/services/product.service";

import {
  error,
  success,
} from "@/utils/api-response";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = await auth(req);

    authorize(user, [
      UserRole.ORG_ADMIN,
      UserRole.WAREHOUSE,
    ]);

    const body = await req.json();

    const validated =
      createProductSchema.safeParse(body);

    if (!validated.success) {
      return error(
        "Validation failed",
        400,
        validated.error.flatten()
      );
    }

    const product =
      await ProductService.create(
        user,
        validated.data
      );

    return success(
      product,
      "Product created.",
      201
    );
  } catch (err) {
    return error(
      err instanceof Error
        ? err.message
        : "Internal Server Error",
      500
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await auth(req);

    const products =
      await ProductService.findMine(user);

    return success(products);
  } catch (err) {
    return error(
      err instanceof Error
        ? err.message
        : "Internal Server Error",
      500
    );
  }
}