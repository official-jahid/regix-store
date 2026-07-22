import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  location: z.string().max(100).optional(),
  socialLinks: z.string().optional(),
  phone: z.string().max(20).optional(),
});

export const createSellerProfileSchema = z.object({
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  storeSlug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  storeDescription: z.string().max(1000).optional(),
});

export const updateSellerProfileSchema = createSellerProfileSchema
  .partial()
  .extend({
    bannerUrl: z.string().optional(),
    logoUrl: z.string().optional(),
  });

export const createBusinessProfileSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  taxId: z.string().optional(),
  department: z.string().optional(),
});

export const kycSubmissionSchema = z.object({
  documentType: z.enum(["identity", "business_registration", "tax_info"]),
  documentUrl: z.string().url("Invalid document URL"),
});

export const inviteTeamMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "manager", "buyer"]),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateSellerProfileInput = z.infer<
  typeof createSellerProfileSchema
>;
export type KYCSubmissionInput = z.infer<typeof kycSubmissionSchema>;
export type InviteTeamMemberInput = z.infer<typeof inviteTeamMemberSchema>;
