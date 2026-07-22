import Organization from "@/models/Organization";
import { IUser, UserRole } from "@/models/User";
import { CreateOrganizationInput } from "@/schema/organization.schema";

export class OrganizationService {

  static async create(data: CreateOrganizationInput, user: IUser) {

    const exists = await Organization.findOne({
      name: data.name,
    });

    if (exists) {
      throw new Error("Organization already exists.");
    }

    const organization = await Organization.create({
      ...data,
      owner: user._id,
    });

      user.organization = organization._id;
    user.role = UserRole.ORG_ADMIN;

    await user.save();

    return organization;

  }

  static async findAll() {
    return Organization.find();
  }

  static async findById(id: string) {
    return Organization.findById(id);
  }

  static async findMine(user: IUser) {
    if (!user.organization) {
      throw new Error(
        "You don't belong to any organization."
      );
    }

    const organization =
      await Organization.findById(user.organization)
        .populate("owner", "firstName lastName email");

    if (!organization) {
      throw new Error("Organization not found.");
    }

    return organization;
  }

}