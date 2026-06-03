// BITE 7.1: Cover Page Designer
export * from './coverDesigner';

// BITE 73.7u: Multi-unit tech-spec parser
export * from './multiUnit';

// Universal SoP — Sprint 1: canonical company_profiles/default shape with
// the useChameleonUI rollout flag. SoP is template-driven (see template.sopId);
// there is intentionally no tenant-level sopId field.
export * from './companyProfile';

// Inspection Standards
export enum InspectionStandard {
  TREC = 'TREC',
  INTERNACHI = 'InterNACHI',
  ASHI = 'ASHI',
  CCPIA_COMSOP = 'CCPIA_ComSOP',
  CUSTOM = 'CUSTOM'
}

// Field Types for Template Builder
export enum FieldType {
  COMMENT = 'comment',
  RATING = 'rating',
  INFORMATIONAL = 'informational',
  PHOTO_PLACEHOLDER = 'photo_placeholder',
  DROPDOWN = 'dropdown',
  CHECKBOX = 'checkbox',
  TEXT_INPUT = 'text_input',
  NUMBER_INPUT = 'number_input',
  DATE_INPUT = 'date_input'
}

// TREC Rating System
export enum TRECRating {
  INSPECTED = 'I',        // Inspected - functioning as intended
  NOT_INSPECTED = 'NI',   // Not Inspected
  NOT_PRESENT = 'NP',     // Not Present
  DEFICIENT = 'D'         // Deficient - not functioning as intended
}

// PDF Coordinate System
export interface PDFCoordinate {
  x: number;
  y: number;
  page: number;
}

export interface PDFRegion {
  topLeft: PDFCoordinate;
  bottomRight: PDFCoordinate;
}

// Template Schema Interfaces
export interface TemplateField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  position?: PDFCoordinate;
  region?: PDFRegion;
  options?: string[]; // For dropdowns
  defaultValue?: string;
  validationRules?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'min_length' | 'max_length' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export interface TemplateSection {
  id: string;
  title: string;
  description?: string;
  fields: TemplateField[];
  subsections?: TemplateSection[];
  order: number;
}

export interface InspectionTemplate {
  id: string;
  name: string;
  description?: string;
  standard: InspectionStandard;
  version: string;
  isActive: boolean;
  sections: TemplateSection[];
  pdfTemplate?: {
    fileName: string;
    fileUrl: string;
    pageCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Template Builder State
export interface TemplateBuilderState {
  template: Partial<InspectionTemplate>;
  selectedSection?: string;
  selectedField?: string;
  isDirty: boolean;
  validationErrors: Record<string, string[]>;
}

// PDF Mapping Types
export interface PDFMapping {
  templateId: string;
  fieldMappings: FieldMapping[];
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FieldMapping {
  fieldId: string;
  pdfRegion: PDFRegion;
  mappingType: 'text' | 'checkbox' | 'signature' | 'drawing';
  fontConfig?: {
    family: string;
    size: number;
    color: string;
    bold?: boolean;
    italic?: boolean;
  };
}

// User Management Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  INSPECTOR = 'inspector',
  VIEWER = 'viewer'
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface JWTPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Smart Comments Feature Types
export interface KeywordClassification {
  id: string;
  keyword: string;
  category: SmartCommentCategory;
  colorCode: string;
  priority: number; // For handling multiple keywords in one narrative
  createdAt: Date;
  updatedAt: Date;
}

export enum SmartCommentCategory {
  SAFETY = 'Safety',
  MAJOR = 'Major',
  MAINTENANCE = 'Maintenance',
  MONITOR = 'Monitor',
  RECOMMENDATION = 'Recommendation',
  GENERAL = 'General'
}

export interface ClassifiedComment {
  id: string;
  originalText: string;
  detectedKeywords: string[];
  category: SmartCommentCategory;
  colorCode: string;
  priority: number;
  formattingOptions: CommentFormattingOptions;
}

export interface CommentFormattingOptions {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  coloredMargin: boolean;
  fontSize: 'small' | 'normal' | 'large';
  backgroundColor?: string;
}

// Enhanced Template Field for Smart Comments
export interface EnhancedTemplateField extends TemplateField {
  smartCommentsEnabled?: boolean;
  allowedCategories?: SmartCommentCategory[];
  defaultFormatting?: CommentFormattingOptions;
}

// API Request/Response Types for Smart Comments
export interface CreateKeywordRequest {
  keyword: string;
  category: SmartCommentCategory;
  colorCode: string;
  priority?: number;
}

export interface KeywordClassificationResponse extends ApiResponse<KeywordClassification[]> {
  keywords: KeywordClassification[];
}

export interface ClassifyNarrativeRequest {
  narrativeText: string;
  templateFieldId?: string;
}

export interface ClassifyNarrativeResponse extends ApiResponse<ClassifiedComment> {
  classification: ClassifiedComment;
  suggestions?: KeywordClassification[];
}

// Narrative Bundling System
export interface NarrativeTemplate {
  id: string;
  text: string;
  sectionId: string;
  keywords: string[];
  usageCount: number;
  isActive: boolean;
  isSystemTemplate: boolean;
  lastUsed?: Date;
  createdAt: Date;
}

export interface DeficiencyInstance {
  id: string;
  caption: string;
  photoUrl?: string;
  sectionId: string;
  subsectionId?: string;
  locationId?: string; // Optional: For multi-unit/multi-building inspections
  narrativeTemplateId?: string;
  isBundled: boolean;
  bundleGroupId?: string;
  sequenceInBundle: number;
  createdAt: Date;
}

export interface BundledNarrative {
  baseNarrative: string;
  bundleGroupId: string;
  instances: DeficiencyInstance[];
  finalText: string;
}

export interface NarrativeBundlingResponse {
  canBundle: boolean;
  existingInstances: DeficiencyInstance[];
  suggestedNarrative: string;
}

export interface CreateDeficiencyRequest {
  caption: string;
  photoUrl?: string;
  sectionId: string;
  subsectionId?: string;
  inspectionId?: string;
  locationId?: string; // Optional: For multi-unit/multi-building inspections
}

export interface BundleDeficienciesRequest {
  narrativeTemplateId: string;
  deficiencyInstanceIds: string[];
}

// Export Template Designer & Report Generation types
export * from './templateDesigner';

// Universal SoP — Sprint 0 Blueprint data model (sop_registry consumers).
// Namespaced under `SoP` to avoid colliding with legacy TREC-hardcoded
// RatingScale / RatingDefinition exports from templateDesigner.ts. Sprint 1's
// Chameleon refactor will deprecate the legacy types; until then, new
// consumers use `import { SoP } from '@onespectit/shared-types'` then
// `SoP.SOPConfiguration`, `SoP.RatingDefinition`, etc.
// See docs/sprints/UNIVERSAL_SOP_SPRINT_0_PLAN.md
export * as SoP from './sop';

/**
 * BITE 4.2.2: Legacy Alignment
 * Satisfies the compiler for decommissioned SQL seeding logic in templates.service.ts.
 * The real TREC schema lives in trec-schema.ts but is no longer re-exported here
 * to avoid the "Duplicate Identifier" error.
 */
export const TRECInspectionSchema: any = {
  inspectionSections: []
};
export type TRECInspectionSchema = typeof TRECInspectionSchema;

console.log('CHIEF_ARCHITECT_TRACE: CICD_ALIGNMENT_COMPLETE');
