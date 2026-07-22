import User, { UserRole } from "@/models/User";
import { IUser } from "@/models/User";
import { InviteMemberInput, UpdateMemberInput } from "@/schema/member.schema";

export class MemberService {
    static async invite(
        owner: IUser,
        data: InviteMemberInput
    ) {
        const user = await User.findOne({
            email: data.email.toLowerCase(),
        });

        if (!user) {
            throw new Error("User not found.");
        }

        if (user.organization) {
            throw new Error(
                "User already belongs to an organization."
            );
        }

        user.organization = owner.organization;
        user.role = data.role;

        await user.save();

        return user;
    }

    static async getMembers(owner: IUser) {
        return User.find({
            organization: owner.organization,
            isDeleted: false,
        })
            .select("-password -refreshToken")
            .sort({
                createdAt: -1,
            });
    }


    static async updateMember(
        owner: IUser,
        memberId: string,
        data: UpdateMemberInput
    ) {

        const member =
            await User.findOne({

                _id: memberId,

                organization:
                    owner.organization,

                isDeleted: false,

            });

        if (!member) {
            throw new Error(
                "Member not found."
            );
        }

        // Prevent changing another ORG_ADMIN
        if (
            member.role === UserRole.ORG_ADMIN
        ) {
            throw new Error(
                "Cannot modify another organization administrator."
            );
        }

        if (data.role) {
            member.role = data.role;
        }

        if (data.status) {
            member.status = data.status;
        }

        await member.save();

        return member;
    }

}