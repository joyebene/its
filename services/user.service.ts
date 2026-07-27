import User, {
  IUser,
  UserRole,
} from "@/models/User";

import bcrypt from "bcryptjs";

export class UserService {
  static async findAll() {
    return User.find({
      isDeleted: false,
    })
      .select("-password -refreshToken")
      .sort({
        createdAt: -1,
      });
  }

  static async findById(id: string) {
    const user = await User.findOne({
      _id: id,
      isDeleted: false,
    }).select("-password -refreshToken");

    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  }

  static async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    role: UserRole;
  }) {
    const exists = await User.findOne({
      email: data.email,
    });

    if (exists) {
      throw new Error("Email already exists.");
    }

    const hashedPassword =
      await bcrypt.hash(data.password, 10);

    const user = await User.create({
      ...data,
      password: hashedPassword,
    });

    return user;
  }

  static async update(
    id: string,
    data: Partial<IUser>
  ) {
    if (data.password) {
      data.password =
        await bcrypt.hash(
          data.password,
          10
        );
    }

    const user =
      await User.findByIdAndUpdate(
        id,
        data,
        {
          new: true,
        }
      ).select("-password -refreshToken");

    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  }

  static async delete(id: string) {
    const user =
      await User.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
        },
        {
          new: true,
        }
      );

    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  }
}