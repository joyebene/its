import Container from "@/models/Container";
import Shipment from "@/models/Shipment";

import {
  CreateContainerInput,
  UpdateContainerInput,
} from "@/schema/container.schema";

import User, { IUser, UserRole } from "@/models/User";

import {
  NotificationType,
} from "@/models/Notification";

import {
  NotificationService,
} from "@/services/notification.service";

export class ContainerService {

  private static async notifyContainerUsers(
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

  private static async generateContainerNumber() {
    const count = await Container.countDocuments();

    const year = new Date().getFullYear();

    return `CONT-${year}-${String(
      count + 1
    ).padStart(6, "0")}`;
  }

  static async create(
    user: IUser,
    data: CreateContainerInput
  ) {

    const container = await Container.create({

      ...data,

      containerNumber: await this.generateContainerNumber(),

      createdBy: user._id,

    });

    await this.notifyContainerUsers(

      "New Container Registered",

      `Container ${container.containerNumber} has been added to the system.`,

      NotificationType.INFO

    );

    return container;
  }

  static async findAll() {

    const containers = await Container.find({

      isDeleted: false,

    }).sort({

      createdAt: -1,

    });

    return Promise.all(

      containers.map(async (container) => {

        const shipmentCount =
          await Shipment.countDocuments({

            container: container._id,

            isDeleted: false,

          });

        return {

          ...container.toObject(),

          shipmentCount,

        };

      })

    );

  }

  static async findById(id: string) {

    const container =
      await Container.findOne({

        _id: id,

        isDeleted: false,

      });

    if (!container) {

      throw new Error(
        "Container not found."
      );

    }

    const shipments =
      await Shipment.find({

        container: container._id,

        isDeleted: false,

      });

    return {

      container,

      shipments,

    };

  }

  static async update(
    id: string,
    data: UpdateContainerInput
  ) {

    const container =
      await Container.findOneAndUpdate(

        {

          _id: id,

          isDeleted: false,

        },

        data,

        {

          new: true,

        }

      );

    if (!container) {

      throw new Error(
        "Container not found."
      );

    }

    await this.notifyContainerUsers(

      "Container Updated",

      `Container ${container.containerNumber} information has been updated.`,

      NotificationType.WARNING

    );

    return container;

  }

  static async delete(id: string) {

    const container =
      await Container.findOneAndUpdate(

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

    if (!container) {

      throw new Error(
        "Container not found."
      );

    }

    return container;

  }

}