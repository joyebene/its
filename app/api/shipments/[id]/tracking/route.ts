import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { auth } from "@/middleware/auth";

import {
    createTrackingEventSchema,
} from "@/schema/tracking.schema";

import { TrackingService } from "@/services/tracking.service";

import {
    success,
    error,
} from "@/utils/api-response";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export async function POST(
    req: NextRequest,
    { params }: Props
) {
    try {

        await connectDB();

        const user = await auth(req);

        const { id } = await params;

        const body = await req.json();

        const validated =
            createTrackingEventSchema.safeParse(
                body
            );

        if (!validated.success) {

            return error(
                "Validation failed",
                400,
                validated.error.flatten()
            );

        }

        const tracking =
            await TrackingService.create(
                id,
                user,
                validated.data
            );

        return success(
            tracking,
            "Tracking event added.",
            201
        );

    } catch (err: any) {

        return error(err.message, 400);

    }
}

export async function GET(
    req: NextRequest,
    { params }: Props
) {
    try {
        await connectDB();


        const { id } = await params;

        const timeline =
            await TrackingService.timeline(
                id,
            );

        return success(timeline);

    } catch (err: any) {

        return error(err.message, 400);

    }
}