import type { Locale } from '../contexts/LocaleContext';

// Maps Portuguese routes to English equivalents
const PT_TO_EN: Record<string, string> = {
  '/': '/en',
  '/estudio': '/en/studio',
  '/metodologia': '/en/methodology',
  '/cases': '/en/cases',
  '/contato': '/en/contact',
};

// Maps English routes to Portuguese equivalents
const EN_TO_PT: Record<string, string> = {
  '/en': '/',
  '/en/studio': '/estudio',
  '/en/methodology': '/metodologia',
  '/en/cases': '/cases',
  '/en/contact': '/contato',
};

/**
 * Given the current pathname and target locale, return the equivalent path.
 * Handles dynamic segments like /cases/:slug, /lp/:slug, /proposta/:slug
 */
export function switchLocaleHref(currentPath: string, targetLocale: Locale): string {
  if (targetLocale === 'en') {
    // Already in EN
    if (currentPath.startsWith('/en')) return currentPath;

    // Static route match
    if (PT_TO_EN[currentPath]) return PT_TO_EN[currentPath];

    // Dynamic: /cases/:slug → /en/cases/:slug
    const dynamicMatch = currentPath.match(/^\/(cases|lp|proposta)\/(.+)$/);
    if (dynamicMatch) {
      const [, segment, slug] = dynamicMatch;
      const enSegment = segment === 'proposta' ? 'proposal' : segment === 'lp' ? 'lp' : 'cases';
      return `/en/${enSegment}/${slug}`;
    }

    // Default: prefix with /en
    return `/en${currentPath}`;
  }

  // Target is pt-BR
  if (!currentPath.startsWith('/en')) return currentPath;

  // Strip /en prefix for static match
  const withoutEn = currentPath === '/en' ? '/en' : currentPath;
  if (EN_TO_PT[withoutEn]) return EN_TO_PT[withoutEn];

  // Dynamic: /en/cases/:slug → /cases/:slug
  const dynamicMatch = currentPath.match(/^\/en\/(cases|lp|proposal)\/(.+)$/);
  if (dynamicMatch) {
    const [, segment, slug] = dynamicMatch;
    const ptSegment = segment === 'proposal' ? 'proposta' : segment;
    return `/${ptSegment}/${slug}`;
  }

  // Strip /en prefix
  const stripped = currentPath.replace(/^\/en/, '');
  return stripped || '/';
}

/**
 * Returns the locale explicitly encoded in the path, or null if neutral.
 */
export function detectLocaleFromPath(pathname: string): Locale | null {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en';
  return null;
}

/**
 * Returns the canonical base URL for a given locale and path.
 */
export function localeCanonical(locale: Locale, path: string): string {
  const base = 'https://estudiodalla.com';
  if (locale === 'en') {
    return `${base}${path.startsWith('/en') ? path : `/en${path}`}`;
  }
  return `${base}${path.startsWith('/en') ? switchLocaleHref(path, 'pt-BR') : path}`;
}
