import { z } from "zod";

export const createSubscriptionBoxSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/),
  tier: z.enum(["basic", "pro", "enterprise"]).default("basic"),
  price: z.number().positive("Price must be positive"),
  frequency: z.enum(["monthly", "quarterly"]).default("monthly"),
  imageUrl: z.string().url().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive().default(1),
        isOptional: z.boolean().default(false),
      }),
    )
    .optional(),
});

export const subscribeToBoxSchema = z.object({
  boxId: z.string().min(1),
});

export const updateSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1),
  status: z.enum(["paused", "cancelled"]),
});

export const createAnnouncementSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  type: z.enum(["info", "warning", "update"]).default("info"),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const createFeatureFlagSchema = z.object({
  name: z
    .string()
    .min(1)
    .regex(/^[a-z0-9_-]+$/),
  description: z.string().optional(),
  enabled: z.boolean().default(false),
  rolloutPercentage: z.number().int().min(0).max(100).default(100),
});

export const createCommissionRuleSchema = z.object({
  categoryId: z.string().optional(),
  sellerTier: z.string().default("standard"),
  percentage: z.number().min(0).max(100),
});

export type CreateSubscriptionBoxInput = z.infer<
  typeof createSubscriptionBoxSchema
>;
export type SubscribeToBoxInput = z.infer<typeof subscribeToBoxSchema>;
export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
export type CreateFeatureFlagInput = z.infer<typeof createFeatureFlagSchema>;
