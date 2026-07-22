import type { Role } from "@/lib/types";
import { atom } from "jotai";

export const userAtom = atom<{
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
} | null>(null);

export const themeAtom = atom<"light" | "dark">("dark");

export const cartCountAtom = atom(0);

export const wishlistAtom = atom<string[]>([]);

export const unreadNotificationsAtom = atom(0);

export const isSellerAtom = atom((get) => {
  const user = get(userAtom);
  return user?.role === "seller" || user?.role === "admin";
});

export const isAdminAtom = atom((get) => {
  const user = get(userAtom);
  return user?.role === "admin" || user?.role === "moderator";
});

export const isBusinessAtom = atom((get) => {
  const user = get(userAtom);
  return user?.role === "business" || user?.role === "admin";
});
