import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";
import { authorize } from "@/middleware/authorize";

import {
  ProductStatus,
} from "@/models/Product";

import { UserRole } from "@/models/User";

import { ProductService } from "@/services/product.service";

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

    authorize(user, [
      UserRole.ORG_ADMIN,
      UserRole.WAREHOUSE,
    ]);

    const body = await req.json();

    const { status } = body;

    if (
      !Object.values(ProductStatus).includes(
        status
      )
    ) {
      return error(
        "Invalid status.",
        400
      );
    }

    const { id } = await params;

    const product =
      await ProductService.changeStatus(
        id,
        user,
        status
      );

    return success(
      product,
      "Product status updated."
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