"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import type { ActionResult } from "@/lib/types";
import { headers } from "next/headers";
import { z } from "zod";

const securityCheck = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session;
};

const sanitizeString = (val: unknown, maxLen = 500): string | undefined => {
  if (typeof val !== "string" || !val.trim()) return undefined;
  return val.substring(0, maxLen).trim();
};

export async function getProfile() {
  const session = await securityCheck();

  const [user, profile, sellerProfile, businessProfile] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    }),
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
    prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
      include: { kycSubmission: true },
    }),
    prisma.businessProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        teamMembers: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
      },
    }),
  ]);

  return { user, profile, sellerProfile, businessProfile };
}

// ============================================================
// FIELD-BY-FIELD UPDATES (No mass assignment)
// ============================================================

const updateProfileFieldSchema = z.object({
  field: z.enum([
    "name",
    "phone",
    "bio",
    "website",
    "location",
    "socialLinks",
    "avatarUrl",
  ]),
  value: z.union([z.string(), z.null()]).optional(),
});

export async function updateProfileField(
  input: z.infer<typeof updateProfileFieldSchema>,
): Promise<ActionResult> {
  const session = await securityCheck();

  const parsed = updateProfileFieldSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { field, value } = parsed.data;

  try {
    switch (field) {
      case "name": {
        const name = sanitizeString(value, 100);
        if (!name) return { success: false, error: "Name cannot be empty" };
        await prisma.user.update({
          where: { id: session.user.id },
          data: { name },
        });
        break;
      }
      case "phone": {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { phone: value ? String(value).substring(0, 20) : null },
        });
        break;
      }
      case "bio":
      case "website":
      case "location":
      case "socialLinks": {
        await prisma.profile.upsert({
          where: { userId: session.user.id },
          update: {
            [field]:
              value ? sanitizeString(value, field === "bio" ? 500 : 200) : null,
          },
          create: {
            id: crypto.randomUUID(),
            userId: session.user.id,
            [field]:
              value ? sanitizeString(value, field === "bio" ? 500 : 200) : null,
          },
        });
        break;
      }
      case "avatarUrl": {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { image: value ? sanitizeString(value, 500) : null },
        });
        break;
      }
      default:
        return { success: false, error: "Invalid field" };
    }

    return { success: true, data: undefined };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to update profile",
    };
  }
}

// ============================================================
// SELLER PROFILE UPDATES (Separate, field-by-field)
// ============================================================

const updateSellerFieldSchema = z.object({
  field: z.enum([
    "storeName",
    "storeSlug",
    "storeDescription",
    "bannerUrl",
    "logoUrl",
  ]),
  value: z.union([z.string(), z.null()]).optional(),
});

export async function updateSellerField(
  input: z.infer<typeof updateSellerFieldSchema>,
): Promise<ActionResult> {
  const session = await securityCheck();
  if (session.user.role !== "seller" && session.user.role !== "admin") {
    return { success: false, error: "Only sellers can update store profiles" };
  }

  const parsed = updateSellerFieldSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid input" };

  const { field, value } = parsed.data;

  try {
    const existing = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!existing)
      return {
        success: false,
        error: "Seller profile not found. Create one first.",
      };

    const updateData: Record<string, unknown> = {};
    const maxLen =
      field === "storeDescription" ? 1000
      : field === "storeSlug" ? 50
      : 200;

    switch (field) {
      case "storeName":
        updateData.storeName = sanitizeString(value, 200);
        if (!updateData.storeName)
          return { success: false, error: "Store name cannot be empty" };
        break;
      case "storeSlug":
        updateData.storeSlug = sanitizeString(value, 50)?.replace(
          /[^a-z0-9-]/g,
          "",
        );
        if (!updateData.storeSlug)
          return { success: false, error: "Invalid store slug" };
        break;
      case "storeDescription":
        updateData.storeDescription = sanitizeString(value, 1000);
        break;
      case "bannerUrl":
        updateData.bannerUrl = value ? sanitizeString(value, 500) : null;
        break;
      case "logoUrl":
        updateData.logoUrl = value ? sanitizeString(value, 500) : null;
        break;
      default:
        return { success: false, error: "Invalid field" };
    }

    await prisma.sellerProfile.update({
      where: { id: existing.id },
      data: updateData,
    });
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update" };
  }
}

export async function createSellerProfile(input: {
  storeName: string;
  storeSlug: string;
  storeDescription?: string;
}): Promise<ActionResult> {
  const session = await securityCheck();
  if (session.user.role !== "seller" && session.user.role !== "admin") {
    return { success: false, error: "Only sellers can create store profiles" };
  }

  try {
    const existing = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (existing)
      return { success: false, error: "Seller profile already exists" };

    await prisma.sellerProfile.create({
      data: {
        id: crypto.randomUUID(),
        userId: session.user.id,
        storeName: sanitizeString(input.storeName, 200) || "My Store",
        storeSlug:
          sanitizeString(input.storeSlug, 50)?.replace(/[^a-z0-9-]/g, "") ||
          "store-" + session.user.id.slice(0, 8),
        storeDescription: sanitizeString(input.storeDescription, 1000),
      },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "seller" },
    });
    return { success: true, data: undefined };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to create seller profile",
    };
  }
}

export async function submitKYC(input: {
  documentType: string;
  documentUrl: string;
}): Promise<ActionResult> {
  const session = await securityCheck();

  try {
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!sellerProfile)
      return { success: false, error: "Seller profile not found" };

    await prisma.kYCSubmission.upsert({
      where: { sellerId: sellerProfile.id },
      update: {
        documentType: sanitizeString(input.documentType, 50) || "identity",
        documentUrl: sanitizeString(input.documentUrl, 500) || "",
        status: "pending",
        submittedAt: new Date(),
      },
      create: {
        id: crypto.randomUUID(),
        sellerId: sellerProfile.id,
        documentType: sanitizeString(input.documentType, 50) || "identity",
        documentUrl: sanitizeString(input.documentUrl, 500) || "",
        status: "pending",
      },
    });

    await prisma.sellerProfile.update({
      where: { id: sellerProfile.id },
      data: { kycStatus: "pending" },
    });
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to submit KYC" };
  }
}
