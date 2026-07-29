// schema/payment.schema.ts
import { z } from "zod";
import { PaymentStatus, PaymentMethod, PaymentGateway } from "@/models/Payment";

// ============ ENUMS ============
export const PaymentStatusEnum = z.nativeEnum(PaymentStatus);
export const PaymentMethodEnum = z.nativeEnum(PaymentMethod);
export const PaymentGatewayEnum = z.nativeEnum(PaymentGateway);

// ============ SCHEMAS ============
const billingAddressSchema = z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional()
});

const cardDetailsSchema = z.object({
    number: z.string().min(15).max(16),
    expiryMonth: z.string().min(1).max(2),
    expiryYear: z.string().min(2).max(4),
    cvv: z.string().min(3).max(4),
    name: z.string().optional()
});

// Create Payment Schema
export const createPaymentSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    orderId: z.string().optional(),
    shipmentId: z.string().optional(),
    amount: z.number().positive("Amount must be positive"),
    currency: z.string().default('USD'),
    method: PaymentMethodEnum,
    gateway: PaymentGatewayEnum.default(PaymentGateway.MANUAL),
    customerName: z.string().optional(),
    customerEmail: z.string().email("Invalid email").optional(),
    customerPhone: z.string().optional(),
    billingAddress: billingAddressSchema.optional(),
    cardDetails: cardDetailsSchema.optional(),
    notes: z.string().optional(),
    metadata: z.any().optional()
});

// Process Payment Schema
export const processPaymentSchema = z.object({
    paymentId: z.string(),
    gatewayResponse: z.any().optional()
});

// Complete Payment Schema
export const completePaymentSchema = z.object({
    transactionId: z.string().min(1, "Transaction ID is required"),
    gatewayResponse: z.any().optional()
});

// Fail Payment Schema
export const failPaymentSchema = z.object({
    reason: z.string().min(1, "Failure reason is required"),
    gatewayResponse: z.any().optional()
});

// Refund Payment Schema
export const refundPaymentSchema = z.object({
    amount: z.number().positive("Amount must be positive").optional(),
    reason: z.string().min(1, "Refund reason is required"),
    reference: z.string().optional()
});

// Payment Filters Schema
export const paymentFiltersSchema = z.object({
    status: PaymentStatusEnum.optional(),
    method: PaymentMethodEnum.optional(),
    gateway: PaymentGatewayEnum.optional(),
    productId: z.string().optional(),
    userId: z.string().optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
    search: z.string().optional()
});

// Webhook Schema
export const paymentWebhookSchema = z.object({
    event: z.string(),
    transactionId: z.string(),
    status: z.string(),
    amount: z.number().optional(),
    currency: z.string().optional(),
    reference: z.string().optional(),
    gatewayResponse: z.any().optional()
});

// ============ TYPES ============
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type ProcessPaymentInput = z.infer<typeof processPaymentSchema>;
export type CompletePaymentInput = z.infer<typeof completePaymentSchema>;
export type FailPaymentInput = z.infer<typeof failPaymentSchema>;
export type RefundPaymentInput = z.infer<typeof refundPaymentSchema>;
export type PaymentFiltersInput = z.infer<typeof paymentFiltersSchema>;
export type PaymentWebhookInput = z.infer<typeof paymentWebhookSchema>;
export type BillingAddress = z.infer<typeof billingAddressSchema>;
export type CardDetails = z.infer<typeof cardDetailsSchema>;