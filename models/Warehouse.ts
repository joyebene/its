import mongoose, { Schema, Document } from "mongoose";

export interface IWarehouse extends Document {
  name: string;

  code: string;

  country: string;

  city: string;

  address: string;

  manager?: mongoose.Types.ObjectId;
}

const WarehouseSchema = new Schema<IWarehouse>(
  {
    name: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
    },

    country: String,

    city: String,

    address: String,

    manager: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Warehouse ||
  mongoose.model<IWarehouse>("Warehouse", WarehouseSchema);