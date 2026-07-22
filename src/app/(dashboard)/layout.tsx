import { Button } from "@/components/shadcnui/button";
import { auth } from "@/lib/auth";
import { getProfile } from "@/server/actions/profile.actions";
import {
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Store,
  Ticket,
  Users,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const profile = await getProfile();
  const role = session.user.role;
  const userName = session.user.name;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="bg-card/50 hidden w-64 shrink-0 border-r lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight">
              <span className="from-primary bg-linear-to-r to-blue-500 bg-clip-text text-transparent">
                REGIX
              </span>
            </Link>
            <p className="text-muted-foreground mt-1 text-xs capitalize">
              {role} Dashboard
            </p>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {role === "seller" || role === "admin" ?
              <>
                <SidebarLink
                  href="/seller"
                  icon={<LayoutDashboard />}
                  label="Dashboard"
                />
                <SidebarLink
                  href="/seller/products"
                  icon={<Package />}
                  label="My Products"
                />
                <SidebarLink
                  href="/seller/tickets"
                  icon={<Ticket />}
                  label="Tickets"
                />
                <SidebarLink
                  href="/seller/storefront"
                  icon={<Store />}
                  label="Storefront"
                />
                <SidebarLink
                  href="/seller/kyc"
                  icon={<FileText />}
                  label="KYC Verification"
                />
              </>
            : null}
            {role === "business" || role === "admin" ?
              <>
                <SidebarLink
                  href="/business"
                  icon={<ShoppingBag />}
                  label="Business"
                />
                <SidebarLink
                  href="/business/team"
                  icon={<Users />}
                  label="Team"
                />
              </>
            : null}
            {(role === "admin" || role === "moderator") && (
              <>
                <SidebarLink
                  href="/admin"
                  icon={<ShieldCheck />}
                  label="Admin"
                />
                <SidebarLink
                  href="/admin/users"
                  icon={<Users />}
                  label="Users"
                />
                <SidebarLink
                  href="/admin/products"
                  icon={<Package />}
                  label="Product Reviews"
                />
                <SidebarLink
                  href="/admin/kyc"
                  icon={<FileText />}
                  label="KYC Reviews"
                />
              </>
            )}
            <SidebarLink
              href="/profile"
              icon={<Settings />}
              label="Settings"
            />
          </nav>
          <div className="border-t p-4">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-muted-foreground text-xs">
              {session.user.email}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 lg:px-8">{children}</main>
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className="text-muted-foreground hover:text-foreground w-full justify-start gap-3">
        {icon}
        {label}
      </Button>
    </Link>
  );
}
