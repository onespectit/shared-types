/**
 * Universal SoP — Sprint 0 Blueprint data model.
 *
 * The contract every downstream consumer reads from once the Chameleon
 * UI work lands in Sprint 1:
 *   - Mobile InspectionCaptureScreen + RatingsScreen render rating affordances
 *     from `ratings.options[]` keyed by `layout.ratingDisplayMode`
 *   - Mobile rating business logic branches on RatingDefinition flags
 *     (isDeficiency, requiresComment, etc.) instead of string-matching 'D'
 *   - PDF renderer reads `ratings.options[]` for columns + `layout` for
 *     positioning + `checklistConfig` for FL-4-Point / reinspection mode
 *   - Web report viewer reads `isDeficiency` flag + `color` + `label`
 *   - AI prompt assembly reads `narrativeLanguage` for standards-only
 *     phrasing + banned-term scrub
 *   - Future SoP Builder UI (Sprint 2) writes these docs to sop_registry
 *
 * Sprint 0 deliberately omits agent-suite affordances (manufacturer
 * libraries, hazard registries, external data source declarations,
 * deep per-system thresholds). Those land as additive schema migrations
 * post-Universal SoP. See:
 *   - docs/sprints/UNIVERSAL_SOP_SPRINT_0_PLAN.md
 *   - ~/.claude/projects/.../memory/project_ai_agent_suite_master_spec.md
 */

// ============================================================================
// Top-level SoP configuration
// ============================================================================

/**
 * One row in `sop_registry/{sopId}`. Platform-shared (not tenant-scoped);
 * tenants point at a SoP via `company_profiles/default.sopId`. Subscriber
 * customizations (Power tier, Sprint 2.5+) work by cloning a platform SoP
 * into a new doc with a tenant-prefixed sopId.
 */
export interface SOPConfiguration {
  /** Stable identifier. `trec_7_6` | `internachi_2024` | `fl_4_point` | `{tenantSlug}_{name}` for subscriber clones. */
  sopId: string;

  /** Human-readable name shown in tenant SoP picker. */
  name: string;

  /** Semver-ish. Bumps when rules change so the LRU cache can invalidate. */
  version: string;

  /** Two-letter state code, ISO country code, or 'global' / 'US' for jurisdiction-neutral. */
  jurisdiction: string;

  /** ISO date (YYYY-MM-DD) when this SoP version became effective. */
  effectiveDate: string;

  /** Primary rating taxonomy + semantic flags used for fresh inspections. */
  ratings: RatingScale;

  /** WHAT + WHERE rating affordances render for fresh inspections. */
  layout: LayoutConfiguration;

  /** Standards-only language + banned-term scrub for AI narrative output. */
  narrativeLanguage: NarrativeLanguageConfig;

  /**
   * AI narrative prompt content used by `ai.service.ts` to assemble the
   * Gemini system instruction. Sprint 1 Gap 3 extraction — previously
   * lived as TREC_BASE_SYSTEM_INSTRUCTION + TREC_SECTION_BRIEFS module
   * constants in `apps/backend-api/src/services/ai.service.ts`.
   *
   * Empty/undefined falls back to the hardcoded TREC constants for
   * migration safety. Once all SoP docs in production have been
   * backfilled with prompt content (via `scripts/backfill-sop-prompts.mjs`),
   * the fallback can be removed in a follow-up cleanup pass.
   */
  prompts?: PromptConfiguration;

  /**
   * Optional reinspection-mode overlay. When the inspection being rendered
   * has `isReinspection === true`, renderer + AI consumers use these
   * ratings + layout instead of the primary values above. Same SoP — same
   * data schema, same narrative language — different rating affordances
   * and rendering layout.
   *
   * SoPs without this block don't support reinspection workflow (subscriber
   * can't run a reinspection inspection under this SoP). All four reference
   * SoPs (TREC, InterNACHI, FL 4-Point, commercial) should populate this so
   * the dedicated Reinspection sprint inherits a working overlay for each.
   */
  reinspectionMode?: SoPReinspectionMode;
}

