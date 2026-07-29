import mongoose, { Document, Model, Schema } from "mongoose";

export enum ShipmentStatus {
  CREATED = "CREATED",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  COLLECTED = "COLLECTED",
  WAREHOUSE_RECEIVED = "WAREHOUSE_RECEIVED",
  CONSOLIDATED = "CONSOLIDATED",
  EXPORT_CLEARANCE = "EXPORT_CLEARANCE",
  IN_TRANSIT = "IN_TRANSIT",
  ARRIVED_DESTINATION = "ARRIVED_DESTINATION",
  CUSTOMS_CLEARANCE = "CUSTOMS_CLEARANCE",
  IMPORT_WAREHOUSE = "IMPORT_WAREHOUSE",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum ShippingMethod {
  AIR = "AIR",
  SEA = "SEA",
  LAND = "LAND",
}

export interface IShipment extends Document {
  shipmentNumber: string;

  product: mongoose.Types.ObjectId;

  origin: {
    city: string;
    state: string;
    country: string;
  };

  destination: {
    city: string;
    state: string;
    country: string;
  };

  shippingMethod: ShippingMethod;

  carrier?: string;

  trackingNumber: string;

  estimatedDeparture?: Date;
  estimatedArrival?: Date;

  actualDeparture?: Date;
  actualArrival?: Date;

  status: ShipmentStatus;

  createdBy: mongoose.Types.ObjectId;

  isDeleted: boolean;
}

const ShipmentSchema = new Schema<IShipment>(
  {
    shipmentNumber: {
      type: String,
      required: true,
      unique: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    origin: {
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },

    destination: {
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },

    shippingMethod: {
      type: String,
      enum: Object.values(ShippingMethod),
      required: true,
    },

    carrier: String,

    trackingNumber: {
      type: String,
      unique: true,
    },

    estimatedDeparture: Date,

    estimatedArrival: Date,

    actualDeparture: Date,

    actualArrival: Date,

    status: {
      type: String,
      enum: Object.values(ShipmentStatus),
      default: ShipmentStatus.CREATED,
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

ShipmentSchema.index({ shipmentNumber: 1 });
ShipmentSchema.index({ product: 1 });
ShipmentSchema.index({ status: 1 });
ShipmentSchema.index({ trackingNumber: 1 });

const Shipment: Model<IShipment> =
  mongoose.models.Shipment ||
  mongoose.model<IShipment>("Shipment", ShipmentSchema);

export default Shipment;