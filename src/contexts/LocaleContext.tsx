import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { switchLocaleHref, detectLocaleFromPath } from '../utils/localeRoutes';

export type Locale = 'pt-BR' | 'en';

const STORAGE_KEY = 'dalla_locale';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'pt-BR',
  setLocale: () => undefined,
});

export const useLocale = () => useContext(LocaleContext);

/** Detect preferred locale in priority order (excluding URL, which is handled separately) */
function detectPreferredLocale(): Locale {
  // 1. localStorage preference (manually chosen)
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored === 'en' || stored === 'pt-BR') return stored;

  // 2. Browser Accept-Language / navigator.languages
  const langs = navigator.languages ?? [navigator.language];
  for (const lang of langs) {
    if (lang.startsWith('en')) return 'en';
    if (lang.startsWith('pt')) return 'pt-BR';
  }

  return 'pt-BR';
}

/** Returns true if the current user agent looks like a bot/crawler */
function isBot(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  return /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|google|baidu|yandex|duckduck/.test(ua);
}

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathLocale = detectLocaleFromPath(location.pathname);
  const [locale, setLocaleState] = useState<Locale>(pathLocale ?? 'pt-BR');

  const setLocale = useCallback((newLocale: Locale) => {
    localStorage.setItem(STORAGE_KEY, newLocale);
    const href = switchLocaleHref(location.pathname, newLocale);
    setLocaleState(newLocale);
    navigate(href, { replace: true });
  }, [location.pathname, navigate]);

  // Sync locale state when path changes (e.g. user clicks a link to /en/...)
  useEffect(() => {
    const pl = detectLocaleFromPath(location.pathname);
    if (pl) {
      setLocaleState(pl);
      // Persist path-based locale only if not explicitly stored yet
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) localStorage.setItem(STORAGE_KEY, pl);
    }
  }, [location.pathname]);

  // Auto-redirect on first visit only — skip bots and skip if already in correct locale
  useEffect(() => {
    if (isBot()) return;

    const alreadyRedirected = sessionStorage.getItem('dalla_redirected');
    if (alreadyRedirected) return;

    // Only redirect from neutral root paths (no explicit locale in URL)
    const inEnPath = location.pathname.startsWith('/en');
    const preferred = detectPreferredLocale();

    sessionStorage.setItem('dalla_redirected', '1');

    if (preferred === 'en' && !inEnPath) {
      const href = switchLocaleHref(location.pathname, 'en');
      navigate(href, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update <html lang>
  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'pt-BR';
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};
