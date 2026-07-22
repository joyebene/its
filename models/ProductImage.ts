import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductImage extends Document {
  product: mongoose.Types.ObjectId;
  imageUrl: string;
  isPrimary: boolean;
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ProductImage: Model<IProductImage> =
  mongoose.models.ProductImage ||
  mongoose.model<IProductImage>("ProductImage", ProductImageSchema);

export default ProductImage;