/**
 * AI prompt content for one SoP. Consumed by
 * `ai.service.ts::buildSystemInstruction` which assembles the final
 * Gemini system instruction by combining `baseSystemInstruction` with
 * a section-specific brief looked up via `sectionBriefs`.
 *
 * Sprint 1 Gap 3 extraction. The original module-level constants live
 * at TREC_BASE_SYSTEM_INSTRUCTION (~150 lines) and TREC_SECTION_BRIEFS
 * (~140 lines, 12 system entries keyed by system name).
 *
 * Per-system brief routing (matchBriefByText / matchBriefByCaption) is
 * unchanged — only the data source moves from compile-time constants to
 * runtime SoP-config reads, so per-SoP prompts can vary without code
 * changes.
 */
export interface PromptConfiguration {
  /**
   * Base system instruction prepended to every Gemini narrative call.
   * Defines output format (CAR — Condition / Analysis / Recommendation),
   * standards-only language policy, format rules. Inspector-facing
   * output style lives here, not in per-section briefs.
   */
  baseSystemInstruction: string;

  /**
   * Per-system narrative briefs. Keys are stable system identifiers
   * (electrical / roofing / hvac / plumbing / structural / attic /
   * exterior / interior / fireplaces / appliances / doors_windows /
   * gas_systems / etc.). The AI service's `matchBriefByText` routes
   * via subsection → section → caption keyword fallback to pick the
   * brief to append to `baseSystemInstruction`.
   *
   * SoPs may include fewer keys than TREC (e.g. a SoP that doesn't
   * cover gas_systems can omit that key). Missing keys fall through
   * to a generic `UNCERTAIN_SECTION_GUIDANCE` block emitted by the
   * AI service itself.
   */
  sectionBriefs: Record<string, string>;
}

/**
 * Reinspection overlay applied when `inspection.isReinspection === true`.
 * Renders the SAME sections/subsections from the parent inspection's
 * template, but with these ratings + this layout instead of the parent
 * SoP's primary ratings + layout.
 *
 * Workflow plumbing (Repair Request → staging list → mobile checklist
 * with before-photo references → PDF before/after) is the Reinspection
 * sprint's job, not Sprint 0. This overlay just declares what RATING
 * affordances the renderer should surface for reinspection items.
 */
export interface SoPReinspectionMode {
  /** Rating set used during reinspection. Typically pass/fail-style with optional 'New Deficiency' for items discovered during reinspection. */
  ratings: RatingScale;

  /** Layout for reinspection rendering. Typically `checklist` mode with photo evidence required. */
  layout: LayoutConfiguration;
}

// ============================================================================
// Rating taxonomy
// ============================================================================

export interface RatingScale {
  options: RatingDefinition[];
}

/**
 * The flags that make the Chameleon possible. Sprint 1 mobile business
 * logic replaces `if (rating === 'D')` style string-matching with
 * `if (ratingDef.isDeficiency)` flag reads everywhere.
 *
 * For SoPs in `narrative-only` layout mode this scale can be empty or
 * contain a single "Observed" rating — the UI just doesn't surface
 * rating affordances.
 */
export interface RatingDefinition {
  /** Short stable id stored on deficiencies. 'I' / 'NI' / 'D' / 'NP' (TREC) | 'pass' / 'fail' (FL 4-Point) | 'repairs_complete' / 'repairs_not_complete' / 'new_deficiency' (reinspection) | 'immediate' / 'short_term' / 'maintenance' (commercial). */
  id: string;

  /** Full human-readable label for UI buttons and narrative phrasing. */
  label: string;

  /** Single-letter or short string for PDF column headers + compact badges. */
  shortLabel: string;

  /** Tooltip / help text shown to inspectors when they hover the affordance. */
  description?: string;

  /** True when this rating represents a deficiency for downstream summary + agent / repair-request flagging. */
  isDeficiency: boolean;

  /** True when the rating cannot stand alone — UX must require an explanation comment. */
  requiresComment: boolean;

  /** True for ratings that intentionally skip SoP rule checks (TREC NP — "Not Present" — bypasses compliance evaluation). */
  skipCompliance: boolean;

  /** True for ratings that auto-apply when the inspector touches the subsection (TREC I default). At most one option per scale should have this true. */
  isDefaultOnCapture: boolean;

  /** Resolution order when multiple ratings conflict (TREC: I > D > NI > NP = 1, 2, 3, 4). Lower number wins. */
  priority: number;

  /** Hex color for badges / cells / chart segments. */
  color: string;

