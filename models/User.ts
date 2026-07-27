import mongoose, { Schema, Document, Model } from "mongoose";

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  ORG_ADMIN = "ORG_ADMIN",
  WAREHOUSE = "WAREHOUSE",
  LOGISTICS = "LOGISTICS",
  CUSTOMS = "CUSTOMS",
  DELIVERY = "DELIVERY",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export enum AccountType {
  INDIVIDUAL = "INDIVIDUAL",
  BUSINESS = "BUSINESS",
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  avatar?: string;
  accountType: AccountType
  organization?: mongoose.Types.ObjectId;

  role: UserRole;
  status: UserStatus;

  refreshToken?: string;

  emailVerified: boolean;
  isDeleted: boolean;

  lastLogin?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      select: false,
      required: true,
    },

    avatar: String,

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    lastLogin: Date,

    refreshToken: {
      type: String,
      select: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

export default User;