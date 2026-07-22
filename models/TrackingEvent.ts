import mongoose, { Document, Model, Schema } from "mongoose";
import { ShipmentStatus } from "./Shipment";

export interface ITrackingEvent extends Document {
  shipment: mongoose.Types.ObjectId;

  status: ShipmentStatus;

  location: string;

  remarks?: string;

  latitude?: number;

  longitude?: number;

  eventTime: Date;

  updatedBy: mongoose.Types.ObjectId;
}

const TrackingEventSchema = new Schema<ITrackingEvent>(
  {
    shipment: {
      type: Schema.Types.ObjectId,
      ref: "Shipment",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(ShipmentStatus),
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    remarks: String,

    latitude: Number,

    longitude: Number,

    eventTime: {
      type: Date,
      default: Date.now,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

TrackingEventSchema.index({
    shipment: 1,
    createdAt: -1,
});

const TrackingEvent: Model<ITrackingEvent> =
  mongoose.models.TrackingEvent ||
  mongoose.model<ITrackingEvent>(
    "TrackingEvent",
    TrackingEventSchema
  );

export default TrackingEvent;