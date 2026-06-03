/**
 * Canonical shape of `artifacts/{tenantId}/public/data/company_profiles/default`.
 *
 * Web-admin pages currently maintain their own narrow `interface CompanyProfile`
 * declarations focused on the fields each surface renders (CompanyInfo, CompanySettings,
 * DashboardService). Those stay for now — they're UI-specific projections of the
 * same Firestore doc. This file is the cross-app contract used by backend services
 * and the mobile Chameleon rollout to read fields that matter across surfaces.
 *
 * Everything here is optional — partially-provisioned tenants exist, and consumers
 * must tolerate missing fields. The provisioning batch in
 * `AdminService.provisionTenant` is the source of truth for what new tenants get.
 */
export interface CompanyProfile {
  // Identity
  tenantId?: string;
  companyName?: string;

  // Universal SoP — Sprint 1 rollout flag. When true, mobile renders the
  // Chameleon UI driven by `RatingDefinition[]` from the resolved SoP instead
  // of the legacy TREC-hardcoded I/NI/NP/D affordances. Defaults to false on
  // new tenants and rolls out per-tenant during Sprint 1 validation. Eventually
  // removed once every active tenant has been migrated and validated.
  //
  // SoP is template-driven, not tenant-driven — see `template.sopId`. There
  // is intentionally no `sopId` field on this doc; the previous Sprint 0 D6
  // tenant-default plumbing was removed in Sprint 1.
  useChameleonUI?: boolean;

  // Branding (read by PDF renderer, public booking form, portal)
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  logoUrl?: string;
  themeColor?: string;          // legacy single-color field
  whiteLabelMode?: boolean;

  // Public surfaces
  bookingSlug?: string;
  supportEmail?: string;
  googleReviewLink?: string;
  yelpLink?: string;

  // Office address (used in contracts, invoices, report header)
  officeAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };

  // Calendar
  selectedCalendarId?: string;
  autoBookInspections?: boolean;

  // Billing (BITE 66 + 73.8p)
  subscriptionStatus?: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  pricingTier?: string;
  trialPdfCount?: number;
  trialStartDate?: unknown;     // Firestore Timestamp on read, Date on write — keep loose
  trialEndDate?: unknown;
  stripeSetupNeedsRetry?: boolean;
  stripeSetupError?: string;
  stripeSetupFailedAt?: unknown;

  // Tokens (BITE 66 Final)
  tokenBalance?: number;
  tokenUsed?: number;

  // Bookkeeping
  createdAt?: unknown;
  updatedAt?: unknown;
}
