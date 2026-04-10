import { supabase } from '../integrations/supabase/client';

export interface LpPhase {
  id: string;
  label: string;
  title: string;
  desc: string;
}

export interface LpBenefitItem {
  icon: string;
  title: string;
  desc: string;
}

export interface LpCaseItem {
  slug: string;
  title: string;
  category: string;
  cover_url: string;
}

export interface SiteLp {
  id?: string;
  slug: string;
  title: string;
  is_visible: boolean;
  display_order: number;

  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_cta_url: string;
  hero_video_desktop: string;
  hero_video_mobile: string;
  hero_poster: string;

  about_badge: string;
  about_title: string;
  about_paragraphs: string[];
  about_cta_text: string;
  about_cta_url: string;
  about_video_url: string;

  method_badge: string;
  method_title: string;
  method_subtitle: string;
  method_phases: LpPhase[];
  method_cta_text: string;
  method_cta_url: string;

  benefits_badge: string;
  benefits_title: string;
  benefits_subtitle: string;
  benefits_items: LpBenefitItem[];
  benefits_cta_text: string;
  benefits_cta_url: string;

  cases_badge: string;
  cases_title: string;
  cases_subtitle: string;
  cases_items: LpCaseItem[];
  cases_cta_text: string;
  cases_cta_url: string;

  partners_badge: string;
  partners_title: string;
  partners_subtitle: string;
  partners_show: boolean;
  partners_cta_text: string;
  partners_cta_url: string;

  meta_title: string;
  meta_description: string;
  meta_keywords: string;

  created_at?: string;
  updated_at?: string;
}

const normalizeLp = (item: any): SiteLp => ({
  id: item.id,
  slug: item.slug ?? '',
  title: item.title ?? '',
  is_visible: item.is_visible !== false,
  display_order: item.display_order ?? 0,

  hero_badge: item.hero_badge ?? '',
  hero_title: item.hero_title ?? '',
  hero_subtitle: item.hero_subtitle ?? '',
  hero_cta_text: item.hero_cta_text ?? 'Solicitar proposta',
  hero_cta_url: item.hero_cta_url ?? '/contato',
  hero_video_desktop: item.hero_video_desktop ?? '',
  hero_video_mobile: item.hero_video_mobile ?? '',
  hero_poster: item.hero_poster ?? '',

  about_badge: item.about_badge ?? '',
  about_title: item.about_title ?? '',
  about_paragraphs: Array.isArray(item.about_paragraphs) ? item.about_paragraphs : [],
  about_cta_text: item.about_cta_text ?? '',
  about_cta_url: item.about_cta_url ?? '',
  about_video_url: item.about_video_url ?? '',

  method_badge: item.method_badge ?? '',
  method_title: item.method_title ?? '',
  method_subtitle: item.method_subtitle ?? '',
  method_phases: Array.isArray(item.method_phases) ? item.method_phases : [],
  method_cta_text: item.method_cta_text ?? '',
  method_cta_url: item.method_cta_url ?? '',

  benefits_badge: item.benefits_badge ?? '',
  benefits_title: item.benefits_title ?? '',
  benefits_subtitle: item.benefits_subtitle ?? '',
  benefits_items: Array.isArray(item.benefits_items) ? item.benefits_items : [],
  benefits_cta_text: item.benefits_cta_text ?? '',
  benefits_cta_url: item.benefits_cta_url ?? '',

  cases_badge: item.cases_badge ?? '',
  cases_title: item.cases_title ?? '',
  cases_subtitle: item.cases_subtitle ?? '',
  cases_items: Array.isArray(item.cases_items) ? item.cases_items : [],
  cases_cta_text: item.cases_cta_text ?? '',
  cases_cta_url: item.cases_cta_url ?? '',

  partners_badge: item.partners_badge ?? '',
  partners_title: item.partners_title ?? '',
  partners_subtitle: item.partners_subtitle ?? '',
  partners_show: item.partners_show !== false,
  partners_cta_text: item.partners_cta_text ?? '',
  partners_cta_url: item.partners_cta_url ?? '',

  meta_title: item.meta_title ?? '',
  meta_description: item.meta_description ?? '',
  meta_keywords: item.meta_keywords ?? '',

  created_at: item.created_at,
  updated_at: item.updated_at,
});

export const getLpBySlug = async (slug: string): Promise<SiteLp | null> => {
  try {
    const { data, error } = await (supabase as any)
      .from('site_lps')
      .select('*')
      .eq('slug', slug)
      .eq('is_visible', true)
      .single();

    if (error || !data) return null;
    return normalizeLp(data);
  } catch {
    return null;
  }
};

export const listLps = async (): Promise<SiteLp[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from('site_lps')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true });

    if (error || !data) return [];
    return data.map(normalizeLp);
  } catch {
    return [];
  }
};
