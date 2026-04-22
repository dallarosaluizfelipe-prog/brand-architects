import { createClient } from '@supabase/supabase-js';

const SITE_URL = process.env.SITE_URL ?? 'https://estudiodalla.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '';

/**
 * Static public routes. Each entry pairs the PT (canonical) path with its EN
 * counterpart so we can emit reciprocal hreflang alternates. Admin, API,
 * proposals and the /links hub are intentionally excluded.
 */
const STATIC_PAIRS = [
  { pt: '/',             en: '/en',             priority: '1.0', changefreq: 'weekly'  },
  { pt: '/estudio',      en: '/en/studio',      priority: '0.8', changefreq: 'monthly' },
  { pt: '/metodologia',  en: '/en/methodology', priority: '0.8', changefreq: 'monthly' },
  { pt: '/cases',        en: '/en/cases',       priority: '0.9', changefreq: 'weekly'  },
  { pt: '/contato',      en: '/en/contact',     priority: '0.7', changefreq: 'monthly' },
];

const FALLBACK_CASES = [
  { slug: 'yerbal',      is_featured: true,  updated_at: null },
  { slug: 'clave',       is_featured: true,  updated_at: null },
  { slug: 'nuts-oclock', is_featured: true,  updated_at: null },
  { slug: 'lummina',     is_featured: true,  updated_at: null },
  { slug: 'dalla',       is_featured: true,  updated_at: null },
  { slug: 'kuma',        is_featured: true,  updated_at: null },
];

const FALLBACK_LPS = [
  { slug: 'identidade-visual', updated_at: null },
];

/** Escape XML reserved chars for safe inclusion in <loc> values. */
const xmlEscape = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const isoDate = (value, fallback) => {
  if (!value) return fallback;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return fallback;
  return d.toISOString().split('T')[0];
};

/**
 * Build a single <url> entry. `alternates` is an array of { hreflang, href }
 * pairs; we always include x-default pointing at the PT URL.
 */
const renderUrl = ({ loc, lastmod, changefreq, priority, alternates }) => {
  const altLines = (alternates || [])
    .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${xmlEscape(a.href)}"/>`)
    .join('\n');
  return [
    '  <url>',
    `    <loc>${xmlEscape(loc)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    altLines,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
};

/**
 * Group dynamic rows (cases/lps) by translation_group so we can pair PT and EN
 * versions and emit reciprocal hreflang alternates on each <url>.
 */
const groupByTranslation = (rows) => {
  const groups = new Map();
  for (const row of rows) {
    const key = row.translation_group || `__${row.locale || 'pt-BR'}__${row.slug}`;
    if (!groups.has(key)) groups.set(key, {});
    const g = groups.get(key);
    if ((row.locale || 'pt-BR') === 'en') g.en = row;
    else g.pt = row;
  }
  return Array.from(groups.values());
};

const buildXml = ({ staticPairs, caseGroups, lpGroups, today }) => {
  const urls = [];

  // Static pages — always have both PT and EN.
  for (const p of staticPairs) {
    const ptHref = `${SITE_URL}${p.pt}`;
    const enHref = `${SITE_URL}${p.en}`;
    const alternates = [
      { hreflang: 'pt-BR', href: ptHref },
      { hreflang: 'en',    href: enHref },
      { hreflang: 'x-default', href: ptHref },
    ];
    urls.push(renderUrl({ loc: ptHref, lastmod: today, changefreq: p.changefreq, priority: p.priority, alternates }));
    urls.push(renderUrl({ loc: enHref, lastmod: today, changefreq: p.changefreq, priority: p.priority, alternates }));
  }

  // Cases — paired by translation_group.
  for (const g of caseGroups) {
    const pt = g.pt;
    const en = g.en;
    const featured = (pt && pt.is_featured) || (en && en.is_featured);
    const priority = featured ? '0.9' : '0.7';

    if (pt) {
      const ptHref = `${SITE_URL}/cases/${pt.slug}`;
      const enHref = en ? `${SITE_URL}/en/cases/${en.slug}` : null;
      const alternates = [
        { hreflang: 'pt-BR', href: ptHref },
        ...(enHref ? [{ hreflang: 'en', href: enHref }] : []),
        { hreflang: 'x-default', href: ptHref },
      ];
      urls.push(renderUrl({
        loc: ptHref,
        lastmod: isoDate(pt.updated_at, today),
        changefreq: 'monthly',
        priority,
        alternates,
      }));
    }
    if (en) {
      const enHref = `${SITE_URL}/en/cases/${en.slug}`;
      const ptHref = pt ? `${SITE_URL}/cases/${pt.slug}` : null;
      const alternates = [
        ...(ptHref ? [{ hreflang: 'pt-BR', href: ptHref }] : []),
        { hreflang: 'en', href: enHref },
        { hreflang: 'x-default', href: ptHref || enHref },
      ];
      urls.push(renderUrl({
        loc: enHref,
        lastmod: isoDate(en.updated_at, today),
        changefreq: 'monthly',
        priority,
        alternates,
      }));
    }
  }

  // LPs — paired by translation_group.
  for (const g of lpGroups) {
    const pt = g.pt;
    const en = g.en;

    if (pt) {
      const ptHref = `${SITE_URL}/lp/${pt.slug}`;
      const enHref = en ? `${SITE_URL}/en/lp/${en.slug}` : null;
      const alternates = [
        { hreflang: 'pt-BR', href: ptHref },
        ...(enHref ? [{ hreflang: 'en', href: enHref }] : []),
        { hreflang: 'x-default', href: ptHref },
      ];
      urls.push(renderUrl({
        loc: ptHref,
        lastmod: isoDate(pt.updated_at, today),
        changefreq: 'monthly',
        priority: '0.8',
        alternates,
      }));
    }
    if (en) {
      const enHref = `${SITE_URL}/en/lp/${en.slug}`;
      const ptHref = pt ? `${SITE_URL}/lp/${pt.slug}` : null;
      const alternates = [
        ...(ptHref ? [{ hreflang: 'pt-BR', href: ptHref }] : []),
        { hreflang: 'en', href: enHref },
        { hreflang: 'x-default', href: ptHref || enHref },
      ];
      urls.push(renderUrl({
        loc: enHref,
        lastmod: isoDate(en.updated_at, today),
        changefreq: 'monthly',
        priority: '0.8',
        alternates,
      }));
    }
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
  ].join('\n');
};

export default async function handler(req, res) {
  const today = new Date().toISOString().split('T')[0];
  let cases = [];
  let lps = [];

  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      });

      const { data: caseData } = await supabase
        .from('site_cases')
        .select('slug, updated_at, is_featured, locale, translation_group')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });
      if (caseData && caseData.length > 0) cases = caseData;

      const { data: lpData } = await supabase
        .from('site_lps')
        .select('slug, updated_at, locale, translation_group')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });
      if (lpData && lpData.length > 0) lps = lpData;
    } catch {
      // silently fall through to fallbacks
    }
  }

  if (cases.length === 0) cases = FALLBACK_CASES;
  if (lps.length === 0) lps = FALLBACK_LPS;

  const caseGroups = groupByTranslation(cases.filter((c) => c.slug));
  const lpGroups   = groupByTranslation(lps.filter((l) => l.slug));

  const xml = buildXml({ staticPairs: STATIC_PAIRS, caseGroups, lpGroups, today });

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}
