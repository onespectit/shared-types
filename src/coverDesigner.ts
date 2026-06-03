/**
 * BITE 7.1: Cover Page Designer — Shared Types
 *
 * A CoverTemplate is a layer stack rendered as PDF Pass 0.
 * Layers are ordered bottom-to-top by their position in the `layers` array
 * (index 0 = bottom, highest index = topmost).
 *
 * Two layer types:
 *   FrameImageLayer  — the static Canva-exported PNG/JPG (one per template)
 *   SmartBlockLayer  — dynamic data block (hero photo, text field, inspector info)
 *
 * All positions and sizes are stored as percentages (0–100) of the US Letter
 * canvas (8.5 × 11 inches) so covers are resolution-independent.
 */

// ─── Canvas constants ─────────────────────────────────────────────────────────
/** US Letter at 96 DPI: 816 × 1056 px */
export const COVER_CANVAS_WIDTH_PX  = 816;
export const COVER_CANVAS_HEIGHT_PX = 1056;

// ─── Layer types ──────────────────────────────────────────────────────────────

export type CoverLayerType =
  | 'frame'       // Static Canva frame image (PNG with optional transparency, or JPG)
  | 'hero'        // inspection.coverPhotoUrl — the property photo
  | 'text'        // Single dynamic field token (address, date, etc.)
  | 'group'       // Multiple field tokens stacked vertically inside one block
  | 'static_text' // Free-text string, no data binding

/** Geometry: all values are percentages of canvas width/height (0–100) */
export interface BlockGeometry {
  x: number;       // left edge % from canvas left
  y: number;       // top edge % from canvas top
  width: number;   // block width %
  height: number;  // block height %
}

/** Background fill options for Smart Blocks */
export interface BlockBackground {
  color: string;           // hex or 'transparent'
  opacity: number;         // 0–1 (ignored when color is 'transparent')
  borderRadius: number;    // px — 0 = rectangle, 50% of min(w,h) = circle/oval
}

/** Typography for text-bearing blocks */
export interface BlockTypography {
  fontFamily: string;      // CSS font family — 'inherit' uses template font
  fontSize: number;        // pt
  fontWeight: 'normal' | 'bold' | '300' | '500' | '600' | '700';
  fontStyle: 'normal' | 'italic';
  color: string;           // hex
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;      // multiplier, e.g. 1.4
  letterSpacing: number;   // pt
}

// ─── Field tokens ─────────────────────────────────────────────────────────────

/**
 * All available dynamic field tokens.
 * Prefixed by source: 'inspection.', 'order.', 'inspector.', 'company.'
 */
export type FieldToken =
  // Inspection record
  | 'inspection.coverPhotoUrl'
  | 'inspection.propertyAddress'
  | 'inspection.inspectionDate'
  | 'inspection.inspectionTime'
  | 'inspection.inspectionWeather'
  | 'inspection.endWeather'
  | 'inspection.client1'
  | 'inspection.client2'
  | 'inspection.yearBuilt'
  | 'inspection.partiesPresent'
  // Order record
  | 'order.orderId'
  | 'order.serviceType'
  // Inspector profile
  | 'inspector.name'
  | 'inspector.licenseNumber'
  | 'inspector.phone'
  | 'inspector.email'
  // Company profile
  | 'company.name'
  | 'company.phone'
  | 'company.email'
  | 'company.website'
  | 'company.logoUrl';

/** Label shown in the block palette sidebar */
export const FIELD_TOKEN_LABELS: Record<FieldToken, string> = {
  'inspection.coverPhotoUrl':   'Property Photo',
  'inspection.propertyAddress': 'Property Address',
  'inspection.inspectionDate':  'Inspection Date',
  'inspection.inspectionTime':  'Inspection Time',
  'inspection.inspectionWeather': 'Weather at Start',
  'inspection.endWeather':      'Weather at End',
  'inspection.client1':         'Client Name (Primary)',
  'inspection.client2':         'Client Name (Secondary)',
  'inspection.yearBuilt':       'Year Built',
  'inspection.partiesPresent':  'Parties Present',
  'order.orderId':              'Order ID',
  'order.serviceType':          'Service Type',
  'inspector.name':             'Inspector Name',
  'inspector.licenseNumber':    'License Number',
  'inspector.phone':            'Inspector Phone',
  'inspector.email':            'Inspector Email',
  'company.name':               'Company Name',
  'company.phone':              'Company Phone',
  'company.email':              'Company Email',
  'company.website':            'Company Website',
  'company.logoUrl':            'Company Logo',
};

