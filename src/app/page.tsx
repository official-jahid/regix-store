import { Badge } from "@/components/shadcnui/badge";
import { Button } from "@/components/shadcnui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/shadcnui/card";
import { getCategories, getProducts } from "@/server/actions/product.actions";
import { ArrowRight, Search, Sparkles, Tag, Users } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getProducts({ status: "published", limit: 8 }),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b px-4 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge
            variant="secondary"
            className="mb-6 gap-1.5 px-4 py-1.5 text-sm">
            <Sparkles className="size-3" />
            Buy your need — ticket-based marketplace
          </Badge>
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
            Digital Products,{" "}
            <span className="from-primary bg-linear-to-r to-blue-500 bg-clip-text text-transparent">
              Your Way
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
            Browse thousands of digital products from independent creators.
            Express your interest through tickets, negotiate with sellers, and
            get secure downloads upon approval.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/products">
              <Button size="lg">
                <Search />
                Browse Products
                <ArrowRight />
              </Button>
            </Link>
            <Link href="/seller">
              <Button
                variant="outline"
                size="lg">
                <Users />
                Become a Seller
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-2xl font-bold">Explore Categories</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.slice(0, 8).map((cat: any) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}>
                <Card className="transition-all hover:shadow-lg">
                  <CardContent className="pt-4">
                    <Tag className="text-primary/70 mb-3 size-8" />
                    <h3 className="mb-1 font-semibold">{cat.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {cat._count?.products || 0} products
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/products">
              <Button variant="link">
                View all <ArrowRight />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.items.map((product: any) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}>
                <Card className="overflow-hidden transition-all hover:shadow-lg">
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
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-12 text-2xl font-bold">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Browse & Find",
                desc: "Explore thousands of digital products across categories",
              },
              {
                step: "2",
                title: "Create Ticket",
                desc: "Express interest with your requirements and budget",
              },
              {
                step: "3",
                title: "Get Approved",
                desc: "Seller reviews, you negotiate, and get download access",
              },
            ].map((item) => (
              <Card key={item.step}>
                <CardContent className="pt-6 text-center">
                  <div className="bg-primary/10 text-primary mx-auto mb-4 flex size-12 items-center justify-center rounded-full text-xl font-bold">
                    {item.step}
                  </div>
                  <CardTitle className="mb-2">{item.title}</CardTitle>
                  <CardDescription>{item.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
