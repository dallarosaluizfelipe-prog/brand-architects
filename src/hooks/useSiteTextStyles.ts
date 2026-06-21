import { useEffect, useState } from 'react';
import { supabase } from '@/src/integrations/supabase/client';
import { getFieldStyle, TextStylesMap } from '../utils/textStyles';
import type { CSSProperties } from 'react';
import { SITE_CONTENT_INVALIDATE_EVENT } from './useSiteTexts';

interface Row {
  section_key: string;
  locale: string;
  text_styles: TextStylesMap | null;
}

const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { value: TextStylesMap; ts: number }>();

/**
 * Returns a map of `section_key -> React.CSSProperties` for each provided key,
 * built from the `text_styles` JSON column of `site_content` rows.
 *
 * Each row's text_styles is expected to have a `default` entry; the returned
 * CSS targets that entry. Apply via `<h1 style={styles.someKey}>...`.
 */
export function useSiteTextStyles(
  keys: string[],
  locale: string = 'pt-BR',
): Record<string, CSSProperties> {
  const [styles, setStyles] = useState<Record<string, CSSProperties>>({});
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const h = () => setTick((n) => n + 1);
    window.addEventListener(SITE_CONTENT_INVALIDATE_EVENT, h);
    return () => window.removeEventListener(SITE_CONTENT_INVALIDATE_EVENT, h);
  }, []);

  useEffect(() => {
    if (!keys.length) return;
    const localesToFetch = Array.from(new Set([locale, ...(locale !== 'pt-BR' ? ['pt-BR'] : [])]));
    const now = Date.now();
    const needsFetch = keys.some((k) =>
      localesToFetch.some((l) => {
        const e = cache.get(`${l}:${k}`);
        return !e || now - e.ts >= CACHE_TTL_MS;
      }),
    );

    const buildFromCache = () => {
      const out: Record<string, CSSProperties> = {};
      for (const k of keys) {
        const entry = cache.get(`${locale}:${k}`) ?? cache.get(`pt-BR:${k}`);
        if (entry?.value) out[k] = getFieldStyle(entry.value, 'default');
      }
      setStyles(out);
    };

    if (!needsFetch && tick === 0) {
      buildFromCache();
      return;
    }

    (supabase as any)
      .from('site_content')
      .select('section_key, locale, text_styles')
      .in('section_key', keys)
      .in('locale', localesToFetch)
      .then(({ data }: { data: Row[] | null }) => {
        if (!data) return;
        for (const row of data) {
          if (!row.text_styles) continue;
          cache.set(`${row.locale}:${row.section_key}`, {
            value: row.text_styles,
            ts: Date.now(),
          });
        }
        buildFromCache();
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys.join(','), locale, tick]);

  return styles;
}