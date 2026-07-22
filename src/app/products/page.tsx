import { Card, CardContent, CardTitle } from "@/components/shadcnui/card";
import { getCategories, getProducts } from "@/server/actions/product.actions";
import { Package } from "lucide-react";
import Link from "next/link";

export default async function ProductsPage() {
  const [productsData, categories] = await Promise.all([
    getProducts({ status: "published", limit: 20 }),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <h1 className="text-3xl font-bold">All Products</h1>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="hover:bg-muted rounded-full border px-3 py-1 text-xs transition-colors">
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {productsData.items.length === 0 ?
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <Package className="text-muted-foreground size-16" />
          <h2 className="text-xl font-semibold">No products yet</h2>
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
                  <p className="text-muted-foreground mb-1 text-xs">
                    {product.category?.name}
                  </p>
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
