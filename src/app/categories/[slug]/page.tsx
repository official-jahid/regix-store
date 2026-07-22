import { Card, CardContent, CardTitle } from "@/components/shadcnui/card";
import prisma from "@/lib/database/dbClient";
import { getProducts } from "@/server/actions/product.actions";
import { Package } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const productsData = await getProducts({
    categoryId: category.id,
    status: "published",
    limit: 50,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <Link
          href="/categories"
          className="text-muted-foreground hover:text-foreground mb-2 inline-block text-sm">
          ← All Categories
        </Link>
        <h1 className="text-3xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground mt-2">{category.description}</p>
        )}
        <p className="text-muted-foreground mt-1 text-sm">
          {productsData.total} products
        </p>
      </div>

      {productsData.items.length === 0 ?
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <Package className="text-muted-foreground size-16" />
          <h2 className="text-xl font-semibold">
            No products in this category
          </h2>
          <p className="text-muted-foreground">
            Check back later for new products!
          </p>
        </div>
      : <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productsData.items.map((product: any) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}>
              <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
                <div className="bg-muted aspect-square">
                  {product.media?.[0]?.url && (
                    <img
                      src={product.media[0].url}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <CardContent className="pt-4">
                  <CardTitle className="mb-2 line-clamp-1">
                    {product.title}
                  </CardTitle>
                  <div className="flex items-center justify-between">
                    <span className="text-primary text-lg font-bold">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {product.seller?.name}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      }
    </div>
  );
}
