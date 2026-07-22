import Shipment, {
    ShipmentStatus,
} from "@/models/Shipment";
import ShipmentItem from "@/models/ShipmentItem";

import Order from "@/models/Order";

import {
    CreateShipmentInput,
    UpdateShipmentInput,
} from "@/schema/shipment.schema";

import { IUser } from "@/models/User";
import { TrackingEvent } from "@/models";
import { CreateTrackingEventInput } from "@/schema/tracking.schema";

export class ShipmentService {

    private static async generateShipmentNumber() {

        const count =
            await Shipment.countDocuments();

        const year =
            new Date().getFullYear();

        return `ITSR-${year}-${String(
            count + 1
        ).padStart(6, "0")}`;
    }

    static async create(
        user: IUser,
        data: CreateShipmentInput
    ) {

        const order = await Order.findById(data.order);

        if (!order) {
            throw new Error("Order not found.");
        }

        const shipment = await Shipment.create({

            ...data,

            shipmentNumber:
                await this.generateShipmentNumber(),

            organization:
                user.organization,

            createdBy: user._id,

        });

        await ShipmentItem.insertMany(

            data.items.map(item => ({

                shipment: shipment._id,

                product: item.product,

                quantity: item.quantity,

            }))

        );

        return shipment;
    }

    static async findAll(user: IUser) {

        return Shipment.find({

            organization:
                user.organization,

            isDeleted: false,

        })

            .populate("order")

            .populate("originWarehouse")

            .populate("destinationWarehouse")

            .sort({
                createdAt: -1,
            });

    }

    static async findById(
        id: string,
        user: IUser
    ) {

        const shipment =
            await Shipment.findOne({

                _id: id,

                organization:
                    user.organization,

                isDeleted: false,

            });

        if (!shipment) {
            throw new Error(
                "Shipment not found."
            );
        }

        const items = await ShipmentItem.find({ shipment: shipment._id })

        return { shipment, items };
    }

    static async update(
        id: string,
        user: IUser,
        data: UpdateShipmentInput
    ) {

        const shipment =
            await Shipment.findOneAndUpdate(

                {

                    _id: id,

                    organization:
                        user.organization,

                },

                data,

                {
                    new: true,
                }

            );

        if (!shipment) {
            throw new Error(
                "Shipment not found."
            );
        }

        return shipment;
    }

    static async delete(
        id: string,
        user: IUser
    ) {

        const shipment =
            await Shipment.findOneAndUpdate(

                {

                    _id: id,

                    organization:
                        user.organization,

                },

                {

                    isDeleted: true,

                },

                {

                    new: true,

                }

            );

        if (!shipment) {
            throw new Error(
                "Shipment not found."
            );
        }

        return shipment;
    }

    static async updateStatus(
        id: string,
        user: IUser,
        data: CreateTrackingEventInput
    ) {

        const shipment =
            await Shipment.findOne({

                _id: id,

                organization:
                    user.organization,

            });

        if (!shipment) {
            throw new Error(
                "Shipment not found."
            );
        }

        shipment.status = data.status;

        await shipment.save();

        // Create tracking history
        const trackingEvent = await TrackingEvent.create({
            shipment: shipment._id,
            status: data.status,
            location: data.location,
            remarks: data.remarks,
            latitude: data.latitude,
            longitude: data.longitude,
            updatedBy: user._id,
            eventTime: new Date(),
        });

        return {
            shipment,
            trackingEvent,
        };
    }
}