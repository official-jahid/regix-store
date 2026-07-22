"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import {
  addToCartSchema,
  createReviewSchema,
  createTicketSchema,
  sendMessageSchema,
  updateTicketStatusSchema,
} from "@/lib/schemas/ticket.schema";
import type { ActionResult } from "@/lib/types";
import { headers } from "next/headers";
import { z } from "zod";

// ============================================================
// CART ACTIONS
// ============================================================

export async function addToCart(
  input: z.infer<typeof addToCartSchema>,
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const parsed = addToCartSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      error: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };

  try {
    const { productId, variantId, quantity } = parsed.data;
    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId_variantId: {
          userId: session.user.id,
          productId,
          variantId: variantId || "",
        },
      },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          id: crypto.randomUUID(),
          userId: session.user.id,
          productId,
          variantId: variantId || null,
          quantity,
        },
      });
    }

    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to add to cart" };
  }
}

export async function removeFromCart(itemId: string): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.cartItem.deleteMany({
      where: { id: itemId, userId: session.user.id },
    });
    return { success: true, data: undefined };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to remove from cart",
    };
  }
}

export async function getCart() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];

  return prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          salePrice: true,
          currency: true,
          media: { where: { isPrimary: true }, take: 1 },
          seller: { select: { id: true, name: true } },
        },
      },
      variant: true,
    },
    orderBy: { addedAt: "desc" },
  });
}

export async function toggleWishlist(
  productId: string,
): Promise<ActionResult<{ wishlisted: boolean }>> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId: session.user.id, productId } },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return { success: true, data: { wishlisted: false } };
    } else {
      await prisma.wishlistItem.create({
        data: { id: crypto.randomUUID(), userId: session.user.id, productId },
      });
      return { success: true, data: { wishlisted: true } };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to toggle wishlist",
    };
  }
}

export async function getWishlist() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];

  return prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          salePrice: true,
          currency: true,
          media: { where: { isPrimary: true }, take: 1 },
          seller: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { addedAt: "desc" },
  });
}

// ============================================================
// TICKET ACTIONS
// ============================================================

export async function createTicket(
  input: z.infer<typeof createTicketSchema>,
): Promise<ActionResult<{ id: string }>> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const parsed = createTicketSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      error: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };

  try {
    const {
      sellerId,
      items,
      intentMessage,
      companyInfo,
      department,
      budget,
      deadline,
    } = parsed.data;

    const ticket = await prisma.ticket.create({
      data: {
        id: crypto.randomUUID(),
        buyerId: session.user.id,
        sellerId,
        status: "pending",
        intentMessage,
        companyInfo,
        department,
        budget,
        deadline: deadline ? new Date(deadline) : null,
        items: {
          create: items.map((item) => ({
            id: crypto.randomUUID(),
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            price: 0, // Will be set by seller during negotiation
          })),
        },
      },
    });

    // Create notification for seller
    await prisma.notification.create({
      data: {
        id: crypto.randomUUID(),
        userId: sellerId,
        type: "ticket_update",
        title: "New Purchase Ticket",
        message: `${session.user.name} has created a new ticket`,
        relatedId: ticket.id,
        relatedType: "ticket",
      },
    });

    return { success: true, data: { id: ticket.id } };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to create ticket",
    };
  }
}