  /**
   * Optional advisory shown to the inspector immediately after they select
   * this rating (e.g. TREC NI → "Reminder: include specific reason and
   * recommendations in the narrative."). Mobile renders it as a 2.5s
   * auto-clearing toast; web surfaces it inline. Omit for ratings that
   * don't need an in-the-moment nudge.
   */
  advisoryText?: string;
}

// ============================================================================
// Layout — WHAT + WHERE rating affordances render
// ============================================================================

/**
 * Visual + structural rules for how the inspection surfaces render this
 * SoP. SoP-wide for now; per-section override deferred until needed —
 * the four reference SoPs (TREC, InterNACHI, reinspection, FL 4-Point)
 * are uniform across sections.
 *
 * `ratingDisplayMode` (WHAT is surfaced) and `ratingPosition` (WHERE it
 * sits) are orthogonal. Modes that have an intrinsic layout (`checklist`,
 * `narrative-only`) ignore `ratingPosition`.
 */
export interface LayoutConfiguration {
  /**
   * - `single-rating`    one rating selected per subsection (TREC, InterNACHI)
   * - `pill-tags`        multiple defect-severity tags per subsection (commercial)
   * - `checklist`        pass/fail line items + required photo (FL 4-Point, reinspection)
   * - `narrative-only`   no rating affordance; pure narrative form (long-tail SoPs)
   */
  ratingDisplayMode: 'single-rating' | 'pill-tags' | 'checklist' | 'narrative-only';

  /**
   * Where the rating affordance sits within each subsection. Applies to
   * `single-rating` and `pill-tags` modes. Ignored by `checklist`
   * (intrinsic list layout) and `narrative-only` (no rating UI).
   */
  ratingPosition?: 'left' | 'right' | 'top' | 'bottom';

  /**
   * Required when `ratingDisplayMode === 'pill-tags'`. The severity tags
   * available for each subsection — commercial SoPs use Major / Marginal /
   * Safety / Structural badges instead of a single rating per area.
   */
  defectTags?: DefectTagDefinition[];

  /**
   * Required when `ratingDisplayMode === 'checklist'`. Captures the
   * pass/fail labels, photo requirements, and minimum photo count.
   */
  checklistConfig?: ChecklistConfig;
}

export interface DefectTagDefinition {
  id: string;
  /** Human-readable label for the badge: 'Major' / 'Marginal' / 'Safety' / 'Structural'. */
  label: string;
  /** Hex color for the badge. */
  color: string;
  severity: 'critical' | 'major' | 'minor' | 'info';
}

export interface ChecklistConfig {
  /** Affirmative label: 'Pass' | 'Satisfactory' | 'Repairs Complete'. */
  passLabel: string;
  /** Negative label: 'Fail' | 'Deficient' | 'Repairs Not Complete'. */
  failLabel: string;
  /** When true, the inspector cannot advance past an item without attaching at least one photo. */
  requiresPhotoEvidence: boolean;
  /** Minimum photo count per item when `requiresPhotoEvidence` is true. Default 1. */
  minimumPhotosPerItem?: number;
}

// ============================================================================
// Narrative language — standards-only phrasing + banned-term scrub
// ============================================================================

/**
 * Centralizes the "no governing-body references" policy. AI prompt
 * assembly reads this so every threshold/rule narrative cites
 * `standardsLanguage` instead of "TREC §X" or "NEC Article Y" or
 * "code". Banned terms are scrubbed from AI output as defense-in-depth
 * before the response crosses the service boundary.
 *
 * See: ~/.claude/projects/.../memory/feedback_no_governing_body_references.md
 *      ~/.claude/projects/.../memory/feedback_standards_only_language.md
 */
export interface NarrativeLanguageConfig {
  /** Replacement language for governing-body citations: 'current standards' (TREC) | 'accepted construction practices' (InterNACHI) | 'manufacturer specifications' (some commercial). */
  standardsLanguage: string;

  /**
   * Lower-cased terms scrubbed from AI narrative output before it
   * reaches the consumer. Example for TREC SoP:
   *   ['trec', 'texas requirement', 'irc', 'nec', 'code']
   * Defense-in-depth — the prompt also instructs the model not to use
   * these terms, but a post-response scrub catches the residual cases.
   */
  bannedTerms: string[];

  /**
   * Optional per-system override phrasing. Example:
   *   { hvac: 'manufacturer specifications', plumbing: 'industry standards' }
   * Empty / undefined falls back to `standardsLanguage` for every system.
   */
  systemSpecificLanguage?: Record<string, string>;
}
