import { useEffect } from 'react';
import { supabase } from '@/src/integrations/supabase/client';

interface TagRow {
  tag_type: string;
  tag_id: string;
}

const injectedScripts: HTMLElement[] = [];

function cleanup() {
  injectedScripts.forEach((el) => el.parentNode?.removeChild(el));
  injectedScripts.length = 0;
}

function appendScript(attrs: Record<string, string>, inline?: string) {
  const script = document.createElement('script');
  Object.entries(attrs).forEach(([k, v]) => script.setAttribute(k, v));
  if (inline) script.textContent = inline;
  document.head.appendChild(script);
  injectedScripts.push(script);
}

function appendNoscript(html: string) {
  const ns = document.createElement('noscript');
  ns.innerHTML = html;
  document.body.appendChild(ns);
  injectedScripts.push(ns);
}

function injectGA4(id: string) {
  appendScript({ async: '', src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}` });
  appendScript({}, [
    'window.dataLayer=window.dataLayer||[];',
    'function gtag(){dataLayer.push(arguments);}',
    "gtag('js',new Date());",
    `gtag('config','${id}');`,
  ].join(''));
}

function injectGTM(id: string) {
  appendScript({}, [
    `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':`,
    `new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],`,
    `j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=`,
    `'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);`,
    `})(window,document,'script','dataLayer','${id}');`,
  ].join(''));
  appendNoscript(
    `<iframe src="https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(id)}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
  );
}

function injectFacebookPixel(id: string) {
  appendScript({}, [
    `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?`,
    `n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;`,
    `n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;`,
    `t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,`,
    `document,'script','https://connect.facebook.net/en_US/fbevents.js');`,
    `fbq('init','${id}');fbq('track','PageView');`,
  ].join(''));
  appendNoscript(
    `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${encodeURIComponent(id)}&ev=PageView&noscript=1"/>`
  );
}

function injectClarity(id: string) {
  appendScript({}, [
    `(function(c,l,a,r,i,t,y){`,
    `c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};`,
    `t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;`,
    `y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);`,
    `})(window,document,"clarity","script","${id}");`,
  ].join(''));
}

function injectGoogleAds(id: string) {
  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    appendScript({ async: '', src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}` });
    appendScript({}, [
      'window.dataLayer=window.dataLayer||[];',
      'function gtag(){dataLayer.push(arguments);}',
      "gtag('js',new Date());",
    ].join(''));
  }
  appendScript({}, `gtag('config','${id}');`);
}

const TrackingScripts: React.FC = () => {
  useEffect(() => {
    if (window.location.pathname.startsWith('/admin') || window.location.hash === '#admin') return;

    let cancelled = false;

    supabase
      .from('site_tags')
      .select('tag_type, tag_id')
      .eq('is_active', true)
      .then(({ data }) => {
        if (cancelled || !data || data.length === 0) return;

        cleanup();

        (data as TagRow[]).forEach((tag) => {
          switch (tag.tag_type) {
            case 'ga4':
              injectGA4(tag.tag_id);
              break;
            case 'gtm':
              injectGTM(tag.tag_id);
              break;
            case 'facebook_pixel':
              injectFacebookPixel(tag.tag_id);
              break;
            case 'google_ads':
              injectGoogleAds(tag.tag_id);
              break;
            case 'clarity':
              injectClarity(tag.tag_id);
              break;
            default:
              break;
          }
        });
      });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
};

export default TrackingScripts;
