import { ForbiddenError } from "@/lib/errors";
import { IUser, UserRole } from "@/models/User";

export function authorize(
  user: IUser,
  roles: UserRole[]
) {
  if (!roles.includes(user.role)) {
    throw new ForbiddenError();
  }
}