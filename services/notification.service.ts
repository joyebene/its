import Notification, {
    NotificationType,
} from "@/models/Notification";

import User, { IUser, UserRole } from "@/models/User";
import mongoose from "mongoose";

interface CreateNotificationInput {

    user: mongoose.Types.ObjectId;

    title: string;

    message: string;

    type: NotificationType;

}



export class NotificationService {


    // Create notification
    static async create(
        userId: string,
        title: string,
        message: string,
        type: NotificationType = NotificationType.INFO
    ) {

        return Notification.create({

            user: userId,

            title,

            message,

            type,

        });

    }



    // Get logged in user's notifications
    static async findAll(
        user: IUser
    ) {


        return Notification.find({

            user: user._id,

        })
            .sort({
                createdAt: -1,
            });

    }




    // Count unread notifications
    static async unreadCount(
        user: IUser
    ) {


        return Notification.countDocuments({

            user: user._id,

            isRead: false,

        });


    }

    static async bulkCreate(
        notifications: CreateNotificationInput[]
    ) {

        return Notification.insertMany(
            notifications
        );

    }


    static async notifyAdmins(
        title: string,
        message: string,
        type: NotificationType = NotificationType.INFO
    ) {


        const admins = await User.find({

            role: {
                $in: [
                    UserRole.ADMIN,
                    UserRole.SUPER_ADMIN,
                ],
            },

            isDeleted: false,

        });


        const notifications =
            admins.map(admin => ({

                user: admin._id,

                title,

                message,

                type,

            }));


        if (notifications.length) {

            await Notification.insertMany(
                notifications
            );

        }


    }


}