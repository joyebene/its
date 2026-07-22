import TrackingEvent
    from "@/models/TrackingEvent";

import Shipment
    from "@/models/Shipment";

import { IUser }
    from "@/models/User";

import {
    CreateTrackingEventInput,
}
    from "@/schema/tracking.schema";

export class TrackingService {

    static async create(

        shipmentId: string,

        user: IUser,

        data: CreateTrackingEventInput

    ) {

        const shipment =
            await Shipment.findOne({

                _id: shipmentId,

                organization:
                    user.organization,

            });

        if (!shipment) {

            throw new Error(
                "Shipment not found."
            );

        }

        shipment.status =
            data.status;

        await shipment.save();

        return TrackingEvent.create({

            shipment: shipment._id,

            status: data.status,

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

    }

    static async timeline(

        shipmentId: string,

        user: IUser

    ) {

        const shipment =
            await Shipment.findOne({

                _id: shipmentId,

                organization:
                    user.organization,

            });

        if (!shipment) {

            throw new Error(
                "Shipment not found."
            );

        }

        return TrackingEvent.find({

            shipment:
                shipment._id,

        })

            .populate(
                "updatedBy",
                "firstName lastName"
            )

            .sort({

                eventTime: 1,

            });

    }
}