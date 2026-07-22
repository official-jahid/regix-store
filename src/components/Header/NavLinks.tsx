"use client";

import {
  LayoutDashboard,
  Package,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import Link from "next/link";

interface Props {
  role?: string;
  onItemClick?: () => void;
}

const baseLink =
  "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

export default function NavLinks({ role, onItemClick }: Props) {
  const handleClick = () => onItemClick?.();

  return (
    <>
      {/* Public links */}
      <Link
        href="/"
        className={baseLink}
        onClick={handleClick}>
        Home
      </Link>
      <Link
        href="/products"
        className={baseLink}
        onClick={handleClick}>
        Products
      </Link>
      <Link
        href="/categories"
        className={baseLink}
        onClick={handleClick}>
        Categories
      </Link>

      {/* Seller links */}
      {(role === "seller" || role === "admin") && (
        <>
          <Link
            href="/seller"
            className={baseLink}
            onClick={handleClick}>
            <span className="flex items-center gap-1.5">
              <LayoutDashboard className="h-4 w-4" />
              Seller Dashboard
            </span>
          </Link>
          <Link
            href="/seller/products"
            className={baseLink}
            onClick={handleClick}>
            <span className="flex items-center gap-1.5">
              <Package className="h-4 w-4" />
              My Products
            </span>
          </Link>
        </>
      )}

      {/* Admin links */}
      {(role === "admin" || role === "moderator") && (
        <>
          <Link
            href="/admin"
            className={baseLink}
            onClick={handleClick}>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              Admin
            </span>
          </Link>
          <Link
            href="/admin/users"
            className={baseLink}
            onClick={handleClick}>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              Users
            </span>
          </Link>
        </>
      )}

      {/* Business links */}
      {(role === "business" || role === "admin") && (
        <Link
          href="/business"
          className={baseLink}
          onClick={handleClick}>
          <ShoppingBag className="mr-1.5 inline h-4 w-4" />
          Business
        </Link>
      )}
    </>
  );
}
