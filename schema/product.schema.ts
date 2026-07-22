import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(2),

    description: z.string().optional(),

    sku: z.string().min(2),

    category: z.string(),

    quantity: z.number().min(1),

    unitPrice: z.number().min(0),

    currency: z.string().default("USD"),

    weight: z.number().min(0),

    length: z.number().optional(),

    width: z.number().optional(),

    height: z.number().optional(),

    batchNumber: z.string(),

    countryOfOrigin: z.string().optional(),

    manufacturer: z.string().optional(),

    brand: z.string().optional(),

    hsCode: z.string().optional(),
});

export const updateProductSchema =
    createProductSchema.partial();

export type UpdateProductInput =
    z.infer<typeof updateProductSchema>;

export type CreateProductInput =
    z.infer<typeof createProductSchema>;