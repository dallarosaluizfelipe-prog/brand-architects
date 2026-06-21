import type { CSSProperties } from 'react';

export interface TextStyle {
  color?: string;
  weight?: number;
  letterSpacing?: number; // em
}

export type TextStylesMap = Record<string, TextStyle | undefined>;

export const NUNITO_WEIGHTS: { value: number; label: string }[] = [
  { value: 200, label: '200 Extra Light' },
  { value: 300, label: '300 Light (padrão)' },
  { value: 400, label: '400 Regular' },
  { value: 600, label: '600 Semi Bold' },
  { value: 700, label: '700 Bold' },
  { value: 800, label: '800 Extra Bold' },
  { value: 900, label: '900 Black' },
];

export function getFieldStyle(
  styles: TextStylesMap | null | undefined,
  field: string,
): CSSProperties {
  const s = styles?.[field];
  if (!s) return {};
  const out: CSSProperties = {};
  if (s.color) out.color = s.color;
  if (typeof s.weight === 'number') out.fontWeight = s.weight;
  if (typeof s.letterSpacing === 'number') out.letterSpacing = `${s.letterSpacing}em`;
  return out;
}

export function setFieldStyle(
  styles: TextStylesMap | null | undefined,
  field: string,
  patch: Partial<TextStyle>,
): TextStylesMap {
  const current = styles?.[field] ?? {};
  const next: TextStyle = { ...current, ...patch };
  // Strip empty fields
  if (!next.color) delete next.color;
  if (next.weight == null || Number.isNaN(next.weight)) delete next.weight;
  if (next.letterSpacing == null || Number.isNaN(next.letterSpacing)) delete next.letterSpacing;
  const out = { ...(styles ?? {}) };
  if (Object.keys(next).length === 0) {
    delete out[field];
  } else {
    out[field] = next;
  }
  return out;
}

export function hasFieldStyle(
  styles: TextStylesMap | null | undefined,
  field: string,
): boolean {
  const s = styles?.[field];
  return !!s && (!!s.color || s.weight != null || s.letterSpacing != null);
}