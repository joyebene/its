// schema/product.schema.js
import { z } from "zod";

// Product Status Enum (matches your ShipmentStatus pattern)
export const ProductStatus = z.enum([
    'order_placed',
    'payment_pending',
    'payment_cleared',
    'in_transit',
    'arrived_port',
    'customs_clearance',
    'out_for_delivery',
    'delivered',
    'cancelled'
]);

export const PaymentStatus = z.enum([
    'pending',
    'cleared',
    'failed',
    'refunded'
]);

export const PaymentMethod = z.enum([
    'credit_card',
    'debit_card',
    'bank_transfer',
    'paypal',
    'cash'
]);

// Tracking location schema
const trackingLocationSchema = z.object({
    location: z.string().min(2),
    status: z.string(),
    timestamp: z.coerce.date().default(() => new Date()),
    description: z.string().optional(),
    coordinates: z.object({
        lat: z.number().optional(),
        lng: z.number().optional()
    }).optional()
});

// Shipping address schema
const shippingAddressSchema = z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional()
});

// Create Product Schema
export const createProductSchema = z.object({
    // Core fields
    name: z.string().min(1, "Product name is required"),
    sku: z.string().optional(),
    description: z.string().optional(),
    quantity: z.number().int().positive().default(1),
    unitPrice: z.number().positive("Unit price must be positive"),
    totalPrice: z.number().positive("Total price must be positive"),

    // Relations
    shipmentId: z.string().optional(),
    shipmentItemId: z.string().optional(),
    containerId: z.string().optional(),
    orderId: z.string().optional(),

    // Buyer info
    buyerId: z.string().optional(),
    buyerEmail: z.string().email("Invalid email format").optional(),
    buyerName: z.string().optional(),
    shippingAddress: shippingAddressSchema.optional(),

    // Expected delivery
    expectedDelivery: z.coerce.date().optional(),

    // Metadata
    notes: z.string().optional(),
    tags: z.array(z.string()).optional()
});

// Update Product Schema (partial)
export const updateProductSchema = createProductSchema.partial();

// Payment Input Schema
export const paymentSchema = z.object({
    productId: z.string(),
    amount: z.number().positive("Amount must be positive"),
    method: PaymentMethod,
    reference: z.string().optional(),
    gatewayResponse: z.any().optional()
});

// Payment Clear Schema
export const paymentClearSchema = z.object({
    transactionId: z.string().min(1, "Transaction ID is required"),
    gatewayResponse: z.any().optional()
});

// Tracking Update Schema
export const trackingUpdateSchema = z.object({
    location: z.string().min(2, "Location is required"),
    status: z.enum([
        'in_transit',
        'arrived_port',
        'customs_clearance',
        'out_for_delivery',
        'delivered'
    ]),
    description: z.string().optional(),
    coordinates: z.object({
        lat: z.number().optional(),
        lng: z.number().optional()
    }).optional()
});

// Bulk Tracking Update Schema
export const bulkTrackingUpdateSchema = z.object({
    updates: z.array(trackingUpdateSchema).min(1)
});

// Product Status Update Schema
export const updateProductStatusSchema = z.object({
    status: ProductStatus,
    remarks: z.string().optional()
});

// Product Query Filters Schema
export const productFiltersSchema = z.object({
    status: ProductStatus.optional(),
    paymentStatus: PaymentStatus.optional(),
    buyerId: z.string().optional(),
    shipmentId: z.string().optional(),
    search: z.string().optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
    hasShipment: z
        .enum(["true", "false"])
        .optional(),
});

// Export Types
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type PaymentClearInput = z.infer<typeof paymentClearSchema>;
export type TrackingUpdateInput = z.infer<typeof trackingUpdateSchema>;
export type BulkTrackingUpdateInput = z.infer<typeof bulkTrackingUpdateSchema>;
export type UpdateProductStatusInput = z.infer<typeof updateProductStatusSchema>;
export type ProductFiltersInput = z.infer<typeof productFiltersSchema>;
export type ProductStatus = z.infer<typeof ProductStatus>;
export type PaymentStatus = z.infer<typeof PaymentStatus>;
export type PaymentMethod = z.infer<typeof PaymentMethod>;