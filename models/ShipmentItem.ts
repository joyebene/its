import mongoose, { Document, Model, Schema } from "mongoose";

export interface IShipmentItem extends Document {
  shipment: mongoose.Types.ObjectId;

  product: mongoose.Types.ObjectId;

  quantity: number;
}

const ShipmentItemSchema = new Schema<IShipmentItem>(
  {
    shipment: {
      type: Schema.Types.ObjectId,
      ref: "Shipment",
      required: true,
      index: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

ShipmentItemSchema.index({
    shipment: 1,
    product: 1,
});

const ShipmentItem: Model<IShipmentItem> =
  mongoose.models.ShipmentItem ||
  mongoose.model<IShipmentItem>(
    "ShipmentItem",
    ShipmentItemSchema
  );

export default ShipmentItem;