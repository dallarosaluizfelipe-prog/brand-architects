import { supabase } from '../integrations/supabase/client';

export interface SiteProposal {
  id?: string;
  slug: string;
  title: string;
  subtitle: string;
  banner_url: string;
  client_name: string;
  client_contact: string;
  scope: string;
  timeline: string;
  about: string;
  footer_links: { label: string; url: string }[];
  is_public: boolean;
  locale?: string;
  translation_group?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  meta_robots?: string;
  created_at?: string;
  updated_at?: string;
}

const normalizeProposal = (item: any): SiteProposal => ({
  id: item.id,
  slug: item.slug ?? '',
  title: item.title ?? '',
  subtitle: item.subtitle ?? '',
  banner_url: item.banner_url ?? '',
  client_name: item.client_name ?? '',
  client_contact: item.client_contact ?? '',
  scope: item.scope ?? '',
  timeline: item.timeline ?? '',
  about: item.about ?? '',
  footer_links: Array.isArray(item.footer_links) ? item.footer_links : [],
  is_public: item.is_public !== false,
  meta_title: item.meta_title ?? '',
  meta_description: item.meta_description ?? '',
  meta_keywords: item.meta_keywords ?? '',
  meta_robots: item.meta_robots ?? 'noindex, nofollow',
  created_at: item.created_at,
  updated_at: item.updated_at,
});

export const getProposalBySlug = async (slug: string, locale: string = 'pt-BR'): Promise<SiteProposal | null> => {
  try {
    let { data, error } = await (supabase as any)
      .from('site_proposals')
      .select('*')
      .eq('slug', slug)
      .eq('is_public', true)
      .eq('locale', locale)
      .single();

    if ((error || !data) && locale !== 'pt-BR') {
      ({ data, error } = await (supabase as any)
        .from('site_proposals')
        .select('*')
        .eq('slug', slug)
        .eq('is_public', true)
        .eq('locale', 'pt-BR')
        .single());
    }

    if (error || !data) return null;
    return normalizeProposal(data);
  } catch {
    return null;
  }
};

export const slugify = (clientName: string, title: string): string => {
  const raw = `proposta-${clientName}-${title}`;
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};
