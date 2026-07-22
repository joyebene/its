import { UserRole } from "./types";

export const hasRole = (
  userRole: UserRole,
  allowedRoles: UserRole[]
) => {
  return allowedRoles.includes(userRole);
};