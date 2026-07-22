"use client";

import { Button } from "@/components/shadcnui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import { Field, FieldError, FieldLabel } from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { Separator } from "@/components/shadcnui/separator";
import { Textarea } from "@/components/shadcnui/textarea";
import { useSession } from "@/lib/auth-client";
import { createProductSchema } from "@/lib/schemas/product.schema";
import { createProduct, getCategories } from "@/server/actions/product.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Plus, Save, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateProductPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createProductSchema),
    mode: "all",
    defaultValues: {
      title: "",
      price: 0,
      currency: "USD",
      categoryId: "",
      licenseType: "standard",
      description: "",
      tags: [],
      variants: [],
    },
  });

  const {
    fields: variantFields,
    append: addVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const handleCreate = async (data: any, action: "draft" | "publish") => {
    setIsSubmitting(true);
    if (action === "draft") setIsSavingDraft(true);

    try {
      const result = await createProduct(data);
      if (result.success) {
        if (action === "publish") {
          const { submitForReview } =
            await import("@/server/actions/product.actions");
          await submitForReview(result.data.id);
        }
        toast.success(
          action === "publish" ?
            "Product submitted for review!"
          : "Product saved as draft!",
        );
        router.push("/seller/products");
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to create product");
        if (result.fieldErrors) {
          console.error(result.fieldErrors);
        }
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
      setIsSavingDraft(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
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
            <h1 className="text-2xl font-bold">Create Product</h1>
            <p className="text-muted-foreground text-sm">
              Add a new product to your catalog
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={isSubmitting}
            onClick={handleSubmit((data) => handleCreate(data, "draft"))}>
            {isSavingDraft ?
              <Loader2 className="animate-spin" />
            : <Save />}
            Save Draft
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={handleSubmit((data) => handleCreate(data, "publish"))}>
            {isSubmitting && !isSavingDraft ?
              <Loader2 className="animate-spin" />
            : <Send />}
            Submit for Review
          </Button>
        </div>
      </div>

      <form
        noValidate
        className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Product title, description, and pricing
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4 pt-4">
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Product Title *</FieldLabel>
                  <Input
                    {...field}
                    id="title"
                    placeholder="e.g. Premium Logo Template Pack"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    {...field}
                    id="description"
                    rows={5}
                    placeholder="Describe your product in detail..."
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="price"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="price">Price (USD) *</FieldLabel>
                    <Input
                      {...field}
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                      placeholder="29.99"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="salePrice"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="salePrice">
                      Sale Price (optional)
                    </FieldLabel>
                    <Input
                      {...field}
                      id="salePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ?
                            parseFloat(e.target.value)
                          : undefined,
                        )
                      }
                      placeholder="19.99"
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Category & License */}
        <Card>
          <CardHeader>
            <CardTitle>Category & Details</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="grid gap-4 pt-4 sm:grid-cols-2">
            <Controller
              name="categoryId"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="categoryId">Category *</FieldLabel>
                  <CategorySelect
                    value={field.value}
                    onChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="licenseType"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="licenseType">License Type</FieldLabel>
                  <select
                    {...field}
                    id="licenseType"
                    className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-lg border px-2.5 text-sm transition-colors focus-visible:ring-3 focus-visible:outline-none">
                    <option value="standard">Standard</option>
                    <option value="extended">Extended</option>
                    <option value="commercial">Commercial</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </Field>
              )}
            />
          </CardContent>
        </Card>

        {/* Variants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Variants (Optional)</CardTitle>
              <CardDescription>
                Different pricing tiers or formats
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                addVariant({
                  name: "",
                  price: 0,
                  sortOrder: variantFields.length,
                })
              }>
              <Plus /> Add Variant
            </Button>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            {variantFields.length === 0 ?
              <p className="text-muted-foreground py-4 text-center text-sm">
                No variants yet. Add pricing tiers if needed.
              </p>
            : <div className="space-y-3">
                {variantFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-end gap-3 rounded-lg border p-3">
                    <div className="flex-1 space-y-1">
                      <FieldLabel className="text-xs">Name</FieldLabel>
                      <Controller
                        name={`variants.${index}.name`}
                        control={control}
                        render={({ field: f }) => (
                          <Input
                            {...f}
                            placeholder="e.g. Pro License"
                          />
                        )}
                      />
                    </div>
                    <div className="w-32 space-y-1">
                      <FieldLabel className="text-xs">Price</FieldLabel>
                      <Controller
                        name={`variants.${index}.price`}
                        control={control}
                        render={({ field: f }) => (
                          <Input
                            {...f}
                            type="number"
                            min="0"
                            step="0.01"
                            onChange={(e) =>
                              f.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVariant(index)}>
                      <Trash2 className="text-destructive size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            }
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

// Category select component with server data
function CategorySelect({
  value,
  onChange,
  ...props
}: {
  value: string;
  onChange: (v: string) => void;
  [key: string]: any;
}) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useState(() => {
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  });

  if (loading)
    return (
      <div className="text-muted-foreground h-8 text-sm">
        Loading categories...
      </div>
    );

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-lg border px-2.5 text-sm transition-colors focus-visible:ring-3 focus-visible:outline-none"
      {...props}>
      <option value="">Select category...</option>
      {categories.map((cat) => (
        <option
          key={cat.id}
          value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
