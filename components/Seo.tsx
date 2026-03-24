import { useEffect, useState } from 'react';
import { supabase } from '@/src/integrations/supabase/client';

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  robots?: string;
}

let seoDefaults: { title: string; description: string; keywords: string } | null = null;
let seoLoading: Promise<void> | null = null;

function loadSeoDefaults() {
  if (seoDefaults) return Promise.resolve();
  if (seoLoading) return seoLoading;
  seoLoading = (supabase as any)
    .from('site_content')
    .select('section_key, body')
    .in('section_key', ['seo_default_title', 'seo_default_description', 'seo_default_keywords'])
    .then(({ data }: any) => {
      seoDefaults = {
        title: 'Studio Dalla — High\u2011End Branding Studio',
        description: 'Consultoria de branding e rebranding para marcas de luxo em São Paulo. Transformamos identidades visuais com método, maturidade e visão estratégica.',
        keywords: 'branding luxo, agência branding São Paulo, rebranding marcas premium, identidade visual luxo',
      };
      if (data) {
        for (const row of data) {
          if (row.section_key === 'seo_default_title' && row.body) seoDefaults!.title = row.body;
          if (row.section_key === 'seo_default_description' && row.body) seoDefaults!.description = row.body;
          if (row.section_key === 'seo_default_keywords' && row.body) seoDefaults!.keywords = row.body;
        }
      }
    });
  return seoLoading;
}

const defaultTitle = 'Studio Dalla — High‑End Branding Studio';
const defaultDescription =
  'Consultoria de branding e rebranding para marcas de luxo em São Paulo. Transformamos identidades visuais com método, maturidade e visão estratégica.';
const defaultKeywords =
  'branding luxo, agência branding São Paulo, rebranding marcas premium, identidade visual luxo';

export const Seo: React.FC<SeoProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  robots,
}) => {
  const [defaults, setDefaults] = useState(seoDefaults);

  useEffect(() => {
    loadSeoDefaults().then(() => {
      if (seoDefaults && seoDefaults !== defaults) setDefaults(seoDefaults);
    }).catch(() => {});
  }, []);

  const dTitle = defaults?.title || defaultTitle;
  const dDescription = defaults?.description || defaultDescription;
  const dKeywords = defaults?.keywords || defaultKeywords;

  useEffect(() => {
    document.title = title ? `${title} | Studio Dalla` : dTitle;

    const upsertMeta = (attrs: Record<string, string>) => {
      const name = attrs.name || attrs.property;
      if (!name) return;
      let element: HTMLMetaElement | null = null;
      if (attrs.name) {
        element = document.querySelector(`meta[name="${attrs.name}"]`);
      } else if (attrs.property) {
        element = document.querySelector(`meta[property="${attrs.property}"]`);
      }

      if (!element) {
        element = document.createElement('meta');
        Object.entries(attrs).forEach(([k, v]) => element!.setAttribute(k, v));
        document.head.appendChild(element!);
      } else {
        Object.entries(attrs).forEach(([k, v]) => element!.setAttribute(k, v));
      }
    };

    if (robots) {
      upsertMeta({ name: 'robots', content: robots });
    }
    upsertMeta({ name: 'description', content: description || dDescription });
    upsertMeta({ name: 'keywords', content: keywords || dKeywords });
    upsertMeta({ property: 'og:title', content: title || dTitle });
    upsertMeta({ property: 'og:description', content: description || dDescription });
    upsertMeta({ property: 'og:type', content: 'website' });
    if (image) {
      upsertMeta({ property: 'og:image', content: image });
    }
    const canonical = url || window.location.href;
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);
  }, [title, description, keywords, image, url, robots, dTitle, dDescription, dKeywords]);

  return null;
};
