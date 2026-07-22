import mongoose from "mongoose";

import Order, {
    BuyerType,
    OrderStatus,
    PaymentStatus,
} from "@/models/Order";

import OrderItem from "@/models/OrderItem";

import Product from "@/models/Product";

import { IUser, UserRole } from "@/models/User";

import { CreateOrderInput } from "@/schema/order.schema";

export class OrderService {

    private static async generateOrderNumber() {
        return `ORD-${Date.now()}`;
    }

    static async create(
        user: IUser,
        data: CreateOrderInput
    ) {

        if (
            data.buyerType === BuyerType.USER &&
            !data.buyerUser
        ) {
            throw new Error(
                "Buyer user is required."
            );
        }

        if (
            data.buyerType === BuyerType.ORGANIZATION &&
            !data.buyerOrganization
        ) {
            throw new Error(
                "Buyer organization is required."
            );
        }

        let total = 0;

        const products = [];

        for (const item of data.items) {

            const product =
                await Product.findById(item.product);

            if (!product) {
                throw new Error(
                    "Product not found."
                );
            }

            if (product.quantity < item.quantity) {
                throw new Error(
                    `${product.name} is out of stock.`
                );
            }

            total +=
                product.unitPrice * item.quantity;

            products.push({
                product,
                quantity: item.quantity,
            });
        }

        const session =
            await mongoose.startSession();

        session.startTransaction();

        try {

            const order =
                await Order.create(
                    [
                        {
                            buyerType:
                                data.buyerType,

                            buyerUser:
                                data.buyerUser,

                            buyerOrganization:
                                data.buyerOrganization,

                            orderNumber: await this.generateOrderNumber(),

                            totalAmount: total,

                            currency:
                                data.currency,

                            status:
                                OrderStatus.PENDING,

                            paymentStatus:
                                PaymentStatus.PENDING,
                        },
                    ],
                    { session }
                );

            for (const item of products) {

                await OrderItem.create(
                    [
                        {
                            order:
                                order[0]._id,

                            product:
                                item.product._id,

                            quantity:
                                item.quantity,

                            unitPrice:
                                item.product.unitPrice,

                            subtotal:
                                item.product.unitPrice *
                                item.quantity,
                        },
                    ],
                    { session }
                );

                item.product.quantity -=
                    item.quantity;

                await item.product.save({
                    session,
                });
            }

            await session.commitTransaction();

            return order[0];

        } catch (error) {

            await session.abortTransaction();

            throw error;

        } finally {

            session.endSession();

        }

    }

    static async findAll(user: IUser) {

        // Super Admin / Admin can see everything
        if (
            user.role === UserRole.SUPER_ADMIN ||
            user.role === UserRole.ADMIN
        ) {

            return Order.find()
                .sort({ createdAt: -1 });

        }

        // Organization users
        if (user.organization) {

            return Order.find({
                buyerOrganization: user.organization,
            }).sort({ createdAt: -1 });

        }

        // Individual users
        return Order.find({
            buyerUser: user._id,
        }).sort({ createdAt: -1 });

    }

    static async findById(
        id: string,
        user: IUser
    ) {

        const order =
            await Order.findById(id);

        if (!order) {
            throw new Error("Order not found.");
        }

        if (
            user.role !== UserRole.ADMIN &&
            user.role !== UserRole.SUPER_ADMIN
        ) {

            if (
                order.buyerOrganization &&
                user.organization?.toString() !==
                order.buyerOrganization.toString()
            ) {
                throw new Error("Unauthorized.");
            }

            if (
                order.buyerUser &&
                user._id.toString() !==
                order.buyerUser.toString()
            ) {
                throw new Error("Unauthorized.");
            }
        }

        const items =
            await OrderItem.find({
                order: order._id,
            }).populate("product");

        return {
            order,
            items,
        };

    }

    static async updateStatus(
        id: string,
        status: OrderStatus
    ) {

        const order =
            await Order.findById(id)
                .populate("buyerUser")
                .populate("buyerOrganization");

        if (!order) {
            throw new Error("Order not found.");
        }

        order.status = status;

        await order.save();

        return order;

    }

    static async updatePayment(
        id: string,
        paymentStatus: PaymentStatus
    ) {

        const order =
            await Order.findById(id);

        if (!order) {
            throw new Error("Order not found.");
        }

        order.paymentStatus = paymentStatus;

        await order.save();

        return order;

    }

    static async cancel(
        id: string
    ) {

        const order =
            await Order.findById(id);

        if (!order) {
            throw new Error("Order not found.");
        }

        order.status = OrderStatus.CANCELLED;

        await order.save();

        return order;

    }

}