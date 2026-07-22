import Product, {
  ProductStatus,
} from "@/models/Product";

import { IUser } from "@/models/User";

import {
  CreateProductInput,
  UpdateProductInput,
} from "@/schema/product.schema";

export class ProductService {
  // Create Product
  static async create(
    user: IUser,
    data: CreateProductInput
  ) {
    if (!user.organization) {
      throw new Error(
        "You are not assigned to an organization."
      );
    }

    const skuExists = await Product.findOne({
      sku: data.sku.toUpperCase(),
    });

    if (skuExists) {
      throw new Error("SKU already exists.");
    }

    const batchExists = await Product.findOne({
      batchNumber: data.batchNumber,
      organization: user.organization,
    });

    if (batchExists) {
      throw new Error(
        "Batch number already exists."
      );
    }

    return Product.create({
      ...data,

      sku: data.sku.toUpperCase(),

      organization: user.organization,

      createdBy: user._id,

      status: ProductStatus.DRAFT,
    });
  }

  // Get Products
  static async findMine(user: IUser) {
    return Product.find({
      organization: user.organization,
    })
      .populate("category")
      .sort({
        createdAt: -1,
      });
  }

  // Get One Product
  static async findById(
    id: string,
    user: IUser
  ) {
    const product =
      await Product.findOne({
        _id: id,
        organization: user.organization,
      }).populate("category");

    if (!product) {
      throw new Error(
        "Product not found."
      );
    }

    return product;
  }

  // Update Product
  static async update(
    id: string,
    user: IUser,
    data: UpdateProductInput
  ) {
    const product =
      await Product.findOne({
        _id: id,
        organization: user.organization,
      });

    if (!product) {
      throw new Error(
        "Product not found."
      );
    }

    Object.assign(product, data);

    await product.save();

    return product;
  }

  // Delete Product
  static async delete(
    id: string,
    user: IUser
  ) {
    const product =
      await Product.findOne({
        _id: id,
        organization: user.organization,
      });

    if (!product) {
      throw new Error(
        "Product not found."
      );
    }

    await product.deleteOne();

    return;
  }

  // Change Status
  static async changeStatus(
    id: string,
    user: IUser,
    status: ProductStatus
  ) {
    const product =
      await Product.findOne({
        _id: id,
        organization: user.organization,
      });

    if (!product) {
      throw new Error(
        "Product not found."
      );
    }

    product.status = status;

    await product.save();

    return product;
  }
}
