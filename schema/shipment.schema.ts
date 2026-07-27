import { z } from "zod";
import {
    ShipmentStatus,
    ShippingMethod,
} from "@/models/Shipment";

const shipmentItemSchema = z.object({
    product: z.string(),
    quantity: z.number().int().positive(),
});


export const createShipmentSchema = z.object({
    order: z.string(),

    originWarehouse: z.string(),

    destinationWarehouse: z.string(),

    shippingMethod: z.nativeEnum(ShippingMethod),

    carrier: z.string().optional(),

    containerNumber: z.string().optional(),

    estimatedDeparture: z.coerce.date().optional(),

    estimatedArrival: z.coerce.date().optional(),

    items: z.array(shipmentItemSchema).min(1),
});

export const updateShipmentSchema = createShipmentSchema.partial();

export const updateShipmentStatusSchema = z.object({
    status: z.nativeEnum(ShipmentStatus),
    
    location: z.string().min(2),

    remarks: z.string().optional(),

    latitude: z.number().optional(),

    longitude: z.number().optional(),
});

export type CreateShipmentInput =
    z.infer<typeof createShipmentSchema>;

export type UpdateShipmentInput =
    z.infer<typeof updateShipmentSchema>;

export type UpdateShipmentStatusInput =
    z.infer<typeof updateShipmentStatusSchema>;