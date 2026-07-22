"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { createProductSchema } from "@/lib/schemas/product.schema";
import type { ActionResult } from "@/lib/types";
import { headers } from "next/headers";
import slugify from "slugify";
import { z } from "zod";

const securityCheck = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session;
};

const verifyOwnership = async (
  productId: string,
  userId: string,
  isAdmin: boolean,
) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");
  if (product.sellerId !== userId && !isAdmin)
    throw new Error("Forbidden: Not your product");
  return product;
};

const sanitizeNumber = (val: unknown, min = 0): number | undefined => {
  if (val === undefined || val === null) return undefined;
  const n = Number(val);
  return isNaN(n) || n < min ? undefined : n;
};

const sanitizeString = (val: unknown, maxLen = 500): string | undefined => {
  if (typeof val !== "string" || !val.trim()) return undefined;
  return val.substring(0, maxLen).trim();
};

// Audit log helper
async function logActivity(
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  metadata?: string,
) {
  await prisma.activityLog.create({
    data: {
      id: crypto.randomUUID(),
      userId,
      action,
      entityType,
      entityId,
      metadata,
    },
  });
}

// ============================================================
// CREATE
// ============================================================

export async function createProduct(
  input: z.infer<typeof createProductSchema>,
): Promise<ActionResult<{ id: string; slug: string }>> {
  const session = await securityCheck();
  if (session.user.role !== "seller" && session.user.role !== "admin") {
    return { success: false, error: "Only sellers can create products" };
  }

  const parsed = createProductSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const d = parsed.data;
    const title = sanitizeString(d.title, 200) || "";
    const slug =
      slugify(title, { lower: true, strict: true }) +
      "-" +
      crypto.randomUUID().slice(0, 8);
    const description = sanitizeString(d.description, 10000);
    const price = sanitizeNumber(d.price) || 0;
    const salePrice = sanitizeNumber(d.salePrice);
    const categoryId = sanitizeString(d.categoryId, 50) || "";

    const product = await prisma.product.create({
      data: {
        id: crypto.randomUUID(),
        sellerId: session.user.id,
        title,
        slug,
        description: description || "",
        price,
        salePrice:
          salePrice && salePrice > 0 && salePrice < price ? salePrice : null,
        currency: d.currency || "USD",
        categoryId,
        licenseType: d.licenseType || "standard",
        downloadLimit: sanitizeNumber(d.downloadLimit, 1),
        status: "draft",
        tags:
          d.tags?.length ?
            {
              create: d.tags.map((tagId) => ({
                id: crypto.randomUUID(),
                tagId,
              })),
            }
          : undefined,
        variants:
          d.variants?.length ?
            {
              create: d.variants.map((v) => ({
                id: crypto.randomUUID(),
                name: sanitizeString(v.name, 100) || "Variant",
                price: sanitizeNumber(v.price) || 0,
                fileUrl: v.fileUrl,
                fileSize: sanitizeNumber(v.fileSize),
                downloadLimit: sanitizeNumber(v.downloadLimit, 1),
                sortOrder: v.sortOrder || 0,
              })),
            }
          : undefined,
      },
    });

    await logActivity(session.user.id, "product:create", "product", product.id);
    return { success: true, data: { id: product.id, slug: product.slug } };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to create product",
    };
  }
}

// ============================================================
// UPDATE (FIELD-BY-FIELD — No mass assignment)
// ============================================================

const updateProductFieldSchema = z.object({
  productId: z.string().min(1),
  field: z.enum([
    "title",
    "description",
    "price",
    "salePrice",
    "currency",
    "categoryId",
    "licenseType",
    "downloadLimit",
    "isFeatured",
  ]),
  value: z.union([z.string(), z.number(), z.boolean(), z.null()]).optional(),
});

