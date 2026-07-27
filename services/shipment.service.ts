import Shipment from "@/models/Shipment";
import ShipmentItem from "@/models/ShipmentItem";

import Order from "@/models/Order";

import {
    CreateShipmentInput,
    UpdateShipmentInput,
} from "@/schema/shipment.schema";

import {
    IUser,
    UserRole,
} from "@/models/User";

import User from "@/models/User";

import {
    TrackingEvent,
} from "@/models";

import {
    CreateTrackingEventInput,
} from "@/schema/tracking.schema";


import {
    NotificationType,
} from "@/models/Notification";


import {
    NotificationService,
} from "@/services/notification.service";



export class ShipmentService {



    private static generateTrackingNumber() {

        return `TRK-${Math.floor(
            10000000 + Math.random() * 90000000
        )}`;

    }





    private static async generateShipmentNumber() {


        const count =
            await Shipment.countDocuments();



        const year =
            new Date().getFullYear();



        return `ITSR-${year}-${String(
            count + 1
        ).padStart(6, "0")}`;


    }






    private static async notifyShipmentUsers(
        title: string,
        message: string,
        type: NotificationType
    ) {


        const users = await User.find({

            role: {

                $in: [

                    UserRole.ADMIN,

                    UserRole.SUPER_ADMIN,

                    UserRole.LOGISTICS,

                    UserRole.WAREHOUSE,

                    UserRole.DELIVERY,

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
        data: CreateShipmentInput
    ) {



        const order =
            await Order.findById(
                data.order
            );



        if (!order) {

            throw new Error(
                "Order not found."
            );

        }




        const shipment =
            await Shipment.create({

                ...data,


                trackingNumber:
                    this.generateTrackingNumber(),



                shipmentNumber:
                    await this.generateShipmentNumber(),



                createdBy: user._id,


            });






        await ShipmentItem.insertMany(

            data.items.map(item => ({


                shipment:
                    shipment._id,


                product:
                    item.product,


                quantity:
                    item.quantity,


            }))


        );






        await this.notifyShipmentUsers(

            "New Shipment Created",


            `Shipment ${shipment.shipmentNumber} has been created.`,


            NotificationType.INFO


        );





        return shipment;


    }









    static async findAll(
        user: IUser
    ) {


        return Shipment.find({

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
        id: string
    ) {


        const shipment =
            await Shipment.findOne({

                _id: id,

                isDeleted: false,

            })

                .populate("order")

                .populate("originWarehouse")

                .populate("destinationWarehouse");




        if (!shipment) {

            throw new Error(
                "Shipment not found."
            );

        }



        const items =
            await ShipmentItem.find({

                shipment:
                    shipment._id,

            });



        return {

            shipment,

            items,

        };


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

                    isDeleted: false,

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
        id: string
    ) {


        const shipment =
            await Shipment.findOneAndUpdate(

                {

                    _id: id,

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

                isDeleted: false,

            });



        if (!shipment) {

            throw new Error(
                "Shipment not found."
            );

        }






        shipment.status =
            data.status;



        await shipment.save();






        const trackingEvent =
            await TrackingEvent.create({

                shipment:
                    shipment._id,


                status:
                    data.status,


                location:
                    data.location,


                remarks:
                    data.remarks,


                latitude:
                    data.latitude,


                longitude:
                    data.longitude,


                updatedBy:
                    user._id,


                eventTime:
                    new Date(),


            });







        await this.notifyShipmentUsers(


            "Shipment Status Updated",



            `Shipment ${shipment.shipmentNumber} status changed to ${shipment.status}.`,



            NotificationType.WARNING



        );



        return {

            shipment,

            trackingEvent,

        };


    }



}