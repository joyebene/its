import { z } from "zod";
import { CustomsStatus } from "@/models/Customs";

export const createCustomsSchema = z.object({
  shipment: z.string().min(1, "Shipment is required."),

  status: z.nativeEnum(CustomsStatus),

  dutyAmount: z.number().min(0),

  remarks: z.string().optional(),
});

export const updateCustomsSchema =
  createCustomsSchema.partial();

export type CreateCustomsInput =
  z.infer<typeof createCustomsSchema>;

export type UpdateCustomsInput =
  z.infer<typeof updateCustomsSchema>;