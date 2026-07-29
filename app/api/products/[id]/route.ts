import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { auth } from "@/middleware/auth";

import { success, error } from "@/utils/api-response";

import { ProductService } from "@/services/product.service";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// ======================
// GET PRODUCT DETAILS
// ======================
export async function GET(
  req: NextRequest,
  { params }: Params
) {
  try {
    await connectDB();

    await auth(req);

    const { id } = await params;

    const product = await ProductService.findById(id);

    return success(product);
  } catch (err: any) {
    console.error(err);

    return error(err.message || "Failed to fetch product");
  }
}

// ======================
// UPDATE PRODUCT
// ======================
export async function PUT(
  req: NextRequest,
  { params }: Params
) {
  try {
    await connectDB();

    const user = await auth(req);

    const { id } = await params;

    const body = await req.json();

    const product = await ProductService.update(
      id,
      user,
      body
    );

    return success(product);
  } catch (err: any) {
    console.error(err);

    return error(err.message || "Failed to update product");
  }
}

// ======================
// DELETE PRODUCT
// ======================
export async function DELETE(
  req: NextRequest,
  { params }: Params
) {
  try {
    await connectDB();

    const user = await auth(req);

    const { id } = await params;

    await ProductService.delete(id, user);

    return success(null, "Product deleted successfully");
  } catch (err: any) {
    console.error(err);

    return error(err.message || "Failed to delete product");
  }
}