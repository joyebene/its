import mongoose, { Document, Model, Schema } from "mongoose";

export enum ProductStatus {
  DRAFT = "DRAFT",
  READY = "READY",
  ASSIGNED_TO_SHIPMENT = "ASSIGNED_TO_SHIPMENT",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface IProduct extends Document {
  organization: mongoose.Types.ObjectId;

  name: string;
  description?: string;

  sku: string;

  category?: string;

  quantity: number;

  unitPrice: number;

  currency: string;

  weight: number;

  length?: number;

  width?: number;

  height?: number;

  batchNumber: string;

  status: ProductStatus;

  createdBy: mongoose.Types.ObjectId;
}

const ProductSchema = new Schema<IProduct>(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: String,

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "USD",
    },

    weight: {
      type: Number,
      required: true,
      min: 0,
    },

    length: Number,

    width: Number,

    height: Number,

    batchNumber: {
      type: String,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.DRAFT,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Product: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);

export default Product;