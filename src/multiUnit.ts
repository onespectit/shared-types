// BITE 73.7u: Multi-unit tech-spec value parser.
//
// Canonical Firestore shape (produced by mobile AIShadowCapture's
// smartMergeInformationalFields): pipe-separated values with inspector-typed
// "unit N" or "unit one" prefixes per segment, e.g.
//   "unit 1 55.5°F | unit two unable to capture | Unit 3 100.2ºF"
//   "Unit 1: Heat Pump | Unit 2 left rear: Heat Pump | Unit 3: Split System"
//
// Unit number is honored as a positional hint — segment "Unit 3 X" places X
// in column 3, not column N (where N is the segment's array index).

export type UnitValueMap = Map<number, string>;

const WORD_TO_NUMBER: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};

const extractUnitIndex = (segment: string): { idx: number; value: string } | null => {
  const trimmed = segment.trim();
  // Colon-with-qualifier first ("Unit 1 [qualifier]: value")
  let m = trimmed.match(/^unit\s+(\w+)\b[^:]*:\s*(.+)$/i);
  // No-colon fallback ("unit one 73.5°F")
  if (!m) m = trimmed.match(/^unit\s+(\w+)\s+(.+)$/i);
  if (!m) return null;
  const token = m[1].toLowerCase();
  const idx = /^\d+$/.test(token) ? parseInt(token, 10) : WORD_TO_NUMBER[token];
  return idx ? { idx, value: m[2].trim() } : null;
};

/** Parse a pipe-separated multi-unit field value into a map keyed by 1-based
 *  unit index. Returns null if the value contains no pipe or fewer than 2
 *  units could be assigned. Segments without a recognizable "unit N" prefix
 *  fall back to appearance-order placement. */
export const parseMultiUnitValue = (raw: string): UnitValueMap | null => {
  if (!raw || !raw.includes('|')) return null;
  const parts = raw.split('|');
  const map: UnitValueMap = new Map();
  let unprefixed = 0;
  for (const part of parts) {
    const ext = extractUnitIndex(part);
    if (ext) {
      map.set(ext.idx, ext.value);
    } else {
      unprefixed++;
      if (!map.has(unprefixed)) map.set(unprefixed, part.trim());
    }
  }
  return map.size >= 2 ? map : null;
};

/** Returns the highest 1-based unit index found across the supplied raw
 *  field values. 0 if none of the values are multi-unit. */
export const maxUnitCount = (values: Iterable<string>): number => {
  let max = 0;
  for (const v of values) {
    const parsed = parseMultiUnitValue(v);
    if (parsed) {
      for (const k of parsed.keys()) if (k > max) max = k;
    }
  }
  return max;
};
