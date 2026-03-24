import { useState, useEffect } from 'react';
import { supabase } from '@/src/integrations/supabase/client';

interface SiteContentRow {
  section_key: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  image_url: string | null;
  video_url: string | null;
}

const cache = new Map<string, string>();

/**
 * Fetch multiple site_content rows by keys. Returns a map of section_key -> body.
 * Falls back to provided defaults if DB value is missing.
 */
export function useSiteTexts(
  defaults: Record<string, string>
): Record<string, string> {
  const keys = Object.keys(defaults);
  const [texts, setTexts] = useState<Record<string, string>>(() => {
    // Initialize from cache if available
    const initial: Record<string, string> = {};
    for (const key of keys) {
      initial[key] = cache.get(key) ?? defaults[key];
    }
    return initial;
  });

  useEffect(() => {
    // Check if all keys are already cached
    const uncached = keys.filter((k) => !cache.has(k));
    if (uncached.length === 0) return;

    supabase
      .from('site_content')
      .select('section_key, body')
      .in('section_key', keys)
      .then(({ data }) => {
        if (!data) return;
        const result: Record<string, string> = { ...defaults };
        for (const row of data as SiteContentRow[]) {
          if (row.body) {
            result[row.section_key] = row.body;
            cache.set(row.section_key, row.body);
          }
        }
        setTexts(result);
      });
  }, [keys.join(',')]);

  return texts;
}