export async function getBuyerTickets() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];

  return prisma.ticket.findMany({
    where: { buyerId: session.user.id },
    include: {
      seller: { select: { id: true, name: true, image: true } },
      items: {
        include: { product: { select: { id: true, title: true, slug: true } } },
      },
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getSellerTickets() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];

  return prisma.ticket.findMany({
    where: { sellerId: session.user.id },
    include: {
      buyer: { select: { id: true, name: true, image: true } },
      items: {
        include: { product: { select: { id: true, title: true, slug: true } } },
      },
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getTicketById(ticketId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      buyer: { select: { id: true, name: true, image: true } },
      seller: { select: { id: true, name: true, image: true } },
      items: {
        include: {
          product: { select: { id: true, title: true, slug: true } },
          variant: true,
        },
      },
      messages: {
        include: { sender: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
      statusHistory: {
        include: { changedBy: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!ticket) return null;
  if (
    ticket.buyerId !== session.user.id &&
    ticket.sellerId !== session.user.id &&
    session.user.role !== "admin"
  )
    return null;

  return ticket;
}

export async function updateTicketStatus(
  input: z.infer<typeof updateTicketStatusSchema>,
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const parsed = updateTicketStatusSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      error: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };

  try {
    const { ticketId, status, reason } = parsed.data;
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return { success: false, error: "Ticket not found" };

    // Only seller can approve/reject, buyer can cancel
    if (status === "approved" || status === "rejected") {
      if (ticket.sellerId !== session.user.id && session.user.role !== "admin")
        return {
          success: false,
          error: "Only the seller can approve or reject tickets",
        };
    }
    if (status === "cancelled") {
      if (ticket.buyerId !== session.user.id && session.user.role !== "admin")
        return { success: false, error: "Only the buyer can cancel tickets" };
    }

    await prisma.$transaction([
      prisma.ticket.update({ where: { id: ticketId }, data: { status } }),
      prisma.ticketStatusHistory.create({
        data: {
          id: crypto.randomUUID(),
          ticketId,
          status,
          changedById: session.user.id,
          reason,
        },
      }),
    ]);

    // Notify the other party
    const notifyUserId =
      ticket.buyerId === session.user.id ? ticket.sellerId : ticket.buyerId;
    await prisma.notification.create({
      data: {
        id: crypto.randomUUID(),
        userId: notifyUserId,
        type: "ticket_update",
        title: `Ticket ${status}`,
        message: `Your ticket has been ${status}${reason ? `: ${reason}` : ""}`,
        relatedId: ticketId,
        relatedType: "ticket",
      },
    });

    return { success: true, data: undefined };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to update ticket status",
    };
  }
}

export async function sendMessage(
  input: z.infer<typeof sendMessageSchema>,
): Promise<ActionResult<{ id: string }>> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const parsed = sendMessageSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      error: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };

  try {
    const { ticketId, content, attachmentUrl } = parsed.data;
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return { success: false, error: "Ticket not found" };
    if (
      ticket.buyerId !== session.user.id &&
      ticket.sellerId !== session.user.id &&
      session.user.role !== "admin"
    )
      return { success: false, error: "Forbidden" };

    const message = await prisma.ticketMessage.create({
      data: {
        id: crypto.randomUUID(),
        ticketId,
        senderId: session.user.id,
        content,
        attachmentUrl,
      },
    });

    // Notify the other party
    const notifyUserId =
      ticket.buyerId === session.user.id ? ticket.sellerId : ticket.buyerId;
    await prisma.notification.create({
      data: {
        id: crypto.randomUUID(),
        userId: notifyUserId,
        type: "message",
        title: "New Message",
        message: `${session.user.name} sent a message`,
        relatedId: ticketId,
        relatedType: "ticket",
      },
    });

    return { success: true, data: { id: message.id } };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to send message",
    };
  }
}

// ============================================================
// REVIEW ACTIONS
// ============================================================

export async function createReview(
  input: z.infer<typeof createReviewSchema>,
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const parsed = createReviewSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      error: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };

  try {
    const { productId, ticketId, rating, content } = parsed.data;
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket || ticket.status !== "approved")
      return { success: false, error: "Only approved tickets can be reviewed" };
    if (ticket.buyerId !== session.user.id)
      return { success: false, error: "Only the buyer can review" };

    await prisma.review.create({
      data: {
        id: crypto.randomUUID(),
        productId,
        userId: session.user.id,
        ticketId,
        rating,
        content,
        isVerified: true,
      },
    });

    return { success: true, data: undefined };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to create review",
    };
  }
}

// ============================================================
// NOTIFICATION ACTIONS
// ============================================================

export async function getNotifications() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];

  return prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function markNotificationRead(
  notificationId: string,
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });
    return { success: true, data: undefined };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to mark notification as read",
    };
  }
}
