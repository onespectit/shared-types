/**
 * Template Designer & Report Generation Types
 * 
 * Shared interfaces for PDF generation, zone-based rendering,
 * and report data structures.
 * 
 * Used by:
 * - Backend PDF painter service
 * - Report data mapper
 * - Zone renderers
 * - HTML report generator
 */

// Inlined RGB type — was `import { RGB } from 'pdf-lib'`. Inlining drops the
// pdf-lib dep so this package can publish standalone. Consumers that need the
// real pdf-lib RGB pass it via the string form (CSS-style hex) for portability.
export type RGB = { type: 'RGB'; red: number; green: number; blue: number };

/**
 * Complete report data structure
 * Contains all inspection data needed for report generation
 */
export interface ReportData {
  // Metadata
  order: {
    client_name: string;
    property_address: string;
    inspection_date: string;
    [key: string]: any;
  };
  
  // Structured sections
  sections: ReportSection[];
  
  // Summary data
  summary?: {
    deficiencies: Finding[];
    totalDeficiencies?: number;
    criticalIssues?: number;
    photosIncluded?: number;
  };
  
  // TREC Informational Fields (Foundation type, Water supply, etc.)
  informationalFields?: Record<string, string>;
}

/**
 * Report section (e.g., "I. STRUCTURAL SYSTEMS")
 */
export interface ReportSection {
  id: string;
  title: string;
  name?: string;
  subsections: Subsection[];
  order?: number;
}

/**
 * Subsection within a report section (e.g., "A. Foundations")
 */
export interface Subsection {
  id: string;
  title: string;
  name?: string;
  prefix?: string; // e.g., "A.", "B."
  
  // Content
  narrative?: string | RichTextSegment[]; // Support both plain text and rich text segments
  rating?: 'I' | 'NI' | 'NP' | 'D';
  comments?: string[];
  
  // Media
  photos?: Photo[];
  
  // Area-level comments (inspector summaries)
  areaComments?: RichTextSegment[];
  
  // Deficiency flag
  isDeficiency?: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  
  // Structured narrative segments
  narrativeSegments?: RichTextSegment[];
}

/**
 * Photo/image reference
 */
export interface Photo {
  id: string;
  url: string;
  gcsUrl?: string;
  caption?: string;
  timestamp?: Date | string;
  subsectionId?: string;
  deficiencyId?: string;
}

/**
 * Rich text segment for formatted narratives
 * Used by pdf-rich-text-painter
 */
export interface RichTextSegment {
  insert: string;
  text?: string;
  attributes?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string | RGB;
    fontSize?: number;
    list?: 'bullet' | 'ordered';
    indent?: number;
  };
}

/**
 * Finding/deficiency for summary section
 * PHASE 4.4: Added relational bundling fields for consolidated evidence
 */
export interface Finding {
  id: string;
  title: string;
  subsectionTitle?: string;
  sectionTitle?: string;
  description?: string;
  narrative?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  photos?: Photo[];
  isDeficiency?: boolean;
  
  // PHASE 4.4: Relational bundling (master/linked deficiency pattern)
  isMasterDeficiency?: boolean;     // True if this is the primary/master instance
  linkedToMasterId?: string;        // Foreign key to master deficiency if this is a linked instance
  linkedLocations?: string[];       // For masters: array of captions from linked instances
  bundleGroupId?: string;           // Legacy: For backward compatibility with DeficiencyBundle entity
}

/**
 * Zone type enumeration
 * Defines all possible zone types in template designer
 */
export enum ZoneType {
  // Headers
  SECTION_HEADER = 'SECTION_HEADER',
  SUBSECTION_HEADER = 'SUBSECTION_HEADER',
  
  // Rating elements
  RATINGS_HEADER = 'RATINGS_HEADER', // I NI NP D column headers
  RATING_HEADER_LABELS = 'RATING_HEADER_LABELS',
  RATING_CHECKBOXES = 'RATING_CHECKBOXES',
  RATING_GRID = 'RATING_GRID', // Combined ratings display
  
