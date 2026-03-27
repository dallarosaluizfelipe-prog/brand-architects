import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/src/integrations/supabase/client';

function getSessionId(): string {
  const KEY = 'dalla_sid';
  let sid = sessionStorage.getItem(KEY);
  if (!sid) {
    sid = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(KEY, sid);
  }
  return sid;
}

export function pushToDataLayer(event: string, data?: Record<string, any>) {
  try {
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event, ...data });
  } catch {
    // silent fail
  }
}

export async function trackPageView(path: string) {
  try {
    await supabase.from('site_page_views').insert({
      page_path: path.slice(0, 500),
      session_id: getSessionId(),
      referrer: document.referrer ? document.referrer.slice(0, 1000) : null,
      user_agent: navigator.userAgent ? navigator.userAgent.slice(0, 500) : null,
    });
  } catch {
    // silent fail
  }
}

export async function trackEvent(eventType: string, metadata?: Record<string, unknown>) {
  try {
    await supabase.from('site_events').insert([{
      event_type: eventType.slice(0, 100),
      page_path: window.location.pathname.slice(0, 500),
      metadata: (metadata || {}) as any,
      session_id: getSessionId(),
    }]);
  } catch {
    // silent fail
  }
}

export async function trackFormSubmission(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  challenge?: string;
  message?: string;
}) {
  try {
    await supabase.from('site_form_submissions').insert({
      name: (data.name || '').slice(0, 200),
      email: (data.email || '').slice(0, 200),
      phone: data.phone ? data.phone.slice(0, 50) : null,
      company: data.company ? data.company.slice(0, 200) : null,
      challenge: data.challenge ? data.challenge.slice(0, 200) : null,
      message: data.message ? data.message.slice(0, 2000) : null,
      page_path: window.location.pathname.slice(0, 500),
    });
  } catch {
    // silent fail
  }
}

export function useAnalytics() {
  const location = useLocation();
  const lastTracked = useRef('');

  useEffect(() => {
    const path = location.pathname;
    if (path === lastTracked.current) return;
    if (path.startsWith('/admin')) return;
    lastTracked.current = path;
    trackPageView(path);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href') || '';
      if (href.includes('wa.me') || href.includes('whatsapp.com') || href.includes('api.whatsapp.com')) {
        trackEvent('whatsapp_click', { href });
        pushToDataLayer('dalla_whatsapp_click', { page_path: window.location.pathname, href });
      }
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, []);
}
