import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { success, error } from "@/utils/api-response";
import { ProductService } from "@/services/product.service";
import { createProductSchema, productFiltersSchema } from "@/schema/product.schema";
import { auth } from "@/middleware/auth";
import { IUser } from "@/models/User";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const user = await auth(req) as IUser;

        if (!user) {
            return error("Unauthorized", 401);
        }

        const body = await req.json();

        const validated = createProductSchema.safeParse(body);

        if (!validated.success) {
             console.log(validated.error.flatten());
            return error(
                "Validation failed",
                400,
                validated.error.flatten()
            );
        }

        const product = await ProductService.create(
            user,
            validated.data
        );

        return success(product, "Product created successfully");
    } catch (err: any) {
        console.error(err);
        return error(err.message || "Internal Server Error", 500);
    }
}


export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const user = await auth(req) as IUser;

        if (!user) {
            return error("Unauthorized", 401);
        }

        const { searchParams } = new URL(req.url);

        const parsed = productFiltersSchema.safeParse({
            status: searchParams.get("status") ?? undefined,
            paymentStatus: searchParams.get("paymentStatus") ?? undefined,
            buyerId: searchParams.get("buyerId") ?? undefined,
            shipmentId: searchParams.get("shipmentId") ?? undefined,
            search: searchParams.get("search") ?? undefined,
            fromDate: searchParams.get("fromDate") ?? undefined,
            toDate: searchParams.get("toDate") ?? undefined,
        });

        if (!parsed.success) {
            return error(
                "Invalid filters",
                400,
                parsed.error.flatten()
            );
        }

        const products = await ProductService.findAll(
            user,
            parsed.data
        );
        return success(products);
    } catch (err: any) {
        console.error(err);
        return error(err.message || "Internal Server Error", 500);
    }
}