  // Content blocks
  TEXT_BLOCK = 'TEXT_BLOCK',
  INFORMATIONAL_FIELD = 'INFORMATIONAL_FIELD',
  COMMENTS_FIELD = 'COMMENTS_FIELD',
  AREA_COMMENT_BLOCK = 'AREA_COMMENT_BLOCK', // Subsection-level comments
  INFO_FIELDS_GROUP = 'INFO_FIELDS_GROUP', // Grouped informational fields
  
  // Media
  PHOTO_CONTAINER = 'PHOTO_CONTAINER',
  PHOTO_GRID = 'PHOTO_GRID',
  
  // Deficiencies
  DEFICIENCY_CONTAINER = 'DEFICIENCY_CONTAINER',
  DEFICIENCY_SUMMARY = 'DEFICIENCY_SUMMARY',
  
  // Layout
  PAGE_BREAK = 'PAGE_BREAK',
  HORIZONTAL_LINE = 'HORIZONTAL_LINE',
  SPACER = 'SPACER',
}

/**
 * Zone configuration
 * Defines behavior and data binding for each zone
 */
export interface Zone {
  id: string;
  type: ZoneType;
  config: ZoneConfig;
  position?: ZonePosition;
  styling?: ZoneStyling;
  
  // Coordinate-based positioning (for Pattern Designer)
  x: number;
  y: number;
  width: number;
  height: number;
  
  // Typography and alignment
  alignment: 'left' | 'center' | 'right';
  fontSize: number;
  fontWeight: string;
  
  // Compliance sync (for ratings alignment)
  syncWithRatings?: boolean;
  
  // Token-based content binding
  content?: string; // e.g., "{{SECTION_TITLE}}", "{{SUBSECTION_RATINGS}}"
}

export interface ZoneConfig {
  // Content binding
  dataSource?: string;
  fieldMapping?: Record<string, string>;
  
  // Display options
  showLabel?: boolean;
  label?: string;
  placeholder?: string;
  
  // Content (token-based data binding)
  content?: string; // e.g., "{{SECTION_TITLE}}", "I NI NP D", "{{SUBSECTION_RATINGS}}"
  richText?: RichTextSegment[];
  
  // Rating-specific
  ratingType?: 'I' | 'NI' | 'NP' | 'D';
  showRatingHeaders?: boolean;
  
  // Photo-specific
  photosPerRow?: number;
  maxPhotos?: number;
  photoSize?: 'small' | 'medium' | 'large';
  
  // Subsection identification (multiple methods for legacy compatibility)
  subsectionIdDb?: string;
  subsectionId?: string;
  subsectionTitle?: string;
  
  // Photo grid configuration
  gridConfig?: {
    columns?: number;
    spacing?: number;
  };
  
  // Conditional rendering
  condition?: string;
}

export interface ZonePosition {
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;
  order?: number;
}

export interface ZoneStyling {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: string;
  padding?: string | number;
  margin?: string | number;
  fontSize?: number;
  fontWeight?: number | string;
  fontFamily?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize';
}

/**
 * Page template configuration
 * Defines header/footer zones and page margins
 */
export interface PageTemplate {
  header?: {
    enabled: boolean;
    zones: Zone[];
    height?: number;
  };
  footer?: {
    enabled: boolean;
    zones: Zone[];
    height?: number;
  };
  firstPageHeader?: {
    enabled: boolean;
    zones: Zone[];
    height?: number;
  };
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

/**
 * Template design structure
 * Supports both legacy and new zone-based formats
 */
export interface TemplateDesign {
  // Legacy flow-based structure (deprecated)
  pages?: PageDesign[];
  zones?: Zone[];
  pageTemplates?: any;
  
