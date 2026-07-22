import { z } from "zod";
import { ShipmentStatus } from "@/models/Shipment";

export const createTrackingEventSchema =
    z.object({

        status: z.nativeEnum(
            ShipmentStatus
        ),

        location: z
            .string()
            .min(2),

        remarks:
            z.string().optional(),

        latitude:
            z.number().optional(),

        longitude:
            z.number().optional(),

    });

export type CreateTrackingEventInput =
    z.infer<typeof createTrackingEventSchema>;