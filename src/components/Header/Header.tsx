"use client";

import { getDefaultRouteForRole } from "@/lib/permissions";
import {
  Bell,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Store,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import NavLinks from "./NavLinks";

interface HeaderProps {
  session?: {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      role: string;
    };
  } | null;
}

export default function Header({ session }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  const user = session?.user;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
      router.refresh();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="border-border/40 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Store className="text-primary h-6 w-6" />
          <span className="from-primary bg-linear-to-r to-blue-500 bg-clip-text text-transparent">
            REGIX
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLinks role={user?.role as string} />
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/products"
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-colors">
            <Search className="h-5 w-5" />
          </Link>

          {user ?
            <>
              <Link
                href="/wishlist"
                className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-colors">
                <Heart className="h-5 w-5" />
              </Link>
              <Link
                href="/cart"
                className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-colors">
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <Link
                href="/notifications"
                className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-colors">
                <Bell className="h-5 w-5" />
              </Link>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hover:bg-muted flex items-center gap-2 rounded-lg p-1.5 transition-colors">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    {user.image ?
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    : <User className="text-primary h-4 w-4" />}
                  </div>
                  <span className="hidden text-sm font-medium lg:inline">
                    {user.name}
                  </span>
                  <ChevronDown className="text-muted-foreground h-4 w-4" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="border-border bg-popover absolute right-0 z-50 mt-2 w-56 rounded-xl border p-2 shadow-lg">
                      <div className="border-border border-b px-3 py-2">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="hover:bg-muted flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                          onClick={() => setUserMenuOpen(false)}>
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          href={getDefaultRouteForRole(user.role)}
                          className="hover:bg-muted flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                          onClick={() => setUserMenuOpen(false)}>
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/settings"
                          className="hover:bg-muted flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                          onClick={() => setUserMenuOpen(false)}>
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                        {user.role === "admin" && (
                          <Link
                            href="/admin"
                            className="text-primary hover:bg-muted flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                            onClick={() => setUserMenuOpen(false)}>
                            <ShieldCheck className="h-4 w-4" />
                            Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="border-border border-t pt-1">
                        <button
                          onClick={handleLogout}
                          className="hover:bg-muted flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors">
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          : <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hover:bg-muted rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                Register
              </Link>
            </div>
          }
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 md:hidden">
          {mobileOpen ?
            <X className="h-6 w-6" />
          : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-border bg-background border-t p-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <NavLinks
              role={user?.role as string}
              onItemClick={() => setMobileOpen(false)}
            />
          </nav>
          {!user && (
            <div className="border-border mt-4 flex gap-2 border-t pt-4">
              <Link
                href="/login"
                className="border-border flex-1 rounded-lg border px-4 py-2 text-center text-sm font-medium"
                onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link
                href="/register"
                className="bg-primary text-primary-foreground flex-1 rounded-lg px-4 py-2 text-center text-sm font-medium"
                onClick={() => setMobileOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
