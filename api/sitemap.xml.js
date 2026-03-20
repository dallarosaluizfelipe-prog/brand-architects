import { createClient } from '@supabase/supabase-js';

const SITE_URL = process.env.SITE_URL ?? 'https://estudiodalla.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '';

/** Static public routes — admin and redirect aliases are intentionally excluded */
const STATIC_PAGES = [
  { path: '/',            priority: '1.0', changefreq: 'weekly'  },
  { path: '/estudio',     priority: '0.8', changefreq: 'monthly' },
  { path: '/metodologia', priority: '0.8', changefreq: 'monthly' },
  { path: '/cases',       priority: '0.9', changefreq: 'weekly'  },
  { path: '/contato',     priority: '0.7', changefreq: 'monthly' },
];

/** Fallback slugs used when Supabase is unreachable */
const FALLBACK_CASES = [
  { slug: 'yerbal',      is_featured: true,  updated_at: null },
  { slug: 'clave',       is_featured: true,  updated_at: null },
  { slug: 'nuts-oclock', is_featured: true,  updated_at: null },
  { slug: 'lummina',     is_featured: true,  updated_at: null },
  { slug: 'dalla',       is_featured: true,  updated_at: null },
  { slug: 'kuma',        is_featured: true,  updated_at: null },
];

function buildXml(staticPages, caseEntries, today) {
  const urlBlock = (loc, lastmod, changefreq, priority) =>
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

  const staticUrls = staticPages.map(p =>
    urlBlock(`${SITE_URL}${p.path}`, today, p.changefreq, p.priority)
  );

  const caseUrls = caseEntries.map(c => {
    const lastmod = c.updated_at ? c.updated_at.split('T')[0] : today;
    const priority = c.is_featured ? '0.9' : '0.7';
    return urlBlock(`${SITE_URL}/cases/${c.slug}`, lastmod, 'monthly', priority);
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticUrls,
    ...caseUrls,
    '</urlset>',
  ].join('\n');
}

export default async function handler(req, res) {
  const today = new Date().toISOString().split('T')[0];
  let cases = [];

  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });

      const { data } = await supabase
        .from('site_cases')
        .select('slug, updated_at, is_featured')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (data && data.length > 0) {
        cases = data;
      }
    } catch {
      // silently fall through to fallback
    }
  }

  if (cases.length === 0) {
    cases = FALLBACK_CASES;
  }

  const xml = buildXml(STATIC_PAGES, cases, today);

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}
