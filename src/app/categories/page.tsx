import { Card, CardContent, CardTitle } from "@/components/shadcnui/card";
import { getCategories } from "@/server/actions/product.actions";
import { Tag } from "lucide-react";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Browse Categories</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat: any) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}>
            <Card className="transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-full">
                  <Tag className="text-primary size-6" />
                </div>
                <CardTitle className="mb-1">{cat.name}</CardTitle>
                <p className="text-muted-foreground text-sm">
                  {cat.description || `${cat._count?.products || 0} products`}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
