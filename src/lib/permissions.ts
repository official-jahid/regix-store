import type { Role } from "./types";

export const ROLE_HIERARCHY: Record<Role, number> = {
  buyer: 0,
  business: 1,
  seller: 2,
  moderator: 3,
  admin: 4,
};

export function hasMinRole(
  userRole: string | undefined,
  minRole: Role,
): boolean {
  if (!userRole) return false;
  const userLevel = ROLE_HIERARCHY[userRole as Role] ?? -1;
  const requiredLevel = ROLE_HIERARCHY[minRole];
  return userLevel >= requiredLevel;
}

export function isAdmin(userRole: string | undefined): boolean {
  return userRole === "admin";
}

export function isModeratorOrAbove(userRole: string | undefined): boolean {
  return hasMinRole(userRole, "moderator");
}

export function isSeller(userRole: string | undefined): boolean {
  return userRole === "seller" || userRole === "admin";
}

export function isBusiness(userRole: string | undefined): boolean {
  return userRole === "business" || userRole === "admin";
}

export function getDefaultRouteForRole(role: string | undefined): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "moderator":
      return "/admin";
    case "seller":
      return "/seller";
    case "business":
      return "/business";
    default:
      return "/profile";
  }
}
