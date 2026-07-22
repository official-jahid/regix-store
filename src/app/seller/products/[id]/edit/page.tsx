"use client";

import { Badge } from "@/components/shadcnui/badge";
import { Button } from "@/components/shadcnui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import { Separator } from "@/components/shadcnui/separator";
import InlineEdit from "@/components/shared/InlineEdit";
import {
  addProductMedia,
  deleteProductMedia,
  getCategories,
  getProductById,
  updateProductField,
} from "@/server/actions/product.actions";
import {
  ArrowLeft,
  Image as ImageIcon,
  Package,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Wrap InlineEdit save handler per field
function useFieldSave(productId: string, field: string) {
  return async (value: string) => {
    const numVal =
      ["price", "salePrice", "downloadLimit"].includes(field) ?
        Number(value)
      : value;
    const result = await updateProductField({
      productId,
      field: field as any,
      value:
        field === "description" ? value
        : (
          field === "price" ||
          field === "salePrice" ||
          field === "downloadLimit"
        ) ?
          numVal
        : value,
    });
    return result;
  };
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [p, cats] = await Promise.all([
        getProductById(productId),
        getCategories(),
      ]);
      setProduct(p);
      setCategories(cats);
      setLoading(false);
    }
    load();
  }, [productId]);

  const handleAddMedia = async () => {
    const url = prompt("Enter image URL:");
    if (!url) return;
    const result = await addProductMedia(productId, url);
    if (result.success) {
      toast.success("Media added");
      const p = await getProductById(productId);
      setProduct(p);
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    const result = await deleteProductMedia(mediaId);
    if (result.success) {
      toast.success("Media removed");
      const p = await getProductById(productId);
      setProduct(p);
    } else {
      toast.error(result.error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-muted-foreground animate-pulse">
          Loading product...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center gap-4 py-24">
        <Package className="text-muted-foreground size-16" />
        <h2 className="text-xl font-semibold">Product not found</h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/seller/products">
            <Button
              variant="ghost"
              size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground text-sm">
              Click any field to edit
            </p>
          </div>
        </div>
        <Badge
          variant="secondary"
          className="capitalize">
          {product.status.replace("_", " ")}
        </Badge>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Click on any field to edit it inline
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4 pt-4">
          <div>
            <span className="text-muted-foreground text-xs font-medium">
              Title
            </span>
            <InlineEdit
              value={product.title}
              onSave={useFieldSave(productId, "title")}
              placeholder="Product title"
              className="text-lg font-semibold"
            />
          </div>
          <div>
            <span className="text-muted-foreground text-xs font-medium">
              Description
            </span>
            <InlineEdit
              value={product.description || ""}
              onSave={useFieldSave(productId, "description")}
              type="textarea"
              placeholder="Add a description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground text-xs font-medium">
                Price
              </span>
              <InlineEdit
                value={product.price}
                onSave={useFieldSave(productId, "price")}
                type="number"
                className="text-primary text-xl font-bold"
              />
            </div>
            <div>
              <span className="text-muted-foreground text-xs font-medium">
                Sale Price
              </span>
              <InlineEdit
                value={product.salePrice ?? "none"}
                onSave={useFieldSave(productId, "salePrice")}
                type="number"
                placeholder="No sale price"
                className="text-xl"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-muted-foreground text-xs font-medium">
                Currency
              </span>
              <InlineEdit
                value={product.currency}
                onSave={useFieldSave(productId, "currency")}
                placeholder="USD"
              />
            </div>
            <div>
              <span className="text-muted-foreground text-xs font-medium">
                License
              </span>
              <InlineEdit
                value={product.licenseType}
                onSave={useFieldSave(productId, "licenseType")}
                placeholder="standard"
              />
            </div>
            <div>
              <span className="text-muted-foreground text-xs font-medium">
                Category
              </span>
              <InlineEdit
                value={product.category?.name || "Select..."}
                onSave={useFieldSave(productId, "categoryId")}
                placeholder="Select category"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>Manage product gallery</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddMedia}>
            <Upload /> Add Image
          </Button>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          {!product.media || product.media.length === 0 ?
            <div className="text-muted-foreground flex flex-col items-center gap-2 py-8 text-center">
              <ImageIcon className="size-8" />
              <p className="text-sm">No images yet</p>
            </div>
          : <div className="grid grid-cols-4 gap-4">
              {product.media.map((m: any) => (
                <div
                  key={m.id}
                  className="group relative overflow-hidden rounded-lg border">
                  <img
                    src={m.url}
                    alt={m.alt || product.title}
                    className="aspect-square w-full object-cover"
                  />
                  {m.isPrimary && (
                    <Badge
                      variant="default"
                      className="absolute top-1 left-1 text-xs">
                      <Star className="size-2" />
                    </Badge>
                  )}
                  <button
                    onClick={() => handleDeleteMedia(m.id)}
                    className="absolute top-1 right-1 rounded-full bg-red-500 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Trash2 className="size-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          }
        </CardContent>
      </Card>
    </div>
  );
}
