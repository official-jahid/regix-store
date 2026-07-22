import { z } from "zod";

export const createTicketSchema = z.object({
  sellerId: z.string().min(1, "Seller is required"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().optional(),
        quantity: z.number().int().positive().default(1),
      }),
    )
    .min(1, "At least one product is required"),
  intentMessage: z.string().max(2000).optional(),
  companyInfo: z.string().optional(),
  department: z.string().optional(),
  budget: z.number().positive().optional(),
  deadline: z.string().datetime().optional(),
});

export const sendMessageSchema = z.object({
  ticketId: z.string().min(1),
  content: z.string().min(1, "Message cannot be empty").max(5000),
  attachmentUrl: z.string().url().optional(),
});

export const updateTicketStatusSchema = z.object({
  ticketId: z.string().min(1),
  status: z.enum([
    "under_review",
    "contacted",
    "negotiating",
    "approved",
    "rejected",
    "cancelled",
  ]),
  reason: z.string().max(500).optional(),
});

export const addToCartSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  quantity: z.number().int().positive().default(1),
});

export const updateCartItemSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const createReviewSchema = z.object({
  productId: z.string().min(1),
  ticketId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  content: z.string().max(2000).optional(),
});

export const respondToReviewSchema = z.object({
  reviewId: z.string().min(1),
  content: z.string().min(1).max(2000),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
