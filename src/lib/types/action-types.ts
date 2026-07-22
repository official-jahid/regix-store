export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export type PaginatedResult<T> = {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
  total?: number;
};

export type Role = "buyer" | "business" | "seller" | "moderator" | "admin";

export type TicketStatus =
  | "pending"
  | "under_review"
  | "contacted"
  | "negotiating"
  | "approved"
  | "rejected"
  | "cancelled"
  | "expired";

export type ProductStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "rejected"
  | "archived";

export type KYCStatus =
  | "not_submitted"
  | "pending"
  | "under_review"
  | "verified"
  | "rejected";

export type SubscriptionStatus = "active" | "paused" | "cancelled" | "expired";
export type BoxTier = "basic" | "pro" | "enterprise";
export type Frequency = "monthly" | "quarterly";
export type TeamRole = "admin" | "manager" | "buyer";
