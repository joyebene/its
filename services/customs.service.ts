import Customs from "@/models/Customs";
import Shipment from "@/models/Shipment";

import {
    CreateCustomsInput,
    UpdateCustomsInput,
} from "@/schema/customs.schema";

import { IUser } from "@/models/User";

import User, {
    UserRole,
} from "@/models/User";

import {
    NotificationType,
} from "@/models/Notification";

import {
    NotificationService,
} from "@/services/notification.service";


export class CustomsService {

    private static async notifyCustomsUsers(
        title: string,
        message: string,
        type: NotificationType
    ) {

        const users = await User.find({

            role: {
                $in: [
                    UserRole.ADMIN,
                    UserRole.SUPER_ADMIN,
                    UserRole.CUSTOMS,
                    UserRole.LOGISTICS,
                ],
            },

            isDeleted: false,

        });



        const notifications = users.map(user => ({

            user: user._id,

            title,

            message,

            type,

        }));


        if (notifications.length) {

            await NotificationService.bulkCreate(
                notifications
            );

        }

    }

    static async create(
        user: IUser,
        data: CreateCustomsInput
    ) {

        const shipment = await Shipment.findById(
            data.shipment
        );

        if (!shipment) {
            throw new Error("Shipment not found.");
        }

        const exists = await Customs.findOne({
            shipment: shipment._id,
        });

        if (exists) {
            throw new Error(
                "Customs record already exists."
            );
        }


        const customs = await Customs.create({

            ...data,

            processedBy: user._id,

        });

        await this.notifyCustomsUsers(

            "New Customs Record",

            `A customs clearance record has been created for shipment ${shipment.shipmentNumber}.`,

            NotificationType.INFO

        );



        return customs;



    }

    static async findAll() {

        return Customs.find()

            .populate(
                "shipment",
                "shipmentNumber trackingNumber container"
            )

            .populate(
                "processedBy",
                "firstName lastName"
            )

            .sort({
                createdAt: -1,
            });

    }

    static async findById(id: string) {

        const customs = await Customs.findById(id)

            .populate("shipment")

            .populate(
                "processedBy",
                "firstName lastName"
            );

        if (!customs) {
            throw new Error(
                "Customs record not found."
            );
        }

        return customs;

    }

    static async update(
        id: string,
        user: IUser,
        data: UpdateCustomsInput
    ) {

        const customs =
            await Customs.findByIdAndUpdate(
                id,
                {
                    ...data,
                    processedBy: user._id,
                },
                {
                    new: true,
                }
            );

        if (!customs) {
            throw new Error(
                "Customs record not found."
            );
        }

        const shipment =
            await Shipment.findById(
                customs.shipment
            );


        if (!shipment) {
            throw new Error(
                "Shipment not found."
            );
        }

        await this.notifyCustomsUsers(

            "Customs Status Updated",

            `Customs status for shipment ${shipment?.shipmentNumber} has been updated.`,

            NotificationType.WARNING

        );

        return customs;

    }

    static async delete(id: string) {

        const customs =
            await Customs.findByIdAndDelete(id);

        if (!customs) {
            throw new Error(
                "Customs record not found."
            );
        }

        return customs;

    }

}