import { z } from "zod";

import {
  ContainerStatus,
  ContainerType,
} from "@/models/Container";

export const createContainerSchema = z.object({

  type: z.nativeEnum(ContainerType, {
  message: "Container type is required.",
}),

  carrier: z
    .string()
    .min(2, "Carrier is required."),

  sealNumber: z
    .string()
    .optional(),

  expectedDeparture: z
    .string()
    .optional(),

  expectedArrival: z
    .string()
    .optional(),

  status: z
    .nativeEnum(ContainerStatus)
    .default(ContainerStatus.AVAILABLE),
});

export const updateContainerSchema =
  createContainerSchema.partial();

export type CreateContainerInput =
  z.infer<typeof createContainerSchema>;

export type UpdateContainerInput =
  z.infer<typeof updateContainerSchema>;