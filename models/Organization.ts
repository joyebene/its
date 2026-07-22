import mongoose, { Document, Model, Schema } from "mongoose";



export interface IOrganization extends Document {
  name: string;

  email?: string;

  phone?: string;

  logo?: string;

  description?: string;

  registrationNumber?: string;

  taxNumber?: string;

  website?: string;

  industry: string;

  country: string;

  state?: string;

  city?: string;

  address?: string;

  owner?: mongoose.Types.ObjectId;

  isVerified: boolean;

  isActive: boolean;

  deletedAt: Date
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      sparse: true,
    },

    phone: String,

    logo: {
      type: String,
      default: null,
    },

    description: {
      type: String,
      trim: true,
    },

    registrationNumber: String,

    taxNumber: String,

    website: String,

    industry: {
      type: String,
    },

    country: {
      type: String,
      required: true,
    },

    state: String,

    city: String,

    address: String,

    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Organization: Model<IOrganization> =
  mongoose.models.Organization ||
  mongoose.model<IOrganization>(
    "Organization",
    OrganizationSchema
  );

export default Organization;