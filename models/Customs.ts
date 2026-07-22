import mongoose, { Document, Schema } from "mongoose";

export enum CustomsStatus {
  PENDING = "PENDING",
  UNDER_INSPECTION = "UNDER_INSPECTION",
  DUTY_PENDING = "DUTY_PENDING",
  DUTY_PAID = "DUTY_PAID",
  CLEARED = "CLEARED",
}

export interface ICustoms extends Document {
  shipment: mongoose.Types.ObjectId;

  status: CustomsStatus;

  dutyAmount: number;

  remarks?: string;

  processedBy?: mongoose.Types.ObjectId;
}

const CustomsSchema = new Schema<ICustoms>(
  {
    shipment: {
      type: Schema.Types.ObjectId,
      ref: "Shipment",
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: Object.values(CustomsStatus),
      default: CustomsStatus.PENDING,
    },

    dutyAmount: {
      type: Number,
      default: 0,
    },

    remarks: String,

    processedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Customs ||
  mongoose.model<ICustoms>("Customs", CustomsSchema);