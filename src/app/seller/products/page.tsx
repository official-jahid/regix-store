import { Badge } from "@/components/shadcnui/badge";
import { Button } from "@/components/shadcnui/button";
import { Card, CardContent, CardTitle } from "@/components/shadcnui/card";
import { auth } from "@/lib/auth";
import { getSellerProducts } from "@/server/actions/product.actions";
import { Edit, Eye, Package, Plus } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SellerProductsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");
  if (session.user.role !== "seller" && session.user.role !== "admin")
    redirect("/");

  const products = await getSellerProducts(session.user.id);

  const statusVariant = (
    status: string,
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "published":
        return "default";
      case "pending_review":
        return "secondary";
      case "draft":
        return "outline";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Products</h1>
          <p className="text-muted-foreground">{products.length} products</p>
        </div>
        <Link href="/seller/products/new">
          <Button size="lg">
            <Plus /> Create Product
          </Button>
        </Link>
      </div>

      {products.length === 0 ?
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <Package className="text-muted-foreground/50 size-16" />
            <div>
              <h2 className="text-xl font-semibold">No products yet</h2>
              <p className="text-muted-foreground">
                Create your first product to start selling!
              </p>
            </div>
            <Link href="/seller/products/new">
              <Button size="lg">
                <Plus /> Create Your First Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      : <div className="grid gap-4">
          {products.map((product: any) => (
            <Card
              key={product.id}
              className="overflow-hidden">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="bg-muted size-16 shrink-0 overflow-hidden rounded-lg">
                  {product.media?.[0]?.url ?
                    <img
                      src={product.media[0].url}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  : <div className="flex h-full items-center justify-center">
                      <Package className="text-muted-foreground/50 size-6" />
                    </div>
                  }
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="line-clamp-1 text-base">
                      {product.title}
                    </CardTitle>
                    <Badge
                      variant={statusVariant(product.status)}
                      className="capitalize">
                      {product.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground mt-1 flex items-center gap-3 text-sm">
                    <span>{product.category?.name}</span>
                    <span>·</span>
                    <span className="text-foreground font-medium">
                      ${product.price.toFixed(2)}
                    </span>
                    <span>·</span>
                    <span>{product._count?.reviews || 0} reviews</span>
                    <span>·</span>
                    <span>{product._count?.ticketItems || 0} tickets</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/products/${product.slug}`}>
                    <Button
                      variant="ghost"
                      size="icon">
                      <Eye />
                    </Button>
                  </Link>
                  <Link href={`/seller/products/${product.id}/edit`}>
                    <Button
                      variant="ghost"
                      size="icon">
                      <Edit />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      }
    </div>
  );
}
