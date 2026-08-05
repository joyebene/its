import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { auth } from "@/middleware/auth";
import { IUser } from "@/models/User";
import { ProductService } from "@/services/product.service";
import { error, success } from "@/utils/api-response";
import { updateLocationSchema } from "@/schema/location.schema";

export async function PATCH(
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
        const body = await req.json();

        const validated = updateLocationSchema.safeParse(body);

        if (!validated.success) {
            return error("Validation failed", 400);
        }

        const result = await ProductService.updateCurrentLocation(
            id,
            user,
            body
        );

        return success(result);
    } catch (err: any) {
        return error(err.message || "Failed to update location", 400);
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

        const location = await ProductService.getCurrentLocation(id);

        return success(location);
    } catch (err: any) {
        return error(err.message || "Failed to fetch location", 500);
    }
}