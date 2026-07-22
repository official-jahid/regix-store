import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  salePrice: z.number().positive().optional(),
  currency: z.string().default("USD"),
  categoryId: z.string().min(1, "Category is required"),
  licenseType: z.string().default("standard"),
  downloadLimit: z.number().int().positive().optional(),
  tags: z.array(z.string()).optional(),
  variants: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.number().positive(),
        fileUrl: z.string().optional(),
        fileSize: z.number().int().optional(),
        downloadLimit: z.number().int().positive().optional(),
        sortOrder: z.number().int().default(0),
      }),
    )
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  parentId: z.string().optional(),
  sortOrder: z.number().int().default(0),
  icon: z.string().optional(),
});

export const createTagSchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
