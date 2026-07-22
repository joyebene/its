import mongoose, { Document, Schema } from "mongoose";

export enum DeliveryStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
}

export interface IDelivery extends Document {
  shipment: mongoose.Types.ObjectId;

  deliveryOfficer?: mongoose.Types.ObjectId;

  vehicleNumber?: string;

  proofOfDelivery?: string;

  signature?: string;

  status: DeliveryStatus;
}

const DeliverySchema = new Schema<IDelivery>(
  {
    shipment: {
      type: Schema.Types.ObjectId,
      ref: "Shipment",
      required: true,
      unique: true,
    },

    deliveryOfficer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    vehicleNumber: String,

    proofOfDelivery: String,

    signature: String,

    status: {
      type: String,
      enum: Object.values(DeliveryStatus),
      default: DeliveryStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Delivery ||
  mongoose.model<IDelivery>("Delivery", DeliverySchema);