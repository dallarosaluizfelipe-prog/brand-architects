import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function getSessionId(): string {
  const KEY = 'dalla_sid';
  let sid = sessionStorage.getItem(KEY);
  if (!sid) {
    sid = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(KEY, sid);
  }
  return sid;
}

async function sendTrack(type: string, data: Record<string, unknown>) {
  try {
    const payload = { type, data: { ...data, session_id: getSessionId() } };
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon('/api/track', blob);
    } else {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      });
    }
  } catch {
    // silent fail — analytics should never break the site
  }
}

export function trackPageView(path: string) {
  sendTrack('pageview', {
    page_path: path,
    referrer: document.referrer || null,
  });
}

export function trackEvent(eventType: string, metadata?: Record<string, unknown>) {
  sendTrack('event', {
    event_type: eventType,
    page_path: window.location.pathname,
    metadata: metadata || {},
  });
}

export function trackFormSubmission(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  challenge?: string;
  message?: string;
}) {
  sendTrack('form_submission', {
    ...data,
    page_path: window.location.pathname,
  });
}

/**
 * Hook that auto-tracks page views on route change
 * and intercepts WhatsApp link clicks globally.
 */
export function useAnalytics() {
  const location = useLocation();
  const lastTracked = useRef('');

  // Track page views on route change
  useEffect(() => {
    const path = location.pathname;
    if (path === lastTracked.current) return;
    // Skip admin
    if (path.startsWith('/admin')) return;
    lastTracked.current = path;
    trackPageView(path);
  }, [location.pathname]);

  // Global WhatsApp click interceptor
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href') || '';
      if (href.includes('wa.me') || href.includes('whatsapp.com') || href.includes('api.whatsapp.com')) {
        trackEvent('whatsapp_click', { href });
      }
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, []);
}
