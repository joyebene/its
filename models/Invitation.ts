import mongoose, { Document, Model, Schema } from "mongoose";
import { UserRole } from "./User";

export interface IInvitation extends Document {
  email: string;

  organization: mongoose.Types.ObjectId;

  invitedBy: mongoose.Types.ObjectId;

  role: UserRole;

  token: string;

  accepted: boolean;

  expiresAt: Date;
}

const InvitationSchema = new Schema<IInvitation>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: [
        UserRole.WAREHOUSE,
        UserRole.LOGISTICS,
        UserRole.CUSTOMS,
        UserRole.DELIVERY,
      ],
      required: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    accepted: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

InvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Invitation: Model<IInvitation> =
  mongoose.models.Invitation ||
  mongoose.model<IInvitation>("Invitation", InvitationSchema);

export default Invitation;