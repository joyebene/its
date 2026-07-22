import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAuditLog extends Document {
  user?: mongoose.Types.ObjectId;

  action: string;

  module: string;

  description: string;

  ipAddress?: string;

  userAgent?: string;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    action: {
      type: String,
      required: true,
    },

    module: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    ipAddress: String,

    userAgent: String,
  },
  {
    timestamps: true,
  }
);

const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export default AuditLog;