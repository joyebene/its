import { z } from "zod";
import { BuyerType, OrderStatus, PaymentStatus } from "@/models/Order";

export const orderItemSchema = z.object({
    product: z.string().min(1),
    quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
    buyerType: z.nativeEnum(BuyerType),

    buyerUser: z.string().optional(),

    buyerOrganization: z.string().optional(),

    currency: z.string().default("USD"),

    items: z
        .array(orderItemSchema)
        .min(1, "Order must contain at least one item."),
});

export const updateOrderStatusSchema = z.object({
    status: z.nativeEnum(OrderStatus),
});

export const updatePaymentStatusSchema = z.object({
    paymentStatus: z.nativeEnum(PaymentStatus),
});

export type CreateOrderInput =
    z.infer<typeof createOrderSchema>;

export type UpdateOrderStatusInput =
    z.infer<typeof updateOrderStatusSchema>;

export type UpdatePaymentStatusInput =
    z.infer<typeof updatePaymentStatusSchema>;