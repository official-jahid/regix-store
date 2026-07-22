import { Button } from "@/components/shadcnui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import { auth } from "@/lib/auth";
import { getSellerProducts } from "@/server/actions/product.actions";
import { getProfile } from "@/server/actions/profile.actions";
import { DollarSign, Package, Plus, ShoppingBag, Ticket } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SellerDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");
  if (session.user.role !== "seller" && session.user.role !== "admin")
    redirect("/");

  const profile = await getProfile();
  const products = await getSellerProducts(session.user.id);
  const publishedProducts = products.filter(
    (p: any) => p.status === "published",
  );
  const ticketCount = 0; // Can be extended

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground">
            {profile?.sellerProfile?.storeName ||
              "Welcome to your seller dashboard!"}
          </p>
        </div>
        <Link href="/seller/products/new">
          <Button size="lg">
            <Plus />
            Create Product
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
              <Package className="text-primary size-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="text-muted-foreground text-xs">Total Products</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-green-500/10">
              <ShoppingBag className="size-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{publishedProducts.length}</p>
              <p className="text-muted-foreground text-xs">Published</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-blue-500/10">
              <Ticket className="size-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{ticketCount}</p>
              <p className="text-muted-foreground text-xs">Tickets</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-purple-500/10">
              <DollarSign className="size-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">$0</p>
              <p className="text-muted-foreground text-xs">Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/seller/products">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <Package className="text-primary mb-2 size-8" />
              <CardTitle>My Products</CardTitle>
              <CardDescription>Manage your product catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                {products.length} products · {publishedProducts.length}{" "}
                published
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/seller/tickets">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <Ticket className="mb-2 size-8 text-blue-500" />
              <CardTitle>Incoming Tickets</CardTitle>
              <CardDescription>Review buyer purchase requests</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Manage ticket approvals
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/seller/storefront">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <ShoppingBag className="mb-2 size-8 text-purple-500" />
              <CardTitle>Storefront</CardTitle>
              <CardDescription>Customize your public store</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Banner, logo, and description
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
