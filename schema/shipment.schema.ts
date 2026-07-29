import { z } from "zod";
import {
    ShipmentStatus,
    ShippingMethod,
} from "@/models/Shipment";

export const createShipmentSchema = z.object({
    product: z.string().min(1, "Product is required"),

    origin: z.object({
        city: z.string().min(2, "City is required"),
        state: z.string().min(2, "State is required"),
        country: z.string().min(2, "Country is required"),
    }),

    destination: z.object({
        city: z.string().min(2, "City is required"),
        state: z.string().min(2, "State is required"),
        country: z.string().min(2, "Country is required"),
    }),

    shippingMethod: z.nativeEnum(ShippingMethod),

    carrier: z.string().optional(),

    containerNumber: z.string().optional(),

    estimatedDeparture: z.coerce.date().optional(),

    estimatedArrival: z.coerce.date().optional(),
});

export const updateShipmentSchema =
    createShipmentSchema.partial();

export const updateShipmentStatusSchema = z.object({
    status: z.nativeEnum(ShipmentStatus),

    location: z.string().min(2),

    remarks: z.string().optional(),

    latitude: z.number().optional(),

    longitude: z.number().optional(),
});

export type CreateShipmentInput = z.infer<
    typeof createShipmentSchema
>;

export type UpdateShipmentInput = z.infer<
    typeof updateShipmentSchema
>;

export type UpdateShipmentStatusInput = z.infer<
    typeof updateShipmentStatusSchema
>;