import mongoose, { Document, Model, Schema } from "mongoose";

export enum AddressType {
  HOME = "HOME",
  OFFICE = "OFFICE",
  WAREHOUSE = "WAREHOUSE",
  SHIPPING = "SHIPPING",
  BILLING = "BILLING",
}

export interface IAddress extends Document {
  user?: mongoose.Types.ObjectId;
  organization?: mongoose.Types.ObjectId;

  type: AddressType;

  contactName: string;
  phone: string;

  country: string;
  state: string;
  city: string;

  street: string;
  postalCode?: string;

  isDefault: boolean;
}

const AddressSchema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },

    type: {
      type: String,
      enum: Object.values(AddressType),
      required: true,
    },

    contactName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    street: {
      type: String,
      required: true,
    },

    postalCode: String,

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Address: Model<IAddress> =
  mongoose.models.Address ||
  mongoose.model<IAddress>("Address", AddressSchema);

export default Address;