  // New dual-format structure
  fixedPages?: FixedPage[];
  masterLayouts?: MasterLayouts;
  header?: PageHeaderFooter;
  footer?: PageHeaderFooter;
}

export interface PageDesign {
  id: string;
  zones: Zone[];
}

export interface FixedPage {
  page: number;
  fields: Record<string, FixedField>;
}

export interface FixedField {
  x: number;
  y: number;
  width?: number;
  height?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  alignment?: 'left' | 'center' | 'right';
  selector?: string;
  value?: string;
  dataKey?: string; // For dynamic data binding
  content?: string; // For static content
}

export interface MasterLayouts {
  subsection_row: MasterLayout;
}

export interface MasterLayout {
  height: 'auto' | number;
  components: Record<string, LayoutComponent>;
}

export interface LayoutComponent {
  type: 'rating_block' | 'label' | 'text_area' | 'photo_grid' | 'informational_fields' | 'rich_text';
  x: number;
  y?: number;
  width?: number | string;
  height?: number;
  spacing?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  selector?: string;
  dataKey?: string;
}

export interface PageHeaderFooter {
  enabled: boolean;
  height: number;
  content: string;
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  padding?: number;
}

/**
 * Formatting rules for report styling
 */
export interface FormattingRules {
  fonts?: {
    body?: FontConfig;
    heading?: FontConfig;
    subheading?: FontConfig;
  };
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  spacing?: {
    sectionGap?: number;
    subsectionGap?: number;
    paragraphSpacing?: number;
  };
  layout?: {
    pageSize?: 'letter' | 'legal' | 'a4';
    orientation?: 'portrait' | 'landscape';
  };
}

export interface FontConfig {
  family: string;
  size: number;
  weight?: number | string;
  color?: string;
}

/**
 * Rating scale configuration
 */
export interface RatingScale {
  I?: RatingDefinition;
  NI?: RatingDefinition;
  NP?: RatingDefinition;
  D?: RatingDefinition;
}

export interface RatingDefinition {
  label: string;
  description: string;
  color?: string;
}

/**
 * Schema section (from ExtractedSchema)
 */
export interface SchemaSection {
  id: string;
  title?: string;
  name?: string;
  shortName?: string;
  subsections: SchemaSubsection[];
}

export interface SchemaSubsection {
  id: string;
  title?: string;
  name?: string;
  prefix?: string;
  fields: SchemaField[];
  promulgatedText?: string; // TREC required text
}

export interface SchemaField {
  id: string;
  name: string;
  type: string;
  label?: string;
  required?: boolean;
  options?: string[];
}

/**
 * Property information
 */
export interface PropertyInfo {
  address: string;
  city?: string;
  state?: string;
  zip?: string;
}

/**
 * Inspector information
 */
export interface InspectorInfo {
  name: string;
  license?: string;
  company?: string;
  phone?: string;
  email?: string;
}

/**
 * Informational field (TREC required fields)
 */
export interface InformationalField {
  id: string;
  label: string;
  value: string;
  type?: string;
  subsectionId?: string;
}

/**
 * Rating data
 */
export interface Rating {
  subsectionId: string;
  rating: 'I' | 'NI' | 'NP' | 'D';
  timestamp?: Date;
}

/**
 * Deficiency instance
 */
export interface Deficiency {
  id: string;
  subsectionId: string;
  description: string;
  narrative?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  photos?: string[] | Photo[];
  comments?: string;
  caption?: string;
}

/**
 * Zone Map - Collection of zones for report generation
 */
export interface ZoneMap {
  fixedPages: Array<{
    pageNumber: number;
    zones: Array<{
      type: string;
      dataKey?: string;
      content?: string;
      x: number;
      y: number;
      width?: number;
      height?: number;
      fontSize?: number;
    }>;
  }>;
  dynamicZones: Zone[];
}

/**
 * Cursor state for tracking position during rendering
 */
export interface CursorState {
  x: number;
  y: number;
  pageNumber: number;
}

/**
 * Render context for zone rendering pipeline
 */
export interface RenderContext {
  page: any; // PDFPage from pdf-lib
  fonts: {
    normal: any; // PDFFont
    bold: any;
    italic?: any;
  };
  y: number;
  x?: number;
  maxWidth?: number;
  baseFontSize?: number;
  lineHeight?: number;
  pageMargins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  alignmentGuides?: Record<string, number>;
  data?: {
    sections: ReportSection[];
    deficiencies?: Deficiency[];
    photos?: Photo[];
  };
}

/**
 * PDF Renderer interface
 */
export interface IPdfRenderer {
  renderReport(reportData: ReportData, zones: ZoneMap): Promise<Uint8Array>;
}
