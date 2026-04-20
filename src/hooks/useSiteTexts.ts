import { useState, useEffect } from 'react';
import { supabase } from '@/src/integrations/supabase/client';

interface SiteContentRow {
  section_key: string;
  locale: string;
  body: string | null;
}

// Cache keyed by "{locale}:{section_key}" with TTL
const CACHE_TTL_MS = 60_000; // 60 seconds
const cache = new Map<string, { value: string; ts: number }>();

/**
 * Fetch multiple site_content rows by keys for a given locale.
 * Falls back to pt-BR, then to provided defaults.
 */
export function useSiteTexts(
  defaults: Record<string, string>,
  locale: string = 'pt-BR'
): Record<string, string> {
  const keys = Object.keys(defaults);

  const [texts, setTexts] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    const now = Date.now();
    for (const key of keys) {
      const entry = cache.get(`${locale}:${key}`) ?? cache.get(`pt-BR:${key}`);
      initial[key] = (entry && now - entry.ts < CACHE_TTL_MS) ? entry.value : defaults[key];
    }
    return initial;
  });

  useEffect(() => {
    const localesToFetch = Array.from(
      new Set([locale, ...(locale !== 'pt-BR' ? ['pt-BR'] : [])])
    );

    const now = Date.now();
    const uncached = keys.filter(
      (k) => localesToFetch.some((l) => {
        const entry = cache.get(`${l}:${k}`);
        return !entry || now - entry.ts >= CACHE_TTL_MS;
      })
    );
    if (uncached.length === 0) return;

    (supabase as any)
      .from('site_content')
      .select('section_key, locale, body')
      .in('section_key', keys)
      .in('locale', localesToFetch)
      .then(({ data }: { data: SiteContentRow[] | null }) => {
        if (!data) return;

        const byLocale: Record<string, Record<string, string>> = {};
        for (const row of data as SiteContentRow[]) {
          if (!row.body) continue;
          if (!byLocale[row.locale]) byLocale[row.locale] = {};
          byLocale[row.locale][row.section_key] = row.body;
          cache.set(`${row.locale}:${row.section_key}`, { value: row.body, ts: Date.now() });
        }

        const result: Record<string, string> = { ...defaults };
        for (const key of keys) {
          const val =
            byLocale[locale]?.[key] ??
            byLocale['pt-BR']?.[key] ??
            defaults[key];
          result[key] = val;
        }
        setTexts(result);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys.join(','), locale]);

  return texts;
}
