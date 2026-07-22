import { Badge } from "@/components/shadcnui/badge";
import { Button } from "@/components/shadcnui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import {
  getCategories,
  getProductBySlug,
} from "@/server/actions/product.actions";
import { Heart, ShoppingCart, Star, Store } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, categories] = await Promise.all([
    getProductBySlug(slug),
    getCategories(),
  ]);

  if (!product) notFound();

  const avgRating =
    product.reviews?.length ?
      product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
      product.reviews.length
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumbs */}
      <div className="text-muted-foreground mb-6 flex items-center gap-2 text-sm">
        <Link
          href="/"
          className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/products"
          className="hover:text-foreground">
          Products
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.title}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="bg-muted aspect-square overflow-hidden rounded-xl">
            {product.media?.[0]?.url ?
              <img
                src={product.media[0].url}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            : <div className="flex h-full items-center justify-center">
                <Store className="text-muted-foreground/50 size-24" />
              </div>
            }
          </div>
          {product.media?.length > 1 && (
            <div className="flex gap-2">
              {product.media.map((m: any) => (
                <div
                  key={m.id}
                  className="bg-muted size-20 overflow-hidden rounded-lg">
                  <img
                    src={m.url}
                    alt={m.alt || ""}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <Badge
            variant="secondary"
            className="mb-3">
            {product.category?.name}
          </Badge>
          <h1 className="mb-4 text-3xl font-bold">{product.title}</h1>

          {/* Rating */}
          {avgRating > 0 && (
            <div className="mb-4 flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`size-4 ${star <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-sm">
                {avgRating.toFixed(1)} ({product._count?.reviews} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mb-6">
            {product.salePrice ?
              <div className="flex items-center gap-2">
                <span className="text-primary text-3xl font-bold">
                  ${product.salePrice.toFixed(2)}
                </span>
                <span className="text-muted-foreground text-xl line-through">
                  ${product.price.toFixed(2)}
                </span>
                <Badge variant="destructive">Sale</Badge>
              </div>
            : <span className="text-primary text-3xl font-bold">
                ${product.price.toFixed(2)}
              </span>
            }
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-6">
            {product.description || "No description provided."}
          </p>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 font-semibold">Available Options</h3>
              <div className="space-y-2">
                {product.variants.map((v: any) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between rounded-lg border p-3">
                    <span className="font-medium">{v.name}</span>
                    <span className="font-bold">${v.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="flex-1">
              <ShoppingCart /> Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon">
              <Heart />
            </Button>
          </div>

          {/* Seller Info */}
          <div className="mt-6 rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
                <Store className="text-primary size-5" />
              </div>
              <div>
                <p className="font-medium">
                  {product.seller?.sellerProfile?.storeName ||
                    product.seller?.name}
                </p>
                {product.seller?.sellerProfile?.verificationStatus ===
                  "verified" && (
                  <Badge
                    variant="default"
                    className="text-xs">
                    Verified Seller
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Reviews ({product._count?.reviews})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.reviews.map((review: any) => (
              <div
                key={review.id}
                className="border-b pb-4 last:border-0">
                <div className="mb-2 flex items-center gap-2">
                  <div className="bg-muted flex size-8 items-center justify-center rounded-full text-xs font-medium">
                    {review.user?.name?.[0] || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{review.user?.name}</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`size-3 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  {review.content}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
