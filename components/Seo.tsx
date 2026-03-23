import { useEffect } from 'react';

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  robots?: string;
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
  useEffect(() => {
    document.title = title ? `${title} | Studio Dalla` : defaultTitle;

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
    upsertMeta({ name: 'description', content: description || defaultDescription });
    upsertMeta({ name: 'keywords', content: keywords || defaultKeywords });
    upsertMeta({ property: 'og:title', content: title || defaultTitle });
    upsertMeta({ property: 'og:description', content: description || defaultDescription });
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
  }, [title, description, keywords, image, url, robots]);

  return null;
};
