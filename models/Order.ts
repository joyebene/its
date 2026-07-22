import mongoose, { Schema, Document, Model } from "mongoose";

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum BuyerType {
  USER = "USER",
  ORGANIZATION = "ORGANIZATION",
}

export interface IOrder extends Document {
  buyerType: BuyerType;

  buyerUser: mongoose.Types.ObjectId;

  buyerOrganization?: mongoose.Types.ObjectId;

  seller: mongoose.Types.ObjectId;

  orderNumber: string;

  status: OrderStatus;

  paymentStatus: PaymentStatus;

  totalAmount: number;

  currency: string;

  createdBy: mongoose.Types.ObjectId;
}

const OrderSchema = new Schema<IOrder>(
  {

    buyerType: {
      type: String,
      enum: Object.values(BuyerType),
      required: true,
    },

    buyerUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    buyerOrganization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
      index: true,
    },

    seller: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "USD",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.pre("validate", async function () {
  if (
    this.buyerType === BuyerType.USER &&
    !this.buyerUser
  ) {
    throw new Error("buyerUser is required.");
  }

  if (
    this.buyerType === BuyerType.ORGANIZATION &&
    !this.buyerOrganization
  ) {
    throw new Error("buyerOrganization is required.");
  }

  if (
    this.buyerUser &&
    this.buyerOrganization
  ) {
    throw new Error(
      "Only one buyer type is allowed."
    );
  }
});

const Order: Model<IOrder> =
  mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);

export default Order;