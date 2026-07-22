import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";
import { authorize } from "@/middleware/authorize";

import { UserRole } from "@/models/User";

import {
    updateProductSchema,
} from "@/schema/product.schema";

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

export async function GET(
    req: NextRequest,
    { params }: Props
) {
    try {
        await connectDB();

        const user = await auth(req);

        const { id } = await params;

        const product =
            await ProductService.findById(
                id,
                user
            );

        return success(product);
    } catch (err) {
        return error(
            err instanceof Error
                ? err.message
                : "Internal Server Error",
            500
        );
    }
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

        const validated =
            updateProductSchema.safeParse(body);

        if (!validated.success) {
            return error(
                "Validation failed",
                400,
                validated.error.flatten()
            );
        }

        const { id } = await params;

        const product =
            await ProductService.update(
                id,
                user,
                validated.data
            );

        return success(
            product,
            "Product updated."
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

export async function DELETE(
    req: NextRequest,
    { params }: Props
) {
    try {
        await connectDB();

        const user = await auth(req);

        authorize(user, [
            UserRole.ORG_ADMIN,
        ]);

        const { id } = await params;

        await ProductService.delete(
            id,
            user
        );

        return success(
            null,
            "Product deleted."
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