export async function updateProductField(
  input: z.infer<typeof updateProductFieldSchema>,
): Promise<ActionResult> {
  const session = await securityCheck();
  const isAdmin = session.user.role === "admin";

  const parsed = updateProductFieldSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { productId, field, value } = parsed.data;

  try {
    await verifyOwnership(productId, session.user.id, isAdmin);

    const updateData: Record<string, unknown> = {};

    switch (field) {
      case "title":
        updateData.title = sanitizeString(value, 200);
        if (!updateData.title)
          return { success: false, error: "Title cannot be empty" };
        updateData.slug =
          slugify(updateData.title as string, { lower: true, strict: true }) +
          "-" +
          crypto.randomUUID().slice(0, 8);
        break;
      case "description":
        updateData.description = sanitizeString(value, 10000) || "";
        break;
      case "price":
        const p = sanitizeNumber(value);
        if (!p || p <= 0)
          return { success: false, error: "Price must be positive" };
        updateData.price = p;
        break;
      case "salePrice":
        updateData.salePrice = value === null ? null : sanitizeNumber(value);
        break;
      case "currency":
        updateData.currency = String(value || "USD").substring(0, 5);
        break;
      case "categoryId":
        updateData.categoryId = sanitizeString(value, 50);
        break;
      case "licenseType":
        updateData.licenseType = String(value || "standard").substring(0, 50);
        break;
      case "downloadLimit":
        updateData.downloadLimit =
          value === null ? null : sanitizeNumber(value, 1);
        break;
      case "isFeatured":
        if (!isAdmin)
          return { success: false, error: "Only admins can feature products" };
        updateData.isFeatured = Boolean(value);
        break;
      default:
        return { success: false, error: "Invalid field" };
    }

    await prisma.product.update({ where: { id: productId }, data: updateData });

    if (
      isAdmin &&
      session.user.id !==
        (await prisma.product.findUnique({ where: { id: productId } }))
          ?.sellerId
    ) {
      await logActivity(
        session.user.id,
        `admin:product:update_${field}`,
        "product",
        productId,
        JSON.stringify({ field, value }),
      );
    }

    return { success: true, data: undefined };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to update product",
    };
  }
}

// Add product media
export async function addProductMedia(
  productId: string,
  url: string,
  type = "image",
  alt?: string,
): Promise<ActionResult> {
  const session = await securityCheck();
  try {
    await verifyOwnership(
      productId,
      session.user.id,
      session.user.role === "admin",
    );

    const count = await prisma.productMedia.count({ where: { productId } });
    await prisma.productMedia.create({
      data: {
        id: crypto.randomUUID(),
        productId,
        url,
        type,
        sortOrder: count,
        isPrimary: count === 0,
        alt: alt ? alt.substring(0, 200) : undefined,
      },
    });

    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

// Delete product media
export async function deleteProductMedia(
  mediaId: string,
): Promise<ActionResult> {
  const session = await securityCheck();
  const media = await prisma.productMedia.findUnique({
    where: { id: mediaId },
  });
  if (!media) return { success: false, error: "Media not found" };
  try {
    await verifyOwnership(
      media.productId,
      session.user.id,
      session.user.role === "admin",
    );
    await prisma.productMedia.delete({ where: { id: mediaId } });
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

// ============================================================
// QUERIES
// ============================================================

export async function getProducts(options?: {
  categoryId?: string;
  status?: string;
  sellerId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const where: Record<string, unknown> = {};
  if (options?.categoryId) where.categoryId = options.categoryId;
  if (options?.status) where.status = options.status;
  else where.status = "published";
  if (options?.sellerId) where.sellerId = options.sellerId;
  if (options?.search) {
    where.OR = [
      { title: { contains: options.search } },
      { description: { contains: options.search } },
    ];
  }

  const limit = Math.min(options?.limit || 20, 100);
  const page = Math.max(options?.page || 1, 1);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        media: {
          where: { isPrimary: true },
          take: 1,
          orderBy: { sortOrder: "asc" as const },
        },
        seller: { select: { id: true, name: true, image: true } },
        tags: { include: { tag: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { items: products, total, hasMore: page * limit < total };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      media: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
      tags: { include: { tag: true } },
      seller: {
        select: {
          id: true,
          name: true,
          image: true,
          sellerProfile: {
            select: {
              storeName: true,
              storeSlug: true,
              logoUrl: true,
              verificationStatus: true,
            },
          },
        },
      },
      reviews: {
        include: {
          user: { select: { id: true, name: true, image: true } },
          response: { include: { seller: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { reviews: true } },
    },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      media: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
      tags: { include: { tag: true } },
      seller: { select: { id: true, name: true } },
    },
  });
}

export async function getSellerProducts(sellerId: string) {
  const session = await securityCheck();
  if (session.user.id !== sellerId && session.user.role !== "admin") return [];

  return prisma.product.findMany({
    where: { sellerId },
    include: {
      category: true,
      media: { where: { isPrimary: true }, take: 1 },
      _count: { select: { reviews: true, ticketItems: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function submitForReview(
  productId: string,
): Promise<ActionResult> {
  const session = await securityCheck();
  try {
    await verifyOwnership(
      productId,
      session.user.id,
      session.user.role === "admin",
    );
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (product?.status !== "draft" && product?.status !== "rejected") {
      return {
        success: false,
        error: `Cannot submit product in ${product?.status} status`,
      };
    }
    await prisma.product.update({
      where: { id: productId },
      data: { status: "pending_review" },
    });
    await logActivity(
      session.user.id,
      "product:submit_review",
      "product",
      productId,
    );
    return { success: true, data: undefined };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to submit for review",
    };
  }
}

export async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getTags() {
  return prisma.tag.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}