// ─── Layer definitions ────────────────────────────────────────────────────────

/** Static Canva-exported frame image */
export interface FrameImageLayer {
  id: string;
  type: 'frame';
  name: string;              // e.g. "Background Frame"
  gcsUrl: string;            // GCS https:// URL (PNG preferred; JPG accepted)
  opacity: number;           // 0–1
  // Frame images span the full canvas — no geometry controls
}

/**
 * Hero photo block — renders inspection.coverPhotoUrl.
 * If coverPhotoUrl is null, block renders nothing (no fallback).
 */
export interface HeroBlockLayer {
  id: string;
  type: 'hero';
  name: string;
  geometry: BlockGeometry;
  background: BlockBackground;
  borderRadius: number;      // px — controls photo clip shape
  objectFit: 'cover' | 'contain';
  boxShadow?: string;        // CSS box-shadow string, optional
}

/**
 * Single dynamic text field token.
 * Renders the resolved value of `token` with optional prefix/suffix labels.
 */
export interface TextBlockLayer {
  id: string;
  type: 'text';
  name: string;
  token: FieldToken;
  prefix?: string;           // e.g. "Date of Inspection: "
  suffix?: string;
  geometry: BlockGeometry;
  background: BlockBackground;
  typography: BlockTypography;
}

/**
 * Group block — multiple field tokens stacked vertically.
 * Useful for "Report Prepared For / Client Name" groupings.
 */
export interface GroupBlockLayer {
  id: string;
  type: 'group';
  name: string;
  geometry: BlockGeometry;
  background: BlockBackground;
  paddingPt: number;         // internal padding in pt
  rowGapPt: number;          // vertical gap between rows in pt
  rows: GroupRow[];
}

export interface GroupRow {
  id: string;
  token?: FieldToken;        // undefined = static label row
  staticText?: string;       // used when token is undefined
  typography: BlockTypography;
  prefix?: string;
}

/** Free-text static label — no data binding */
export interface StaticTextLayer {
  id: string;
  type: 'static_text';
  name: string;
  text: string;
  geometry: BlockGeometry;
  background: BlockBackground;
  typography: BlockTypography;
}

export type CoverLayer =
  | FrameImageLayer
  | HeroBlockLayer
  | TextBlockLayer
  | GroupBlockLayer
  | StaticTextLayer;

// ─── Cover Template ───────────────────────────────────────────────────────────

/**
 * Persisted in Firestore: artifacts/1nspect/public/data/cover_templates/{id}
 * layers[0] = bottom-most; layers[layers.length - 1] = topmost.
 */
export interface CoverTemplate {
  id: string;
  name: string;
  description?: string;
  previewUrl?: string;       // GCS URL of a rendered preview thumbnail
  layers: CoverLayer[];      // ordered bottom → top
  createdAt: string;
  updatedAt: string;
  createdBy: string;         // uid
  isDefault: boolean;        // org-wide default when no cover selected
}

/** Stored on the main inspection template as the default cover choice */
export interface CoverAssignment {
  coverId: string | null;    // null = no cover page
  coverName?: string;        // denormalized for display
}

// ─── PDF rendering contract ───────────────────────────────────────────────────

/**
 * Data passed to PDFService Pass 0.
 * All dynamic tokens are pre-resolved before rendering.
 */
export interface CoverRenderData {
  template: CoverTemplate;
  resolvedTokens: Partial<Record<FieldToken, string>>;
  // resolvedTokens['inspection.coverPhotoUrl'] is the GCS signed URL or null
}
