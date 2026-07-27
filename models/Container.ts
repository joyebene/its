import mongoose, { Schema, Document } from "mongoose";

export enum ContainerStatus {
  AVAILABLE = "AVAILABLE",
  LOADED = "LOADED",
  IN_TRANSIT = "IN_TRANSIT",
  ARRIVED = "ARRIVED",
}

export enum ContainerType {
  TWENTY_FT = "20FT",
  FORTY_FT = "40FT",
  FORTY_HQ = "40HQ",
}

export interface IContainer extends Document {

  containerNumber: string;

  type: ContainerType;

  carrier: string;

  sealNumber?: string;

  expectedDeparture?: Date;

  expectedArrival?: Date;

  status: ContainerStatus;

  createdBy: mongoose.Types.ObjectId;

  isDeleted: boolean;
}

const ContainerSchema = new Schema<IContainer>(
  {
    containerNumber: {
      type: String,
      required: true,
      unique: true,
    },

    type: {
      type: String,
      enum: Object.values(ContainerType),
      required: true,
    },

    carrier: {
      type: String,
      required: true,
    },

    sealNumber: String,

    expectedDeparture: Date,

    expectedArrival: Date,

    status: {
      type: String,
      enum: Object.values(ContainerStatus),
      default: ContainerStatus.AVAILABLE,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Container ||
  mongoose.model<IContainer>(
    "Container",
    ContainerSchema
  );