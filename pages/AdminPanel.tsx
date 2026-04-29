import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/integrations/supabase/client';
import { SiteProposal, slugify } from '../src/data/siteProposals';
import { SiteLp, LpPhase, LpBenefitItem, LpCaseItem } from '../src/data/siteLps';
import RichTextEditor from '../src/components/RichTextEditor';
import { getWhatsAppUrl } from '@/src/utils/contact';

interface AdminPanelProps {
  pin: string;
  onLogout: () => void;
}

interface SiteCase {
  id?: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  cover_url: string;
  gallery_urls: string[];
  author: string;
  case_date: string;
  external_url: string;
  cta_text: string;
  cta_url: string;
  display_order: number;
  is_featured: boolean;
  is_visible: boolean;
  locale?: string;
  translation_group?: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

interface HeroSettings {
  desktopVideoUrl: string;
  mobileVideoUrl: string;
  posterUrl: string;
}

interface SiteTag {
  id?: string;
  tag_type: string;
  tag_id: string;
  label: string;
  is_active: boolean;
}

interface SitePartner {
  id?: string;
  name: string;
  logo_url: string;
  link_url: string;
  display_order: number;
  is_visible: boolean;
}

const TAG_TYPES = [
  { value: 'ga4', label: 'Google Analytics 4', placeholder: 'G-XXXXXXXXXX' },
  { value: 'gtm', label: 'Google Tag Manager', placeholder: 'GTM-XXXXXXX' },
  { value: 'facebook_pixel', label: 'Facebook Pixel', placeholder: '123456789012345' },
  { value: 'google_ads', label: 'Google Ads', placeholder: 'AW-XXXXXXXXX' },
  { value: 'custom', label: 'Custom', placeholder: 'ID ou codigo customizado' },
];

interface AnalyticsSummary {
  total_page_views: number;
  whatsapp_clicks: number;
  form_submissions: number;
  top_pages: { page: string; count: number }[];
  top_regions: { region: string; count: number }[];
  daily_views: Record<string, number>;
  period_label: string;
}

const emptyAnalyticsSummary: AnalyticsSummary = {
  total_page_views: 0,
  whatsapp_clicks: 0,
  form_submissions: 0,
  top_pages: [],
  top_regions: [],
  daily_views: {},
  period_label: '',
};

const normalizeAnalyticsSummary = (raw: any): AnalyticsSummary => {
  if (!raw || typeof raw !== 'object') {
    return { ...emptyAnalyticsSummary };
  }

  const rawDailyViews = raw.daily_views ?? raw.dailyViews;
  const normalizedDailyViews: Record<string, number> = {};

  if (rawDailyViews && typeof rawDailyViews === 'object' && !Array.isArray(rawDailyViews)) {
    for (const [day, count] of Object.entries(rawDailyViews)) {
      normalizedDailyViews[String(day)] = Number(count) || 0;
    }
  }

  return {
    total_page_views: Number(raw.total_page_views) || 0,
    whatsapp_clicks: Number(raw.whatsapp_clicks) || 0,
    form_submissions: Number(raw.form_submissions) || 0,
    top_pages: Array.isArray(raw.top_pages)
      ? raw.top_pages.map((p: any) => ({ page: String(p?.page || '/'), count: Number(p?.count) || 0 }))
      : [],
    top_regions: Array.isArray(raw.top_regions)
      ? raw.top_regions.map((r: any) => ({ region: String(r?.region || 'Desconhecido'), count: Number(r?.count) || 0 }))
      : [],
    daily_views: normalizedDailyViews,
    period_label: String(raw.period_label || ''),
  };
};

interface FormSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  challenge: string | null;
  message: string | null;
  page_path: string | null;
  created_at: string;
}

interface TextFieldDef {
  key: string;
  label: string;
  rich?: boolean;
  type?: 'text' | 'image';
}

interface PageConfig {
  id: string;
  label: string;
  icon: string;
  seo: TextFieldDef[];
  textos: TextFieldDef[];
  imagens: TextFieldDef[];
  hasHero?: boolean;
}

const PAGE_CONFIGS: PageConfig[] = [
  {
    id: 'home',
    label: 'Home',
    icon: '🏠',
    hasHero: true,
    seo: [
      { key: 'home_seo_title', label: 'Meta Title' },
      { key: 'home_seo_description', label: 'Meta Description' },
      { key: 'home_seo_keywords', label: 'Meta Keywords' },
      { key: 'home_og_image', label: 'Imagem OG (Preview ao compartilhar)', type: 'image' },
    ],
    textos: [
      { key: 'home_hero_badge', label: 'Badge do Hero' },
      { key: 'home_hero_title', label: 'Titulo do Hero' },
      { key: 'home_hero_subtitle', label: 'Subtitulo do Hero', rich: true },
      { key: 'home_cases_title', label: 'Titulo da Secao Cases' },
      { key: 'home_cases_subtitle', label: 'Subtitulo da Secao Cases', rich: true },
      { key: 'home_partners_title', label: 'Titulo Parceiros' },
      { key: 'home_partners_subtitle', label: 'Subtitulo Parceiros', rich: true },
    ],
    imagens: [],
  },
  {
    id: 'about',
    label: 'Estúdio',
    icon: '✦',
    seo: [
      { key: 'about_seo_title', label: 'Meta Title' },
      { key: 'about_seo_description', label: 'Meta Description' },
      { key: 'about_seo_keywords', label: 'Meta Keywords' },
      { key: 'about_og_image', label: 'Imagem OG (Preview ao compartilhar)', type: 'image' },
    ],
    textos: [
      { key: 'about_header_badge', label: 'Badge do Header' },
      { key: 'about_header_title', label: 'Titulo do Header' },
      { key: 'about_header_subtitle', label: 'Subtitulo do Header', rich: true },
      { key: 'about_vision_title', label: 'Titulo Visao' },
      { key: 'about_vision_p1', label: 'Visao - Paragrafo 1', rich: true },
      { key: 'about_vision_p2', label: 'Visao - Paragrafo 2', rich: true },
      { key: 'about_expert_badge', label: 'Especialista - Badge' },
      { key: 'about_expert_title', label: 'Especialista - Nome e Cargo' },
      { key: 'about_expert_role', label: 'Especialista - Cargo' },
      { key: 'about_expert_p1', label: 'Especialista - Paragrafo 1', rich: true },
      { key: 'about_expert_p2', label: 'Especialista - Paragrafo 2', rich: true },
      { key: 'about_expert_p3', label: 'Especialista - Paragrafo 3', rich: true },
      { key: 'about_pillars_badge', label: 'Badge dos Pilares' },
      { key: 'about_pillars_title', label: 'Titulo dos Pilares' },
      { key: 'about_pillar1_title', label: 'Pilar 1 - Titulo' },
      { key: 'about_pillar1_desc', label: 'Pilar 1 - Descricao', rich: true },
      { key: 'about_pillar2_title', label: 'Pilar 2 - Titulo' },
      { key: 'about_pillar2_desc', label: 'Pilar 2 - Descricao', rich: true },
      { key: 'about_pillar3_title', label: 'Pilar 3 - Titulo' },
      { key: 'about_pillar3_desc', label: 'Pilar 3 - Descricao', rich: true },
    ],
    imagens: [
      { key: 'about_expert_photo_url', label: 'Especialista - URL da Foto' },
      { key: 'about_vision_video_url', label: 'Visao - URL do Video' },
      { key: 'about_bottom_image_url', label: 'Imagem Inferior - URL' },
    ],
  },
  {
    id: 'methodology',
    label: 'Metodologia',
    icon: '◆',
    seo: [
      { key: 'methodology_seo_title', label: 'Meta Title' },
      { key: 'methodology_seo_description', label: 'Meta Description' },
      { key: 'methodology_seo_keywords', label: 'Meta Keywords' },
      { key: 'methodology_og_image', label: 'Imagem OG (Preview ao compartilhar)', type: 'image' },
    ],
    textos: [
      { key: 'method_header_badge', label: 'Badge do Header' },
      { key: 'method_header_title', label: 'Titulo do Header' },
      { key: 'method_header_subtitle', label: 'Subtitulo do Header', rich: true },
      { key: 'method_phase1_label', label: 'Fase I - Label' },
      { key: 'method_phase1_title', label: 'Fase I - Titulo' },
      { key: 'method_phase1_desc', label: 'Fase I - Descricao', rich: true },
      { key: 'method_phase2_label', label: 'Fase II - Label' },
      { key: 'method_phase2_title', label: 'Fase II - Titulo' },
      { key: 'method_phase2_desc', label: 'Fase II - Descricao', rich: true },
      { key: 'method_phase3_label', label: 'Fase III - Label' },
      { key: 'method_phase3_title', label: 'Fase III - Titulo' },
      { key: 'method_phase3_desc', label: 'Fase III - Descricao', rich: true },
      { key: 'method_phase4_label', label: 'Fase IV - Label' },
      { key: 'method_phase4_title', label: 'Fase IV - Titulo' },
      { key: 'method_phase4_desc', label: 'Fase IV - Descricao', rich: true },
      { key: 'method_phase5_label', label: 'Fase V - Label' },
      { key: 'method_phase5_title', label: 'Fase V - Titulo' },
      { key: 'method_phase5_desc', label: 'Fase V - Descricao', rich: true },
    ],
    imagens: [],
  },
  {
    id: 'portfolio',
    label: 'Portfólio',
    icon: '▣',
    seo: [
      { key: 'portfolio_seo_title', label: 'Meta Title' },
      { key: 'portfolio_seo_description', label: 'Meta Description' },
      { key: 'portfolio_seo_keywords', label: 'Meta Keywords' },
      { key: 'portfolio_og_image', label: 'Imagem OG (Preview ao compartilhar)', type: 'image' },
    ],
    textos: [
      { key: 'portfolio_header_title', label: 'Titulo do Header' },
      { key: 'portfolio_header_subtitle', label: 'Subtitulo do Header', rich: true },
    ],
    imagens: [],
  },
  {
    id: 'contact',
    label: 'Contato',
    icon: '✉',
    seo: [
      { key: 'contact_seo_title', label: 'Meta Title' },
      { key: 'contact_seo_description', label: 'Meta Description' },
      { key: 'contact_seo_keywords', label: 'Meta Keywords' },
      { key: 'contact_og_image', label: 'Imagem OG (Preview ao compartilhar)', type: 'image' },
    ],
    textos: [
      { key: 'contact_header_title', label: 'Titulo do Header' },
      { key: 'contact_info', label: 'Info de Contato (endereco/tel)', rich: true },
      { key: 'contact_emails', label: 'Emails', rich: true },
    ],
    imagens: [],
  },
  {
    id: 'general',
    label: 'Geral',
    icon: '⚙',
    seo: [
      { key: 'seo_default_title', label: 'Titulo Padrao' },
      { key: 'seo_default_description', label: 'Descricao Padrao' },
      { key: 'seo_default_keywords', label: 'Keywords Padrao' },
      { key: 'seo_default_og_image', label: 'Imagem OG Padrão (Preview ao compartilhar)', type: 'image' },
    ],
    textos: [
      { key: 'footer_contacts', label: 'Info de Contatos', rich: true },
      { key: 'footer_copyright', label: 'Copyright' },
      { key: 'cta_section_title', label: 'Titulo da Secao CTA', rich: true },
      { key: 'social_instagram', label: 'URL do Instagram' },
      { key: 'social_linkedin', label: 'URL do LinkedIn' },
      { key: 'social_behance', label: 'URL do Behance' },
    ],
    imagens: [
      { key: 'footer_logo_url', label: 'URL do Logo do Footer' },
    ],
  },
];

const AdminPanel: React.FC<AdminPanelProps> = ({ pin, onLogout }) => {
  const [tab, setTab] = useState<'dashboard' | 'cases' | 'media' | 'paginas' | 'proposals' | 'tags' | 'leads' | 'parceiros' | 'lps'>('dashboard');
  const [adminLocale, setAdminLocale] = useState<'pt-BR' | 'en'>('pt-BR');
  const [cases, setCases] = useState<SiteCase[]>([]);
  const [editingCase, setEditingCase] = useState<SiteCase | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [hero, setHero] = useState<HeroSettings>({
    desktopVideoUrl: '',
    mobileVideoUrl: '',
    posterUrl: '',
  });
  const [heroLoading, setHeroLoading] = useState(false);
  const [proposals, setProposals] = useState<SiteProposal[]>([]);
  const [editingProposal, setEditingProposal] = useState<SiteProposal | null>(null);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  const [tags, setTags] = useState<SiteTag[]>([]);
  const [editingTag, setEditingTag] = useState<SiteTag | null>(null);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [partners, setPartners] = useState<SitePartner[]>([]);
  const [editingPartner, setEditingPartner] = useState<SitePartner | null>(null);
  const [partnersLoading, setPartnersLoading] = useState(false);
  const [lps, setLps] = useState<SiteLp[]>([]);
  const [editingLp, setEditingLp] = useState<SiteLp | null>(null);
  const [lpsLoading, setLpsLoading] = useState(false);
  const [siteTexts, setSiteTexts] = useState<Record<string, string>>({});
  const [textsLoading, setTextsLoading] = useState(false);
  const [textsDirty, setTextsDirty] = useState<Set<string>>(new Set());
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [pageSubTab, setPageSubTab] = useState<'seo' | 'textos' | 'imagens'>('seo');

  // Dashboard state
  const [dashPeriod, setDashPeriod] = useState<number | 'custom'>(7);
  const [dashData, setDashData] = useState<AnalyticsSummary | null>(null);
  const [dashLoading, setDashLoading] = useState(false);
  const [dashSubmissions, setDashSubmissions] = useState<FormSubmission[]>([]);
  const [dashSubsLoading, setDashSubsLoading] = useState(false);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');


  const apiCall = async (action: string, data?: any) => {
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ action, pin, data }),
    });
    return res.json();
  };

  const normalizeCase = (item: any): SiteCase => ({
    id: item.id,
    slug: item.slug ?? '',
    title: item.title ?? '',
    category: item.category ?? '',
    description: item.description ?? '',
    cover_url: item.cover_url ?? '',
    gallery_urls: Array.isArray(item.gallery_urls) ? item.gallery_urls : [],
    author: item.author ?? '',
    case_date: item.case_date ?? '',
    external_url: item.external_url ?? '',
    cta_text: item.cta_text ?? '',
    cta_url: item.cta_url ?? '',
    display_order: item.display_order ?? 0,
    is_featured: !!item.is_featured,
    is_visible: item.is_visible !== false,
    locale: item.locale ?? 'pt-BR',
    translation_group: item.translation_group ?? undefined,
    meta_title: item.meta_title ?? '',
    meta_description: item.meta_description ?? '',
    meta_keywords: item.meta_keywords ?? '',
  });

  const loadCases = async (locale?: string) => {
    const loc = locale ?? adminLocale;
    setLoading(true);
    const result = await apiCall('list_cases', { locale: loc });
    const mapped = (result.cases || []).map(normalizeCase);
    setCases(mapped);
    setLoading(false);
  };

  const loadMedia = async () => {
    const { data } = await supabase.storage.from('media').list('', { limit: 200 });
    setMediaFiles((data || []).map((f) => f.name));
  };

  const loadHero = async (locale?: string) => {
    const loc = locale ?? adminLocale;
    const result = await apiCall('list_content', { locale: loc });
    const items = result.content || [];
    const desktop = items.find((c: any) => c.section_key === 'hero_video_desktop');
    const mobile = items.find((c: any) => c.section_key === 'hero_video_mobile');
    setHero({
      desktopVideoUrl: desktop?.video_url || '',
      mobileVideoUrl: mobile?.video_url || '',
      posterUrl: desktop?.image_url || '',
    });
  };

  const saveHero = async () => {
    setHeroLoading(true);
    const r1 = await apiCall('upsert_content', {
      section_key: 'hero_video_desktop',
      title: 'Hero Video Desktop',
      locale: adminLocale,
      video_url: hero.desktopVideoUrl,
      image_url: hero.posterUrl,
    });
    if (r1?.error) {
      showMessage(`Erro ao salvar hero desktop: ${r1.error}`);
      setHeroLoading(false);
      return;
    }
    const r2 = await apiCall('upsert_content', {
      section_key: 'hero_video_mobile',
      title: 'Hero Video Mobile',
      locale: adminLocale,
      video_url: hero.mobileVideoUrl,
    });
    if (r2?.error) {
      showMessage(`Erro ao salvar hero mobile: ${r2.error}`);
      setHeroLoading(false);
      return;
    }
    showMessage('Hero atualizado!');
    setHeroLoading(false);
  };

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

  const loadProposals = async (locale?: string) => {
    const loc = locale ?? adminLocale;
    setProposalsLoading(true);
    const result = await apiCall('list_proposals', { locale: loc });
    const mapped = (result.proposals || []).map(normalizeProposal);
    setProposals(mapped);
    setProposalsLoading(false);
  };

  const saveProposal = async () => {
    if (!editingProposal) return;
    setProposalsLoading(true);
    const payload = {
      ...editingProposal,
      locale: (editingProposal as any).locale ?? adminLocale,
    };
    await apiCall('upsert_proposal', payload);
    setEditingProposal(null);
    await loadProposals();
    showMessage('Proposta salva!');
    setProposalsLoading(false);
  };

  const deleteProposal = async (id: string) => {
    if (!confirm('Excluir esta proposta?')) return;
    setProposalsLoading(true);
    await apiCall('delete_proposal', { id });
    await loadProposals();
    showMessage('Proposta excluida!');
    setProposalsLoading(false);
  };

  const newProposal = (): SiteProposal => ({
    slug: '',
    title: '',
    subtitle: '',
    banner_url: '',
    client_name: '',
    client_contact: '',
    scope: '',
    timeline: '',
    about: '',
    footer_links: [],
    is_public: true,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    meta_robots: 'noindex, nofollow',
  });

  const updateProposalField = (field: keyof SiteProposal, value: any) => {
    if (!editingProposal) return;
    const updated = { ...editingProposal, [field]: value };
    if (field === 'title' || field === 'client_name') {
      updated.slug = slugify(
        field === 'client_name' ? value : updated.client_name,
        field === 'title' ? value : updated.title
      );
    }
    setEditingProposal(updated);
  };

  const addFooterLink = () => {
    if (!editingProposal) return;
    setEditingProposal({
      ...editingProposal,
      footer_links: [...editingProposal.footer_links, { label: '', url: '' }],
    });
  };

  const updateFooterLink = (index: number, field: 'label' | 'url', value: string) => {
    if (!editingProposal) return;
    const links = [...editingProposal.footer_links];
    links[index] = { ...links[index], [field]: value };
    setEditingProposal({ ...editingProposal, footer_links: links });
  };

  const removeFooterLink = (index: number) => {
    if (!editingProposal) return;
    const links = editingProposal.footer_links.filter((_, i) => i !== index);
    setEditingProposal({ ...editingProposal, footer_links: links });
  };

  const copyProposalUrl = (slug: string) => {
    const base = window.location.origin;
    navigator.clipboard.writeText(`${base}/proposta/${slug}`);
    showMessage('Link copiado!');
  };

  const normalizeTag = (item: any): SiteTag => ({
    id: item.id,
    tag_type: item.tag_type ?? 'ga4',
    tag_id: item.tag_id ?? '',
    label: item.label ?? '',
    is_active: !!item.is_active,
  });

  const loadTags = async () => {
    setTagsLoading(true);
    const result = await apiCall('list_tags');
    const mapped = (result.tags || []).map(normalizeTag);
    setTags(mapped);
    setTagsLoading(false);
  };

  const saveTag = async () => {
    if (!editingTag) return;
    setTagsLoading(true);
    await apiCall('upsert_tag', editingTag);
    setEditingTag(null);
    await loadTags();
    showMessage('Tag salva!');
    setTagsLoading(false);
  };

  const deleteTag = async (id: string) => {
    if (!confirm('Excluir esta tag?')) return;
    setTagsLoading(true);
    await apiCall('delete_tag', { id });
    await loadTags();
    showMessage('Tag excluida!');
    setTagsLoading(false);
  };

  const toggleTagActive = async (tag: SiteTag) => {
    setTagsLoading(true);
    await apiCall('upsert_tag', { ...tag, is_active: !tag.is_active });
    await loadTags();
    showMessage(tag.is_active ? 'Tag desativada!' : 'Tag ativada!');
    setTagsLoading(false);
  };

  const newTag = (): SiteTag => ({
    tag_type: 'ga4',
    tag_id: '',
    label: '',
    is_active: true,
  });

  const normalizePartner = (item: any): SitePartner => ({
    id: item.id,
    name: item.name ?? '',
    logo_url: item.logo_url ?? '',
    link_url: item.link_url ?? '/cases',
    display_order: item.display_order ?? 0,
    is_visible: item.is_visible !== false,
  });

  const loadPartners = async () => {
    setPartnersLoading(true);
    const result = await apiCall('list_partners');
    const mapped = (result.partners || []).map(normalizePartner);
    setPartners(mapped);
    setPartnersLoading(false);
  };

  const savePartner = async () => {
    if (!editingPartner) return;
    setPartnersLoading(true);
    await apiCall('upsert_partner', editingPartner);
    setEditingPartner(null);
    await loadPartners();
    showMessage('Parceiro salvo!');
    setPartnersLoading(false);
  };

  const deletePartner = async (id: string) => {
    if (!confirm('Excluir este parceiro?')) return;
    setPartnersLoading(true);
    await apiCall('delete_partner', { id });
    await loadPartners();
    showMessage('Parceiro excluido!');
    setPartnersLoading(false);
  };

  const newPartner = (): SitePartner => ({
    name: '',
    logo_url: '',
    link_url: '/cases',
    display_order: partners.length + 1,
    is_visible: true,
  });

  // ── LP CRUD ──
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
    institutional_video_url: item.institutional_video_url ?? '',
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

  const loadLps = async (locale?: string) => {
    const loc = locale ?? adminLocale;
    setLpsLoading(true);
    const result = await apiCall('list_lps', { locale: loc });
    setLps((result.lps || []).map(normalizeLp));
    setLpsLoading(false);
  };

  const saveLp = async () => {
    if (!editingLp) return;
    setLpsLoading(true);
    const payload = {
      ...editingLp,
      locale: (editingLp as any).locale ?? adminLocale,
    };
    await apiCall('upsert_lp', payload);
    setEditingLp(null);
    await loadLps();
    showMessage('LP salva!');
    setLpsLoading(false);
  };

  const deleteLp = async (id: string) => {
    if (!confirm('Excluir esta LP?')) return;
    setLpsLoading(true);
    await apiCall('delete_lp', { id });
    await loadLps();
    showMessage('LP excluída!');
    setLpsLoading(false);
  };

  const duplicateLp = (source: SiteLp) => {
    const { id, created_at, updated_at, ...rest } = source;
    setEditingLp({
      ...rest,
      slug: source.slug + '-copia',
      title: source.title + ' (Cópia)',
      display_order: lps.length + 1,
    } as SiteLp);
  };

  const newLp = (): SiteLp => ({
    slug: '',
    title: '',
    is_visible: true,
    display_order: lps.length + 1,
    hero_badge: '',
    hero_title: '',
    hero_subtitle: '',
    hero_cta_text: 'Solicitar proposta',
    hero_cta_url: '/contato',
    hero_video_desktop: '',
    hero_video_mobile: '',
    hero_poster: '',
    about_badge: 'Sobre nós',
    about_title: '',
    about_paragraphs: [],
    about_cta_text: '',
    about_cta_url: '/estudio',
    about_video_url: '',
    institutional_video_url: '',
    method_badge: '',
    method_title: '',
    method_subtitle: '',
    method_phases: [],
    method_cta_text: 'Ver metodologia completa',
    method_cta_url: '/metodologia',
    benefits_badge: 'Benefícios',
    benefits_title: '',
    benefits_subtitle: '',
    benefits_items: [],
    benefits_cta_text: '',
    benefits_cta_url: '/contato',
    cases_badge: '',
    cases_title: '',
    cases_subtitle: '',
    cases_items: [],
    cases_cta_text: 'Ver todos os cases',
    cases_cta_url: '/cases',
    partners_badge: 'Parceiros',
    partners_title: '',
    partners_subtitle: '',
    partners_show: true,
    partners_cta_text: '',
    partners_cta_url: '/contato',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });

  const updateLpField = (field: keyof SiteLp, value: any) => {
    if (!editingLp) return;
    setEditingLp({ ...editingLp, [field]: value });
  };

  const copyLpUrl = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/lp/${slug}`);
    showMessage('Link copiado!');
  };

  const loadTexts = async (locale?: string) => {
    const loc = locale ?? adminLocale;
    setTextsLoading(true);
    const result = await apiCall('list_content', { locale: loc });
    const items: any[] = result.content || [];
    const map: Record<string, string> = {};
    for (const item of items) {
      if (item.section_key) {
        // Inclui campos com body null como string vazia para permitir edição
        map[item.section_key] = item.body ?? '';
      }
    }
    setSiteTexts(map);
    setTextsDirty(new Set());
    setTextsLoading(false);
  };

  const updateTextField = (key: string, value: string) => {
    setSiteTexts((prev) => ({ ...prev, [key]: value }));
    setTextsDirty((prev) => new Set(prev).add(key));
  };

  const saveTextField = async (key: string) => {
    setTextsLoading(true);
    const result = await apiCall('upsert_content', {
      section_key: key,
      title: key,
      locale: adminLocale,
      body: siteTexts[key] || '',
    });
    if (result?.error) {
      showMessage(`Erro ao salvar: ${result.error}`);
      setTextsLoading(false);
      return;
    }
    setTextsDirty((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
    showMessage('Texto salvo!');
    setTextsLoading(false);
  };

  const saveAllTexts = async () => {
    const dirty = Array.from(textsDirty);
    if (dirty.length === 0) return;
    setTextsLoading(true);
    let failedKey: string | null = null;
    let failedError = '';
    for (const key of dirty) {
      const result = await apiCall('upsert_content', {
        section_key: key,
        title: key,
        locale: adminLocale,
        body: siteTexts[key] || '',
      });
      if (result?.error) {
        failedKey = key;
        failedError = result.error;
        break;
      }
    }
    if (failedKey) {
      showMessage(`Erro ao salvar "${failedKey}": ${failedError}`);
    } else {
      setTextsDirty(new Set());
      showMessage(`${dirty.length} texto(s) salvo(s)!`);
    }
    setTextsLoading(false);
  };



  const loadDashboard = async (period?: number | 'custom', from?: string, to?: string) => {
    const p = period ?? dashPeriod;
    setDashLoading(true);
    let payload: any;
    if (p === 'custom') {
      const f = from || customFrom;
      const t = to || customTo;
      if (f && t) {
        payload = { from: f, to: t };
      } else {
        payload = { days: 7 };
      }
    } else if (typeof p === 'number') {
      payload = { days: p };
    } else {
      payload = { days: 7 };
    }
    const result = await apiCall('analytics_summary', payload);
    if (result?.error) {
      showMessage(`Erro ao carregar analytics: ${result.error}`);
      setDashData({ ...emptyAnalyticsSummary, period_label: dashData?.period_label || '' });
      setDashLoading(false);
      return;
    }
    setDashData(normalizeAnalyticsSummary(result));
    setDashLoading(false);
  };

  const loadFormSubmissions = async () => {
    setDashSubsLoading(true);
    const result = await apiCall('list_form_submissions', { limit: 50 });
    setDashSubmissions(result.submissions || []);
    setDashSubsLoading(false);
  };


  const handlePeriodChange = (days: number) => {
    setDashPeriod(days);
    loadDashboard(days);
  };

  const handleCustomRange = () => {
    if (!customFrom || !customTo) return;
    setDashPeriod('custom');
    loadDashboard('custom', customFrom, customTo);
  };

  useEffect(() => {
    loadCases();
    loadMedia();
    loadHero();
    loadProposals();
    loadTags();
    loadPartners();
    loadLps();
    loadTexts(adminLocale);
    loadDashboard();
    loadFormSubmissions();
  }, []);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const saveCase = async () => {
    if (!editingCase) return;
    setLoading(true);
    const payload = {
      ...editingCase,
      locale: editingCase.locale ?? adminLocale,
      gallery_urls: editingCase.gallery_urls.filter(Boolean),
    };
    await apiCall('upsert_case', payload);
    setEditingCase(null);
    await loadCases();
    showMessage('Case salvo!');
    setLoading(false);
  };

  const deleteCase = async (id: string) => {
    if (!confirm('Excluir este case?')) return;
    setLoading(true);
    await apiCall('delete_case', { id });
    await loadCases();
    showMessage('Case excluido!');
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      await supabase.storage.from('media').upload(name, file);
    }
    await loadMedia();
    showMessage('Arquivo(s) enviado(s)!');
    setUploading(false);
  };

  const getMediaUrl = (name: string) => {
    const { data } = supabase.storage.from('media').getPublicUrl(name);
    return data.publicUrl;
  };

  const uploadFileAndGetUrl = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(name, file);
    if (error) throw error;
    const { data } = supabase.storage.from('media').getPublicUrl(name);
    return data.publicUrl;
  };

  const handleImageFieldUpload = async (file: File, fieldKey: string, setter: 'text' | 'case_cover' | 'hero_desktop' | 'hero_mobile' | 'hero_poster') => {
    setUploading(true);
    try {
      const url = await uploadFileAndGetUrl(file);
      switch (setter) {
        case 'text':
          updateTextField(fieldKey, url);
          break;
        case 'case_cover':
          if (editingCase) setEditingCase({ ...editingCase, cover_url: url });
          break;
        case 'hero_desktop':
          setHero((h: HeroSettings) => ({ ...h, desktopVideoUrl: url }));
          break;
        case 'hero_mobile':
          setHero((h: HeroSettings) => ({ ...h, mobileVideoUrl: url }));
          break;
        case 'hero_poster':
          setHero((h: HeroSettings) => ({ ...h, posterUrl: url }));
          break;
      }
      showMessage('Arquivo enviado!');
    } catch (err: any) {
      showMessage('Erro ao enviar: ' + err.message);
    }
    setUploading(false);
  };

  const deleteMedia = async (name: string) => {
    if (!confirm('Excluir este arquivo?')) return;
    await supabase.storage.from('media').remove([name]);
    await loadMedia();
    showMessage('Arquivo excluido!');
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showMessage('URL copiada!');
  };

  const newCase = (): SiteCase => ({
    slug: '',
    title: '',
    category: '',
    description: '',
    cover_url: '',
    gallery_urls: [],
    author: '',
    case_date: '',
    external_url: '',
    cta_text: 'Quero uma marca nesse nivel',
    cta_url: getWhatsAppUrl(),
    display_order: cases.length + 1,
    is_featured: false,
    is_visible: true,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-sans font-bold tracking-tight">Painel Admin</h1>
        <button onClick={onLogout} className="text-sm text-neutral-400 hover:text-black font-sans transition-colors">
          Sair
        </button>
      </div>

      {message && (
        <div className="fixed top-20 right-6 bg-black text-white px-6 py-3 rounded-xl text-sm font-sans z-50 animate-in fade-in slide-in-from-top-2">
          {message}
        </div>
      )}

      <div className="px-6 py-4 flex gap-2 max-w-5xl mx-auto flex-wrap items-center">
        {(['dashboard', 'leads', 'cases', 'media', 'paginas', 'proposals', 'parceiros', 'lps', 'tags'] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              if (t === 'leads') loadFormSubmissions();
              if (t === 'paginas') { setSelectedPage(null); setPageSubTab('seo'); }
            }}
            className={`px-6 py-3 rounded-full text-sm font-sans font-medium transition-all ${
              tab === t ? 'bg-black text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {t === 'dashboard' ? 'Dashboard' : t === 'leads' ? 'Leads' : t === 'cases' ? 'Cases' : t === 'media' ? 'Mídia' : t === 'paginas' ? 'Páginas' : t === 'proposals' ? 'Propostas' : t === 'parceiros' ? 'Parceiros' : t === 'lps' ? 'LPs' : 'Tags'}
          </button>
        ))}

        {/* Locale selector — visible in content tabs */}
        {(['paginas', 'cases', 'proposals', 'lps'].includes(tab)) && (
          <div className="ml-auto flex items-center gap-1 border border-neutral-200 rounded-full px-3 py-1">
            <span className="text-[10px] text-neutral-400 font-sans uppercase tracking-widest mr-1">Idioma:</span>
            {(['pt-BR', 'en'] as const).map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  setAdminLocale(loc);
                  loadTexts(loc);
                  loadCases(loc);
                  loadProposals(loc);
                  loadLps(loc);
                  loadHero(loc);
                }}
                className={`text-xs font-bold font-sans px-2 py-0.5 rounded-full transition-colors ${adminLocale === loc ? 'bg-black text-white' : 'text-neutral-400 hover:text-black'}`}
              >
                {loc === 'pt-BR' ? 'PT' : 'EN'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 pb-20 max-w-5xl mx-auto">
        {tab === 'dashboard' && (
          <div>
            {/* Period Selector */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-sm font-sans text-neutral-500">Periodo:</span>
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => handlePeriodChange(d)}
                  className={`px-4 py-2 rounded-full text-sm font-sans font-medium transition-all ${
                    dashPeriod === d ? 'bg-black text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {d} dias
                </button>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="border border-neutral-200 rounded-lg px-3 py-2 text-sm font-sans text-neutral-600"
                />
                <span className="text-neutral-400 text-xs">ate</span>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="border border-neutral-200 rounded-lg px-3 py-2 text-sm font-sans text-neutral-600"
                />
                <button
                  onClick={handleCustomRange}
                  disabled={!customFrom || !customTo}
                  className={`px-4 py-2 rounded-full text-sm font-sans font-medium transition-all ${
                    dashPeriod === 'custom' ? 'bg-black text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  Filtrar
                </button>
              </div>
              <button
                onClick={() => { loadDashboard(dashPeriod, customFrom, customTo); loadFormSubmissions(); }}
                disabled={dashLoading}
                className="ml-auto text-xs font-sans text-neutral-500 hover:text-black px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                {dashLoading ? 'Atualizando...' : 'Atualizar'}
              </button>
            </div>

            {!dashData && dashLoading ? (
              <p className="text-neutral-400 font-sans text-sm">Carregando dashboard...</p>
            ) : dashData ? (
              <div className="relative">
                {dashLoading && (
                  <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-2xl">
                    <p className="text-neutral-500 font-sans text-sm animate-pulse">Atualizando...</p>
                  </div>
                )}
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Visitas</p>
                    <p className="text-4xl font-sans font-bold">{(dashData.total_page_views ?? 0).toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-neutral-400 font-sans mt-1">{dashData.period_label}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Cliques WhatsApp</p>
                    <p className="text-4xl font-sans font-bold">{(dashData.whatsapp_clicks ?? 0).toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-neutral-400 font-sans mt-1">{dashData.period_label}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Formularios</p>
                    <p className="text-4xl font-sans font-bold">{(dashData.form_submissions ?? 0).toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-neutral-400 font-sans mt-1">{dashData.period_label}</p>
                  </div>
                </div>

                {/* Daily Views — SVG Area Chart */}
                {Object.keys(dashData.daily_views).length > 0 && (
                  <div key={dashData.period_label + '-' + dashData.total_page_views} className="bg-white rounded-2xl p-6 border border-neutral-200 mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 font-sans mb-4">Visitas por Dia</h3>
                    {(() => {
                      const entries = Object.entries(dashData.daily_views).sort(([a], [b]) => a.localeCompare(b));
                      const maxVal = Math.max(...entries.map(([, v]) => v), 1);
                      const chartW = 720;
                      const chartH = 160;
                      const padL = 40;
                      const padB = 24;
                      const w = chartW - padL;
                      const h = chartH - padB;
                      const step = entries.length > 1 ? w / (entries.length - 1) : 0;
                      const points = entries.map(([, v], i) => ({
                        x: padL + i * step,
                        y: h - (v / maxVal) * h,
                      }));
                      const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
                      const areaD = `${lineD} L${points[points.length - 1]?.x ?? padL},${h} L${padL},${h} Z`;
                      const gridLines = 4;
                      return (
                        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" preserveAspectRatio="none" style={{ maxHeight: 200 }}>
                          {/* Y-axis grid lines */}
                          {Array.from({ length: gridLines + 1 }).map((_, i) => {
                            const yy = (h / gridLines) * i;
                            const val = Math.round(maxVal - (maxVal / gridLines) * i);
                            return (
                              <g key={i}>
                                <line x1={padL} y1={yy} x2={chartW} y2={yy} stroke="#e5e5e5" strokeWidth="0.5" />
                                <text x={padL - 6} y={yy + 3} textAnchor="end" fontSize="8" fill="#a3a3a3" fontFamily="Nunito Sans, sans-serif">{val}</text>
                              </g>
                            );
                          })}
                          {/* Area fill */}
                          <path d={areaD} fill="black" fillOpacity="0.06" />
                          {/* Line */}
                          <path d={lineD} fill="none" stroke="black" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                          {/* Data points + x-labels */}
                          {points.map((p, i) => {
                            const showLabel = entries.length <= 14 || i % Math.ceil(entries.length / 10) === 0 || i === entries.length - 1;
                            return (
                              <g key={i}>
                                <circle cx={p.x} cy={p.y} r="3" fill="white" stroke="black" strokeWidth="1.5" />
                                <title>{entries[i][0]}: {entries[i][1]} visita(s)</title>
                                {showLabel && (
                                  <text x={p.x} y={chartH - 4} textAnchor="middle" fontSize="7" fill="#a3a3a3" fontFamily="Nunito Sans, sans-serif">
                                    {entries[i][0].slice(5)}
                                  </text>
                                )}
                              </g>
                            );
                          })}
                        </svg>
                      );
                    })()}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Top Pages — Horizontal Bar Chart */}
                  <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 font-sans mb-4">Paginas Mais Visitadas</h3>
                    {dashData.top_pages.length === 0 ? (
                      <p className="text-neutral-400 font-sans text-sm">Sem dados ainda.</p>
                    ) : (() => {
                      const maxCount = dashData.top_pages[0]?.count || 1;
                      const barH = 28;
                      const gap = 6;
                      const svgH = dashData.top_pages.length * (barH + gap);
                      return (
                        <svg viewBox={`0 0 400 ${svgH}`} className="w-full" style={{ maxHeight: svgH }}>
                          {dashData.top_pages.map((p, i) => {
                            const y = i * (barH + gap);
                            const barW = Math.max((p.count / maxCount) * 300, 4);
                            return (
                              <g key={i}>
                                <rect x="0" y={y + 2} width={barW} height={barH - 4} rx="4" fill="black" fillOpacity={1 - i * 0.12 > 0.3 ? 1 - i * 0.12 : 0.3} />
                                <text x="6" y={y + barH / 2 + 1} dominantBaseline="middle" fontSize="10" fill="white" fontFamily="Nunito Sans, sans-serif" fontWeight="600">
                                  {p.page.length > 30 ? `${p.page.slice(0, 30)}...` : p.page}
                                </text>
                                <text x={barW + 8} y={y + barH / 2 + 1} dominantBaseline="middle" fontSize="10" fill="#525252" fontFamily="Nunito Sans, sans-serif" fontWeight="700">
                                  {p.count}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      );
                    })()}
                  </div>

                  {/* Top Regions — Horizontal Bar Chart */}
                  <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 font-sans mb-4">Visitas por Regiao</h3>
                    {dashData.top_regions.length === 0 ? (
                      <p className="text-neutral-400 font-sans text-sm">Sem dados ainda.</p>
                    ) : (() => {
                      const maxCount = dashData.top_regions[0]?.count || 1;
                      const barH = 28;
                      const gap = 6;
                      const svgH = dashData.top_regions.length * (barH + gap);
                      return (
                        <svg viewBox={`0 0 400 ${svgH}`} className="w-full" style={{ maxHeight: svgH }}>
                          {dashData.top_regions.map((r, i) => {
                            const y = i * (barH + gap);
                            const barW = Math.max((r.count / maxCount) * 300, 4);
                            return (
                              <g key={i}>
                                <rect x="0" y={y + 2} width={barW} height={barH - 4} rx="4" fill="black" fillOpacity={1 - i * 0.12 > 0.3 ? 1 - i * 0.12 : 0.3} />
                                <text x="6" y={y + barH / 2 + 1} dominantBaseline="middle" fontSize="10" fill="white" fontFamily="Nunito Sans, sans-serif" fontWeight="600">
                                  {r.region.length > 30 ? `${r.region.slice(0, 30)}...` : r.region}
                                </text>
                                <text x={barW + 8} y={y + barH / 2 + 1} dominantBaseline="middle" fontSize="10" fill="#525252" fontFamily="Nunito Sans, sans-serif" fontWeight="700">
                                  {r.count}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      );
                    })()}
                  </div>
                </div>

                {/* Form Submissions */}
                <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 font-sans mb-4">Ultimos Formularios Recebidos</h3>
                  {dashSubsLoading ? (
                    <p className="text-neutral-400 font-sans text-sm">Carregando...</p>
                  ) : dashSubmissions.length === 0 ? (
                    <p className="text-neutral-400 font-sans text-sm">Nenhum formulario recebido ainda.</p>
                  ) : (
                    <div className="overflow-x-auto -mx-6">
                      <table className="w-full text-sm font-sans min-w-[700px]">
                        <thead>
                          <tr className="border-b border-neutral-100">
                            <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-neutral-400">Nome</th>
                            <th className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-neutral-400">Email</th>
                            <th className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-neutral-400">Empresa</th>
                            <th className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-neutral-400">Desafio</th>
                            <th className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-neutral-400">Data</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashSubmissions.map((s) => (
                            <tr key={s.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                              <td className="px-6 py-3 font-medium">{s.name}</td>
                              <td className="px-3 py-3 text-neutral-600">{s.email}</td>
                              <td className="px-3 py-3 text-neutral-600">{s.company || '—'}</td>
                              <td className="px-3 py-3 text-neutral-600">{s.challenge || '—'}</td>
                              <td className="px-3 py-3 text-neutral-400 whitespace-nowrap">
                                {new Date(s.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-neutral-400 font-sans text-sm">Sem dados de analytics disponiveis.</p>
            )}
          </div>
        )}

        {tab === 'leads' && (() => {
          const SERVICE_LABELS: Record<string, string> = {
            estrategia: 'Estratégia de marca',
            identidade_visual: 'Identidade visual',
            sistema_identidade: 'Sistema de identidade',
            branding_lancamento: 'Branding e reposicionamento',
            consultoria: 'Consultoria de marca',
          };
          const now = new Date();
          const d7 = new Date(now.getTime() - 7 * 86400000);
          const d30 = new Date(now.getTime() - 30 * 86400000);
          const total = dashSubmissions.length;
          const last7 = dashSubmissions.filter(s => new Date(s.created_at) >= d7).length;
          const last30 = dashSubmissions.filter(s => new Date(s.created_at) >= d30).length;

          const exportCSV = () => {
            const header = 'Nome,Telefone,Email,Empresa,Servico,Pagina,Data\n';
            const rows = dashSubmissions.map(s =>
              [s.name, s.phone || '', s.email, s.company || '', SERVICE_LABELS[s.challenge || ''] || s.challenge || '', s.page_path || '', new Date(s.created_at).toLocaleString('pt-BR')]
                .map(v => `"${(v || '').replace(/"/g, '""')}"`)
                .join(',')
            ).join('\n');
            const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          };

          return (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Total de Leads</p>
                  <p className="text-4xl font-sans font-bold">{total}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Últimos 7 dias</p>
                  <p className="text-4xl font-sans font-bold">{last7}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Últimos 30 dias</p>
                  <p className="text-4xl font-sans font-bold">{last30}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 font-sans">Todos os Leads</h3>
                <div className="flex gap-2">
                  <button onClick={() => loadFormSubmissions()} className="text-xs font-sans text-neutral-500 hover:text-black px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors">
                    {dashSubsLoading ? 'Atualizando...' : 'Atualizar'}
                  </button>
                  <button onClick={exportCSV} className="text-xs font-sans bg-black text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors">
                    Exportar CSV
                  </button>
                </div>
              </div>

              {dashSubsLoading ? (
                <p className="text-neutral-400 font-sans text-sm">Carregando...</p>
              ) : dashSubmissions.length === 0 ? (
                <p className="text-neutral-400 font-sans text-sm">Nenhum lead recebido ainda.</p>
              ) : (
                <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-sans min-w-[900px]">
                      <thead>
                        <tr className="border-b border-neutral-100 bg-neutral-50">
                          <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-400">Nome</th>
                          <th className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-neutral-400">Telefone</th>
                          <th className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-neutral-400">Email</th>
                          <th className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-neutral-400">Empresa</th>
                          <th className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-neutral-400">Serviço</th>
                          <th className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-neutral-400">Página</th>
                          <th className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-neutral-400">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashSubmissions.map((s) => (
                          <tr key={s.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                            <td className="px-4 py-3 font-medium">{s.name}</td>
                            <td className="px-3 py-3 text-neutral-600">{s.phone || '—'}</td>
                            <td className="px-3 py-3 text-neutral-600">{s.email}</td>
                            <td className="px-3 py-3 text-neutral-600">{s.company || '—'}</td>
                            <td className="px-3 py-3 text-neutral-600">{SERVICE_LABELS[s.challenge || ''] || s.challenge || '—'}</td>
                            <td className="px-3 py-3 text-neutral-400 text-xs">{s.page_path || '—'}</td>
                            <td className="px-3 py-3 text-neutral-400 whitespace-nowrap text-xs">
                              {new Date(s.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })()}


        {tab === 'cases' && (
          <div>
            {editingCase ? (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                <h2 className="text-lg font-sans font-bold mb-6">{editingCase.id ? 'Editar Case' : 'Novo Case'}</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Slug</label>
                      <input
                        value={editingCase.slug}
                        onChange={(e) => setEditingCase({ ...editingCase, slug: e.target.value.trim().toLowerCase() })}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                        placeholder="ex: nuts-oclock"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Titulo</label>
                      <input
                        value={editingCase.title}
                        onChange={(e) => setEditingCase({ ...editingCase, title: e.target.value })}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                        placeholder="Nome do projeto"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Categoria</label>
                    <input
                      value={editingCase.category}
                      onChange={(e) => setEditingCase({ ...editingCase, category: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                      placeholder="Ex: Branding - Identidade Visual"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Descricao</label>
                    <textarea
                      value={editingCase.description}
                      onChange={(e) => setEditingCase({ ...editingCase, description: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans min-h-[120px]"
                      placeholder="Descricao completa do case"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Autor</label>
                      <input
                        value={editingCase.author}
                        onChange={(e) => setEditingCase({ ...editingCase, author: e.target.value })}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                        placeholder="Ex: Luiz Felipe Dalla-Rosa"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Data do case</label>
                      <input
                        type="date"
                        value={editingCase.case_date}
                        onChange={(e) => setEditingCase({ ...editingCase, case_date: e.target.value })}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">URL da capa</label>
                    <input
                      value={editingCase.cover_url}
                      onChange={(e) => setEditingCase({ ...editingCase, cover_url: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                      placeholder="Cole a URL da imagem de capa"
                    />
                    <div
                      className={`mt-3 border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition-colors ${
                        uploading ? 'opacity-50 pointer-events-none' : 'border-neutral-300 hover:border-black hover:bg-neutral-50'
                      }`}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleImageFieldUpload(file, '', 'case_cover');
                      }}
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (ev) => {
                          const file = (ev.target as HTMLInputElement).files?.[0];
                          if (file) handleImageFieldUpload(file, '', 'case_cover');
                        };
                        input.click();
                      }}
                    >
                      <p className="text-sm text-neutral-500 font-sans">
                        {uploading ? 'Enviando...' : 'Arraste a imagem aqui ou clique para enviar'}
                      </p>
                    </div>
                    {editingCase.cover_url && <img src={editingCase.cover_url} alt="Preview" className="mt-3 rounded-xl max-h-40 object-cover" />}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Galeria (1 URL por linha)</label>
                    <textarea
                      value={editingCase.gallery_urls.join('\n')}
                      onChange={(e) =>
                        setEditingCase({
                          ...editingCase,
                          gallery_urls: e.target.value.split('\n').map((item) => item.trim()).filter(Boolean),
                        })
                      }
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans min-h-[120px]"
                      placeholder="https://.../imagem-1.png"
                    />
                    <div
                      className={`mt-3 border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition-colors ${
                        uploading ? 'opacity-50 pointer-events-none' : 'border-neutral-300 hover:border-black hover:bg-neutral-50'
                      }`}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const files = Array.from(e.dataTransfer.files);
                        if (files.length === 0) return;
                        setUploading(true);
                        try {
                          const urls: string[] = [];
                          for (const file of files) {
                            urls.push(await uploadFileAndGetUrl(file));
                          }
                          setEditingCase((prev: SiteCase | null) => prev ? { ...prev, gallery_urls: [...prev.gallery_urls, ...urls] } : prev);
                          showMessage(`${urls.length} arquivo(s) adicionado(s) à galeria!`);
                        } catch (err: any) {
                          showMessage('Erro ao enviar: ' + err.message);
                        }
                        setUploading(false);
                      }}
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.multiple = true;
                        input.onchange = async (ev) => {
                          const files = Array.from((ev.target as HTMLInputElement).files || []);
                          if (files.length === 0) return;
                          setUploading(true);
                          try {
                            const urls: string[] = [];
                            for (const file of files) {
                              urls.push(await uploadFileAndGetUrl(file));
                            }
                            setEditingCase((prev: SiteCase | null) => prev ? { ...prev, gallery_urls: [...prev.gallery_urls, ...urls] } : prev);
                            showMessage(`${urls.length} arquivo(s) adicionado(s) à galeria!`);
                          } catch (err: any) {
                            showMessage('Erro ao enviar: ' + err.message);
                          }
                          setUploading(false);
                        };
                        input.click();
                      }}
                    >
                      <p className="text-sm text-neutral-500 font-sans">
                        {uploading ? 'Enviando...' : 'Arraste imagens aqui ou clique para adicionar à galeria'}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Link externo do case</label>
                      <input
                        value={editingCase.external_url}
                        onChange={(e) => setEditingCase({ ...editingCase, external_url: e.target.value })}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Texto do CTA</label>
                      <input
                        value={editingCase.cta_text}
                        onChange={(e) => setEditingCase({ ...editingCase, cta_text: e.target.value })}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                        placeholder="Ex: Falar com o Studio Dalla"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Link do CTA</label>
                    <input
                      value={editingCase.cta_url}
                      onChange={(e) => setEditingCase({ ...editingCase, cta_url: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Ordem</label>
                      <input
                        type="number"
                        value={editingCase.display_order}
                        onChange={(e) => setEditingCase({ ...editingCase, display_order: parseInt(e.target.value) || 0 })}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                      />
                    </div>
                    <div className="flex items-end gap-4">
                      <label className="flex items-center gap-2 font-sans text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingCase.is_featured}
                          onChange={(e) => setEditingCase({ ...editingCase, is_featured: e.target.checked })}
                          className="w-4 h-4"
                        />
                        Destaque
                      </label>
                      <label className="flex items-center gap-2 font-sans text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingCase.is_visible}
                          onChange={(e) => setEditingCase({ ...editingCase, is_visible: e.target.checked })}
                          className="w-4 h-4"
                        />
                        Visivel
                      </label>
                    </div>
                  </div>
                </div>

                {/* SEO */}
                <div className="border border-neutral-200 rounded-2xl p-5 mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-4">SEO do Case</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Meta Title</label>
                      <input
                        value={editingCase.meta_title}
                        onChange={(e) => setEditingCase({ ...editingCase, meta_title: e.target.value })}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                        placeholder={editingCase.title || 'Titulo do case (fallback)'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Meta Description</label>
                      <textarea
                        value={editingCase.meta_description}
                        onChange={(e) => setEditingCase({ ...editingCase, meta_description: e.target.value })}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans min-h-[80px]"
                        placeholder={editingCase.description?.slice(0, 120) || 'Descricao do case (fallback)'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Meta Keywords</label>
                      <input
                        value={editingCase.meta_keywords}
                        onChange={(e) => setEditingCase({ ...editingCase, meta_keywords: e.target.value })}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                        placeholder={editingCase.category || 'Categoria do case (fallback)'}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={saveCase}
                    disabled={loading || !editingCase.title || !editingCase.slug}
                    className="bg-black text-white px-8 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    onClick={() => setEditingCase(null)}
                    className="border border-neutral-200 px-8 py-3 rounded-full text-sm font-sans text-neutral-600 hover:bg-neutral-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setEditingCase(newCase())}
                  className="bg-black text-white px-8 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-wider mb-6"
                >
                  + Novo Case
                </button>

                {loading ? (
                  <p className="text-neutral-400 font-sans text-sm">Carregando...</p>
                ) : cases.length === 0 ? (
                  <p className="text-neutral-400 font-sans text-sm">Nenhum case cadastrado ainda.</p>
                ) : (
                  <div className="space-y-4">
                    {cases.map((c) => (
                      <div key={c.id} className="bg-white rounded-2xl p-4 border border-neutral-200 flex items-center gap-4">
                        {c.cover_url && <img src={c.cover_url} alt={c.title} className="w-20 h-14 rounded-xl object-cover flex-shrink-0" />}
                        <div className="flex-grow min-w-0">
                          <h3 className="font-sans font-bold text-lg truncate">{c.title}</h3>
                          <p className="text-xs text-neutral-400 font-sans truncate">/{c.slug}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {!c.is_visible && <span className="text-[10px] bg-neutral-100 text-neutral-400 px-2 py-1 rounded-full font-sans">Oculto</span>}
                          <button onClick={() => setEditingCase(c)} className="text-xs font-sans text-neutral-500 hover:text-black px-3 py-2 rounded-lg hover:bg-neutral-50">
                            Editar
                          </button>
                          <button onClick={() => c.id && deleteCase(c.id)} className="text-xs font-sans text-red-400 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50">
                            Excluir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {tab === 'media' && (
          <div>
            <div className="mb-6">
              <label className="bg-black text-white px-8 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-wider cursor-pointer inline-block">
                {uploading ? 'Enviando...' : '+ Upload'}
                <input type="file" multiple accept="image/*,video/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
            {mediaFiles.length === 0 ? (
              <p className="text-neutral-400 font-sans text-sm">Nenhum arquivo enviado.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mediaFiles.map((name) => {
                  const url = getMediaUrl(name);
                  const isVideo = /\.(mp4|mov|webm)$/i.test(name);
                  return (
                    <div key={name} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                      {isVideo ? <video src={url} className="w-full aspect-video object-cover" controls /> : <img src={url} alt={name} className="w-full aspect-video object-cover" />}
                      <div className="p-3">
                        <p className="text-xs text-neutral-500 font-sans truncate mb-2">{name}</p>
                        <div className="flex gap-2">
                          <button onClick={() => copyUrl(url)} className="text-[10px] font-sans bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg">Copiar URL</button>
                          <button onClick={() => deleteMedia(name)} className="text-[10px] font-sans text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg">Excluir</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'proposals' && (
          <div>
            {editingProposal ? (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                <h2 className="text-lg font-sans font-bold mb-6">{editingProposal.id ? 'Editar Proposta' : 'Nova Proposta'}</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Titulo</label>
                      <input
                        value={editingProposal.title}
                        onChange={(e) => updateProposalField('title', e.target.value)}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                        placeholder="Titulo da proposta"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Cliente</label>
                      <input
                        value={editingProposal.client_name}
                        onChange={(e) => updateProposalField('client_name', e.target.value)}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                        placeholder="Nome do cliente"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Slug (gerado automaticamente)</label>
                    <input
                      value={editingProposal.slug}
                      onChange={(e) => setEditingProposal({ ...editingProposal, slug: e.target.value.trim().toLowerCase() })}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans text-neutral-500"
                      placeholder="proposta-cliente-titulo"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Subtitulo</label>
                    <input
                      value={editingProposal.subtitle}
                      onChange={(e) => setEditingProposal({ ...editingProposal, subtitle: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                      placeholder="Breve descricao da proposta"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Banner URL</label>
                    <input
                      value={editingProposal.banner_url}
                      onChange={(e) => setEditingProposal({ ...editingProposal, banner_url: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                      placeholder="URL da imagem de banner"
                    />
                    {editingProposal.banner_url && <img src={editingProposal.banner_url} alt="Preview" className="mt-3 rounded-xl max-h-40 object-cover" />}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Contato do cliente</label>
                    <input
                      value={editingProposal.client_contact}
                      onChange={(e) => setEditingProposal({ ...editingProposal, client_contact: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                      placeholder="Email ou telefone"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Escopo</label>
                    <textarea
                      value={editingProposal.scope}
                      onChange={(e) => setEditingProposal({ ...editingProposal, scope: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans min-h-[120px]"
                      placeholder="Descreva o escopo do projeto"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Cronograma</label>
                    <textarea
                      value={editingProposal.timeline}
                      onChange={(e) => setEditingProposal({ ...editingProposal, timeline: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans min-h-[120px]"
                      placeholder="Descreva o cronograma"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Sobre</label>
                    <textarea
                      value={editingProposal.about}
                      onChange={(e) => setEditingProposal({ ...editingProposal, about: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans min-h-[120px]"
                      placeholder="Texto sobre o studio ou contexto da proposta"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Links do rodape</label>
                    <div className="space-y-2">
                      {editingProposal.footer_links.map((link, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input
                            value={link.label}
                            onChange={(e) => updateFooterLink(i, 'label', e.target.value)}
                            className="flex-1 border border-neutral-200 rounded-xl px-4 py-2 text-sm font-sans"
                            placeholder="Label"
                          />
                          <input
                            value={link.url}
                            onChange={(e) => updateFooterLink(i, 'url', e.target.value)}
                            className="flex-1 border border-neutral-200 rounded-xl px-4 py-2 text-sm font-sans"
                            placeholder="https://..."
                          />
                          <button onClick={() => removeFooterLink(i)} className="text-red-400 hover:text-red-600 text-xs px-2 py-2">
                            X
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addFooterLink}
                        className="text-xs font-sans text-neutral-500 hover:text-black border border-dashed border-neutral-300 rounded-xl px-4 py-2 hover:bg-neutral-50"
                      >
                        + Adicionar link
                      </button>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 font-sans text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProposal.is_public}
                      onChange={(e) => setEditingProposal({ ...editingProposal, is_public: e.target.checked })}
                      className="w-4 h-4"
                    />
                    Publica (acessivel via link)
                  </label>
                </div>

                {/* SEO */}
                <div className="border border-neutral-200 rounded-2xl p-5 mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-4">SEO da Proposta</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Meta Title</label>
                      <input
                        value={editingProposal.meta_title || ''}
                        onChange={(e) => setEditingProposal({ ...editingProposal, meta_title: e.target.value })}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                        placeholder={`Proposta — ${editingProposal.client_name || 'Cliente'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Meta Description</label>
                      <textarea
                        value={editingProposal.meta_description || ''}
                        onChange={(e) => setEditingProposal({ ...editingProposal, meta_description: e.target.value })}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans min-h-[80px]"
                        placeholder={`Proposta comercial para ${editingProposal.client_name || 'cliente'}.`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Meta Keywords</label>
                      <input
                        value={editingProposal.meta_keywords || ''}
                        onChange={(e) => setEditingProposal({ ...editingProposal, meta_keywords: e.target.value })}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                        placeholder="branding, proposta comercial"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Robots</label>
                      <input
                        value={editingProposal.meta_robots || 'noindex, nofollow'}
                        onChange={(e) => setEditingProposal({ ...editingProposal, meta_robots: e.target.value })}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                        placeholder="noindex, nofollow"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={saveProposal}
                    disabled={proposalsLoading || !editingProposal.title || !editingProposal.slug || !editingProposal.client_name}
                    className="bg-black text-white px-8 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    {proposalsLoading ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    onClick={() => setEditingProposal(null)}
                    className="border border-neutral-200 px-8 py-3 rounded-full text-sm font-sans text-neutral-600 hover:bg-neutral-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setEditingProposal(newProposal())}
                  className="bg-black text-white px-8 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-wider mb-6"
                >
                  + Nova Proposta
                </button>

                {proposalsLoading ? (
                  <p className="text-neutral-400 font-sans text-sm">Carregando...</p>
                ) : proposals.length === 0 ? (
                  <p className="text-neutral-400 font-sans text-sm">Nenhuma proposta cadastrada ainda.</p>
                ) : (
                  <div className="space-y-4">
                    {proposals.map((p) => (
                      <div key={p.id} className="bg-white rounded-2xl p-4 border border-neutral-200 flex items-center gap-4">
                        <div className="flex-grow min-w-0">
                          <h3 className="font-sans font-bold text-lg truncate">{p.title}</h3>
                          <p className="text-xs text-neutral-400 font-sans truncate">{p.client_name} — /{p.slug}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                          {!p.is_public && <span className="text-[10px] bg-neutral-100 text-neutral-400 px-2 py-1 rounded-full font-sans">Oculta</span>}
                          <button onClick={() => copyProposalUrl(p.slug)} className="text-[10px] font-sans bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg">
                            Copiar link
                          </button>
                          <button onClick={() => setEditingProposal(p)} className="text-xs font-sans text-neutral-500 hover:text-black px-3 py-2 rounded-lg hover:bg-neutral-50">
                            Editar
                          </button>
                          <button onClick={() => p.id && deleteProposal(p.id)} className="text-xs font-sans text-red-400 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50">
                            Excluir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {tab === 'tags' && (
          <div>
            {editingTag ? (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                <h2 className="text-lg font-sans font-bold mb-6">{editingTag.id ? 'Editar Tag' : 'Nova Tag'}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Tipo</label>
                    <select
                      value={editingTag.tag_type}
                      onChange={(e) => setEditingTag({ ...editingTag, tag_type: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans bg-white"
                    >
                      {TAG_TYPES.map((tt) => (
                        <option key={tt.value} value={tt.value}>{tt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">ID de rastreamento</label>
                    <input
                      value={editingTag.tag_id}
                      onChange={(e) => setEditingTag({ ...editingTag, tag_id: e.target.value.trim() })}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                      placeholder={TAG_TYPES.find((tt) => tt.value === editingTag.tag_type)?.placeholder || 'ID'}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Label (nome amigavel)</label>
                    <input
                      value={editingTag.label}
                      onChange={(e) => setEditingTag({ ...editingTag, label: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                      placeholder="Ex: GA4 Principal"
                    />
                  </div>

                  <label className="flex items-center gap-2 font-sans text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingTag.is_active}
                      onChange={(e) => setEditingTag({ ...editingTag, is_active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    Ativa (injetar no site)
                  </label>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={saveTag}
                    disabled={tagsLoading || !editingTag.tag_id}
                    className="bg-black text-white px-8 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    {tagsLoading ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    onClick={() => setEditingTag(null)}
                    className="border border-neutral-200 px-8 py-3 rounded-full text-sm font-sans text-neutral-600 hover:bg-neutral-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setEditingTag(newTag())}
                  className="bg-black text-white px-8 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-wider mb-6"
                >
                  + Nova Tag
                </button>

                <p className="text-sm text-neutral-500 font-sans mb-6">
                  Gerencie as tags de rastreamento do site. Tags ativas sao injetadas automaticamente no site publico.
                </p>

                {tagsLoading ? (
                  <p className="text-neutral-400 font-sans text-sm">Carregando...</p>
                ) : tags.length === 0 ? (
                  <p className="text-neutral-400 font-sans text-sm">Nenhuma tag cadastrada ainda.</p>
                ) : (
                  <div className="space-y-4">
                    {tags.map((tag) => {
                      const typeInfo = TAG_TYPES.find((tt) => tt.value === tag.tag_type);
                      return (
                        <div key={tag.id} className="bg-white rounded-2xl p-4 border border-neutral-200 flex items-center gap-4">
                          <div className="flex-grow min-w-0">
                            <h3 className="font-sans font-bold text-lg truncate">{tag.label || tag.tag_id}</h3>
                            <p className="text-xs text-neutral-400 font-sans truncate">
                              {typeInfo?.label || tag.tag_type} — <span className="font-mono">{tag.tag_id}</span>
                            </p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end items-center">
                            <button
                              onClick={() => toggleTagActive(tag)}
                              className={`text-[10px] font-sans px-3 py-1.5 rounded-full font-medium transition-colors ${
                                tag.is_active
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'
                              }`}
                            >
                              {tag.is_active ? 'Ativa' : 'Inativa'}
                            </button>
                            <button
                              onClick={() => setEditingTag(tag)}
                              className="text-xs font-sans text-neutral-500 hover:text-black px-3 py-2 rounded-lg hover:bg-neutral-50"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => tag.id && deleteTag(tag.id)}
                              className="text-xs font-sans text-red-400 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {tab === 'parceiros' && (
          <div>
            {editingPartner ? (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 space-y-4">
                <h2 className="text-lg font-sans font-bold mb-4">{editingPartner.id ? 'Editar Parceiro' : 'Novo Parceiro'}</h2>
                <input value={editingPartner.name} onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Nome do parceiro" />
                <input value={editingPartner.logo_url} onChange={(e) => setEditingPartner({ ...editingPartner, logo_url: e.target.value })} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="URL do logo" />
                {editingPartner.logo_url && (
                  <div className="bg-neutral-50 rounded-xl p-4 flex justify-center">
                    <img src={editingPartner.logo_url} alt="Preview" className="h-20 object-contain" />
                  </div>
                )}
                <input value={editingPartner.link_url} onChange={(e) => setEditingPartner({ ...editingPartner, link_url: e.target.value })} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="URL de destino (ex: /cases/yerbal)" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Ordem</label>
                    <input type="number" value={editingPartner.display_order} onChange={(e) => setEditingPartner({ ...editingPartner, display_order: Number(e.target.value) })} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 font-sans text-sm">
                      <input type="checkbox" checked={editingPartner.is_visible} onChange={(e) => setEditingPartner({ ...editingPartner, is_visible: e.target.checked })} />
                      Visivel
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={savePartner} disabled={partnersLoading} className="bg-black text-white px-8 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-wider disabled:opacity-50">
                    {partnersLoading ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button onClick={() => setEditingPartner(null)} className="border border-neutral-200 px-8 py-3 rounded-full text-sm font-sans">Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-sans font-bold">Parceiros</h2>
                  <button onClick={() => setEditingPartner(newPartner())} className="bg-black text-white px-8 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-wider">
                    + Novo Parceiro
                  </button>
                </div>
                {partnersLoading ? (
                  <p className="text-neutral-400 font-sans text-sm">Carregando...</p>
                ) : partners.length === 0 ? (
                  <p className="text-neutral-400 font-sans text-sm">Nenhum parceiro cadastrado.</p>
                ) : (
                  <div className="space-y-4">
                    {partners.map((p) => (
                      <div key={p.id} className="bg-white rounded-2xl p-4 border border-neutral-200 flex items-center gap-4">
                        <div className="w-16 h-16 bg-neutral-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          {p.logo_url && <img src={p.logo_url} alt={p.name} className="h-12 object-contain" />}
                        </div>
                        <div className="flex-grow min-w-0">
                          <h3 className="font-sans font-bold text-lg truncate">{p.name}</h3>
                          <p className="text-xs text-neutral-400 font-sans truncate">{p.link_url}</p>
                        </div>
                        <span className={`text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full ${p.is_visible ? 'bg-green-50 text-green-600' : 'bg-neutral-100 text-neutral-400'}`}>
                          {p.is_visible ? 'Visivel' : 'Oculto'}
                        </span>
                        <button onClick={() => setEditingPartner(p)} className="text-sm font-sans text-neutral-400 hover:text-black">Editar</button>
                        <button onClick={() => deletePartner(p.id!)} className="text-sm font-sans text-red-400 hover:text-red-600">Excluir</button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {tab === 'lps' && (
          <div>
            {editingLp ? (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 space-y-6">
                <h2 className="text-lg font-sans font-bold">{editingLp.id ? 'Editar LP' : 'Nova LP'}</h2>

                {/* Geral */}
                <div className="space-y-4">
                  <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-neutral-400 border-b pb-2">Geral</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-1">Título</label>
                      <input value={editingLp.title} onChange={(e) => updateLpField('title', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Ex: Identidade Visual" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-1">Slug (URL)</label>
                      <input value={editingLp.slug} onChange={(e) => updateLpField('slug', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="identidadevisual" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-1">Ordem</label>
                      <input type="number" value={editingLp.display_order} onChange={(e) => updateLpField('display_order', Number(e.target.value))} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 font-sans text-sm"><input type="checkbox" checked={editingLp.is_visible} onChange={(e) => updateLpField('is_visible', e.target.checked)} /> Visível</label>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 font-sans text-sm"><input type="checkbox" checked={editingLp.partners_show} onChange={(e) => updateLpField('partners_show', e.target.checked)} /> Mostrar Parceiros</label>
                    </div>
                  </div>
                </div>

                {/* Hero */}
                <div className="space-y-4">
                  <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-neutral-400 border-b pb-2">Hero</h3>
                  <input value={editingLp.hero_badge} onChange={(e) => updateLpField('hero_badge', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Badge (ex: Identidade visual estratégica)" />
                  <textarea value={editingLp.hero_title} onChange={(e) => updateLpField('hero_title', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" rows={3} placeholder="Título principal do Hero" />
                  <textarea value={editingLp.hero_subtitle} onChange={(e) => updateLpField('hero_subtitle', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" rows={2} placeholder="Subtítulo do Hero" />
                  <div className="grid grid-cols-2 gap-4">
                    <input value={editingLp.hero_cta_text} onChange={(e) => updateLpField('hero_cta_text', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Texto do CTA" />
                    <input value={editingLp.hero_cta_url} onChange={(e) => updateLpField('hero_cta_url', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="URL do CTA (ex: /contato)" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <input value={editingLp.hero_video_desktop} onChange={(e) => updateLpField('hero_video_desktop', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="URL Vídeo Desktop" />
                    <input value={editingLp.hero_video_mobile} onChange={(e) => updateLpField('hero_video_mobile', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="URL Vídeo Mobile" />
                    <input value={editingLp.hero_poster} onChange={(e) => updateLpField('hero_poster', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="URL Poster/Capa" />
                  </div>
                </div>

                {/* About */}
                <div className="space-y-4">
                  <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-neutral-400 border-b pb-2">Sobre Nós</h3>
                  <input value={editingLp.about_badge} onChange={(e) => updateLpField('about_badge', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Badge" />
                  <input value={editingLp.about_title} onChange={(e) => updateLpField('about_title', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Título" />
                  {editingLp.about_paragraphs.map((p, i) => (
                    <div key={i} className="flex gap-2">
                      <textarea value={p} onChange={(e) => { const arr = [...editingLp.about_paragraphs]; arr[i] = e.target.value; updateLpField('about_paragraphs', arr); }} className="flex-grow border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" rows={2} placeholder={`Parágrafo ${i + 1}`} />
                      <button onClick={() => { const arr = editingLp.about_paragraphs.filter((_, idx) => idx !== i); updateLpField('about_paragraphs', arr); }} className="text-red-400 hover:text-red-600 text-sm px-2">✕</button>
                    </div>
                  ))}
                  <button onClick={() => updateLpField('about_paragraphs', [...editingLp.about_paragraphs, ''])} className="text-sm font-sans text-neutral-500 hover:text-black">+ Adicionar parágrafo</button>
                  <div className="grid grid-cols-2 gap-4">
                    <input value={editingLp.about_cta_text} onChange={(e) => updateLpField('about_cta_text', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Texto do CTA" />
                    <input value={editingLp.about_cta_url} onChange={(e) => updateLpField('about_cta_url', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="URL do CTA" />
                  </div>
                  <input value={editingLp.about_video_url} onChange={(e) => updateLpField('about_video_url', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="URL do Vídeo" />
                </div>

                {/* Vídeo Institucional */}
                <div className="space-y-4">
                  <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-neutral-400 border-b pb-2">Vídeo Institucional</h3>
                  <input
                    value={editingLp.institutional_video_url}
                    onChange={(e) => updateLpField('institutional_video_url', e.target.value)}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                    placeholder="URL do vídeo institucional (bloco entre Hero e conteúdo)"
                  />
                </div>

                {/* Método */}
                <div className="space-y-4">
                  <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-neutral-400 border-b pb-2">Método</h3>
                  <input value={editingLp.method_badge} onChange={(e) => updateLpField('method_badge', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Badge (ex: Dalla Design Brand)" />
                  <input value={editingLp.method_title} onChange={(e) => updateLpField('method_title', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Título" />
                  <textarea value={editingLp.method_subtitle} onChange={(e) => updateLpField('method_subtitle', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" rows={2} placeholder="Subtítulo" />
                  {editingLp.method_phases.map((phase, i) => (
                    <div key={i} className="bg-neutral-50 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans">Fase {i + 1}</span>
                        <button onClick={() => { const arr = editingLp.method_phases.filter((_, idx) => idx !== i); updateLpField('method_phases', arr); }} className="text-red-400 hover:text-red-600 text-sm">✕</button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input value={phase.id} onChange={(e) => { const arr = [...editingLp.method_phases]; arr[i] = { ...arr[i], id: e.target.value }; updateLpField('method_phases', arr); }} className="border border-neutral-200 rounded-lg px-3 py-2 text-sm font-sans" placeholder="ID (ex: I)" />
                        <input value={phase.label} onChange={(e) => { const arr = [...editingLp.method_phases]; arr[i] = { ...arr[i], label: e.target.value }; updateLpField('method_phases', arr); }} className="border border-neutral-200 rounded-lg px-3 py-2 text-sm font-sans" placeholder="Label (ex: LANDSCAPE)" />
                      </div>
                      <input value={phase.title} onChange={(e) => { const arr = [...editingLp.method_phases]; arr[i] = { ...arr[i], title: e.target.value }; updateLpField('method_phases', arr); }} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm font-sans" placeholder="Título" />
                      <textarea value={phase.desc} onChange={(e) => { const arr = [...editingLp.method_phases]; arr[i] = { ...arr[i], desc: e.target.value }; updateLpField('method_phases', arr); }} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm font-sans" rows={2} placeholder="Descrição" />
                    </div>
                  ))}
                  <button onClick={() => updateLpField('method_phases', [...editingLp.method_phases, { id: '', label: '', title: '', desc: '' }])} className="text-sm font-sans text-neutral-500 hover:text-black">+ Adicionar fase</button>
                  <div className="grid grid-cols-2 gap-4">
                    <input value={editingLp.method_cta_text} onChange={(e) => updateLpField('method_cta_text', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Texto do CTA" />
                    <input value={editingLp.method_cta_url} onChange={(e) => updateLpField('method_cta_url', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="URL do CTA" />
                  </div>
                </div>

                {/* Benefícios */}
                <div className="space-y-4">
                  <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-neutral-400 border-b pb-2">Benefícios</h3>
                  <input value={editingLp.benefits_badge} onChange={(e) => updateLpField('benefits_badge', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Badge" />
                  <input value={editingLp.benefits_title} onChange={(e) => updateLpField('benefits_title', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Título" />
                  <textarea value={editingLp.benefits_subtitle} onChange={(e) => updateLpField('benefits_subtitle', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" rows={2} placeholder="Subtítulo" />
                  {editingLp.benefits_items.map((item, i) => (
                    <div key={i} className="bg-neutral-50 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans">Item {i + 1}</span>
                        <button onClick={() => { const arr = editingLp.benefits_items.filter((_, idx) => idx !== i); updateLpField('benefits_items', arr); }} className="text-red-400 hover:text-red-600 text-sm">✕</button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input value={item.icon} onChange={(e) => { const arr = [...editingLp.benefits_items]; arr[i] = { ...arr[i], icon: e.target.value }; updateLpField('benefits_items', arr); }} className="border border-neutral-200 rounded-lg px-3 py-2 text-sm font-sans" placeholder="Ícone (Material Symbol)" />
                        <input value={item.title} onChange={(e) => { const arr = [...editingLp.benefits_items]; arr[i] = { ...arr[i], title: e.target.value }; updateLpField('benefits_items', arr); }} className="border border-neutral-200 rounded-lg px-3 py-2 text-sm font-sans" placeholder="Título" />
                      </div>
                      <textarea value={item.desc} onChange={(e) => { const arr = [...editingLp.benefits_items]; arr[i] = { ...arr[i], desc: e.target.value }; updateLpField('benefits_items', arr); }} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm font-sans" rows={2} placeholder="Descrição" />
                    </div>
                  ))}
                  <button onClick={() => updateLpField('benefits_items', [...editingLp.benefits_items, { icon: '', title: '', desc: '' }])} className="text-sm font-sans text-neutral-500 hover:text-black">+ Adicionar benefício</button>
                  <div className="grid grid-cols-2 gap-4">
                    <input value={editingLp.benefits_cta_text} onChange={(e) => updateLpField('benefits_cta_text', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Texto do CTA" />
                    <input value={editingLp.benefits_cta_url} onChange={(e) => updateLpField('benefits_cta_url', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="URL do CTA" />
                  </div>
                </div>

                {/* Cases */}
                <div className="space-y-4">
                  <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-neutral-400 border-b pb-2">Cases</h3>
                  <input value={editingLp.cases_badge} onChange={(e) => updateLpField('cases_badge', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Badge" />
                  <input value={editingLp.cases_title} onChange={(e) => updateLpField('cases_title', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Título" />
                  <textarea value={editingLp.cases_subtitle} onChange={(e) => updateLpField('cases_subtitle', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" rows={2} placeholder="Subtítulo" />
                  {editingLp.cases_items.map((c, i) => (
                    <div key={i} className="bg-neutral-50 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans">Case {i + 1}</span>
                        <button onClick={() => { const arr = editingLp.cases_items.filter((_, idx) => idx !== i); updateLpField('cases_items', arr); }} className="text-red-400 hover:text-red-600 text-sm">✕</button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input value={c.slug} onChange={(e) => { const arr = [...editingLp.cases_items]; arr[i] = { ...arr[i], slug: e.target.value }; updateLpField('cases_items', arr); }} className="border border-neutral-200 rounded-lg px-3 py-2 text-sm font-sans" placeholder="Slug do case (ex: yerbal)" />
                        <input value={c.title} onChange={(e) => { const arr = [...editingLp.cases_items]; arr[i] = { ...arr[i], title: e.target.value }; updateLpField('cases_items', arr); }} className="border border-neutral-200 rounded-lg px-3 py-2 text-sm font-sans" placeholder="Título" />
                      </div>
                      <input value={c.category} onChange={(e) => { const arr = [...editingLp.cases_items]; arr[i] = { ...arr[i], category: e.target.value }; updateLpField('cases_items', arr); }} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm font-sans" placeholder="Categoria" />
                      <input value={c.cover_url} onChange={(e) => { const arr = [...editingLp.cases_items]; arr[i] = { ...arr[i], cover_url: e.target.value }; updateLpField('cases_items', arr); }} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm font-sans" placeholder="URL da capa" />
                      {c.cover_url && <img src={c.cover_url} alt="" className="h-16 rounded-lg object-cover" />}
                    </div>
                  ))}
                  <button onClick={() => updateLpField('cases_items', [...editingLp.cases_items, { slug: '', title: '', category: '', cover_url: '' }])} className="text-sm font-sans text-neutral-500 hover:text-black">+ Adicionar case</button>
                  <div className="grid grid-cols-2 gap-4">
                    <input value={editingLp.cases_cta_text} onChange={(e) => updateLpField('cases_cta_text', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Texto do CTA" />
                    <input value={editingLp.cases_cta_url} onChange={(e) => updateLpField('cases_cta_url', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="URL do CTA" />
                  </div>
                </div>

                {/* Parceiros */}
                <div className="space-y-4">
                  <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-neutral-400 border-b pb-2">Parceiros</h3>
                  <input value={editingLp.partners_badge} onChange={(e) => updateLpField('partners_badge', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Badge" />
                  <input value={editingLp.partners_title} onChange={(e) => updateLpField('partners_title', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Título" />
                  <textarea value={editingLp.partners_subtitle} onChange={(e) => updateLpField('partners_subtitle', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" rows={2} placeholder="Subtítulo" />
                  <div className="grid grid-cols-2 gap-4">
                    <input value={editingLp.partners_cta_text} onChange={(e) => updateLpField('partners_cta_text', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Texto do CTA" />
                    <input value={editingLp.partners_cta_url} onChange={(e) => updateLpField('partners_cta_url', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="URL do CTA" />
                  </div>
                </div>

                {/* SEO */}
                <div className="space-y-4">
                  <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-neutral-400 border-b pb-2">SEO</h3>
                  <input value={editingLp.meta_title} onChange={(e) => updateLpField('meta_title', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Meta Title" />
                  <textarea value={editingLp.meta_description} onChange={(e) => updateLpField('meta_description', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" rows={2} placeholder="Meta Description" />
                  <input value={editingLp.meta_keywords} onChange={(e) => updateLpField('meta_keywords', e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans" placeholder="Meta Keywords" />
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={saveLp} disabled={lpsLoading || !editingLp.slug || !editingLp.title} className="bg-black text-white px-8 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-wider disabled:opacity-50">
                    {lpsLoading ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button onClick={() => setEditingLp(null)} className="border border-neutral-200 px-8 py-3 rounded-full text-sm font-sans">Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-sans font-bold">Landing Pages</h2>
                  <button onClick={() => setEditingLp(newLp())} className="bg-black text-white px-8 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-wider">
                    + Nova LP
                  </button>
                </div>
                {lpsLoading ? (
                  <p className="text-neutral-400 font-sans text-sm">Carregando...</p>
                ) : lps.length === 0 ? (
                  <p className="text-neutral-400 font-sans text-sm">Nenhuma LP cadastrada.</p>
                ) : (
                  <div className="space-y-4">
                    {lps.map((lp) => (
                      <div key={lp.id} className="bg-white rounded-2xl p-4 border border-neutral-200 flex items-center gap-4">
                        <div className="flex-grow min-w-0">
                          <h3 className="font-sans font-bold text-lg truncate">{lp.title}</h3>
                          <p className="text-xs text-neutral-400 font-sans truncate">/lp/{lp.slug}</p>
                        </div>
                        <span className={`text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full ${lp.is_visible ? 'bg-green-50 text-green-600' : 'bg-neutral-100 text-neutral-400'}`}>
                          {lp.is_visible ? 'Visível' : 'Oculta'}
                        </span>
                        <button onClick={() => copyLpUrl(lp.slug)} className="text-sm font-sans text-neutral-400 hover:text-black">Copiar URL</button>
                        <button onClick={() => duplicateLp(lp)} className="text-sm font-sans text-neutral-400 hover:text-black">Duplicar</button>
                        <button onClick={() => setEditingLp(lp)} className="text-sm font-sans text-neutral-400 hover:text-black">Editar</button>
                        <button onClick={() => deleteLp(lp.id!)} className="text-sm font-sans text-red-400 hover:text-red-600">Excluir</button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {tab === 'paginas' && (
          <div>
            {selectedPage === null ? (
              <div>
                <h2 className="text-lg font-sans font-bold mb-6">Páginas do Site</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PAGE_CONFIGS.map((page) => {
                    const totalFields = page.seo.length + page.textos.length + page.imagens.length;
                    return (
                      <button
                        key={page.id}
                        onClick={() => { setSelectedPage(page.id); setPageSubTab('seo'); }}
                        className="bg-white rounded-2xl p-6 border border-neutral-200 text-left hover:border-neutral-400 transition-colors group"
                      >
                        <span className="text-3xl mb-3 block">{page.icon}</span>
                        <h3 className="text-lg font-sans font-bold group-hover:text-black">{page.label}</h3>
                        <p className="text-xs text-neutral-400 font-sans mt-1">{totalFields} campos editáveis{page.hasHero ? ' + Hero' : ''}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (() => {
              const currentPage = PAGE_CONFIGS.find((p) => p.id === selectedPage);
              if (!currentPage) return null;
              const fields = currentPage[pageSubTab] || [];
              const allPageKeys = [...currentPage.seo, ...currentPage.textos, ...currentPage.imagens].map(f => f.key);
              const pageDirtyCount = allPageKeys.filter(k => textsDirty.has(k)).length;
              return (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setSelectedPage(null)}
                        className="text-neutral-400 hover:text-black text-sm font-sans px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
                      >
                        ← Voltar
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{currentPage.icon}</span>
                        <h2 className="text-lg font-sans font-bold">{currentPage.label}</h2>
                        <span className="ml-2 text-[10px] font-sans font-bold uppercase tracking-widest bg-black text-white px-2.5 py-1 rounded-full">
                          {adminLocale === 'pt-BR' ? 'Editando: PT' : 'Editing: EN'}
                        </span>
                      </div>
                    </div>
                    {pageDirtyCount > 0 && (
                      <button
                        onClick={saveAllTexts}
                        disabled={textsLoading}
                        className="bg-black text-white px-8 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-wider disabled:opacity-50"
                      >
                        {textsLoading ? 'Salvando...' : `Salvar Todos (${pageDirtyCount})`}
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2 mb-6">
                    {(['seo', 'textos', 'imagens'] as const).map((st) => {
                      const count = currentPage[st].length + (st === 'imagens' && currentPage.hasHero ? 3 : 0);
                      return (
                        <button
                          key={st}
                          onClick={() => setPageSubTab(st)}
                          className={`px-5 py-2.5 rounded-full text-sm font-sans font-medium transition-all ${
                            pageSubTab === st ? 'bg-black text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          {st === 'seo' ? 'SEO' : st === 'textos' ? 'Textos' : 'Imagens'}
                          <span className="ml-1.5 text-[10px] opacity-60">({count})</span>
                        </button>
                      );
                    })}
                  </div>

                  {textsLoading && Object.keys(siteTexts).length === 0 ? (
                    <p className="text-neutral-400 font-sans text-sm">Carregando...</p>
                  ) : (
                    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                      {fields.length === 0 && !(pageSubTab === 'imagens' && currentPage.hasHero) ? (
                        <div className="px-6 py-12 text-center">
                          <p className="text-neutral-400 font-sans text-sm">Nenhum campo de {pageSubTab === 'seo' ? 'SEO' : pageSubTab === 'textos' ? 'texto' : 'imagem'} para esta página.</p>
                        </div>
                      ) : (
                        <div className="px-6 pb-6 space-y-5">
                          {fields.map((field) => (
                            <div key={field.key} className="pt-4">
                              <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans">
                                  {field.label}
                                </label>
                                {textsDirty.has(field.key) && (
                                  <button
                                    onClick={() => saveTextField(field.key)}
                                    disabled={textsLoading}
                                    className="text-[10px] font-sans bg-black text-white px-3 py-1 rounded-full font-medium disabled:opacity-50"
                                  >
                                    Salvar
                                  </button>
                                )}
                              </div>
                              {field.type === 'image' ? (
                                <>
                                  <input
                                    value={siteTexts[field.key] || ''}
                                    onChange={(e) => updateTextField(field.key, e.target.value)}
                                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                                    placeholder="URL da imagem ou faça upload abaixo"
                                  />
                                  <div
                                    className={`mt-3 border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition-colors ${
                                      uploading ? 'opacity-50 pointer-events-none' : 'border-neutral-300 hover:border-black hover:bg-neutral-50'
                                    }`}
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const file = e.dataTransfer.files?.[0];
                                      if (file) handleImageFieldUpload(file, field.key, 'text');
                                    }}
                                    onClick={() => {
                                      const input = document.createElement('input');
                                      input.type = 'file';
                                      input.accept = 'image/*';
                                      input.onchange = (ev) => {
                                        const file = (ev.target as HTMLInputElement).files?.[0];
                                        if (file) handleImageFieldUpload(file, field.key, 'text');
                                      };
                                      input.click();
                                    }}
                                  >
                                    <p className="text-sm text-neutral-500 font-sans">
                                      {uploading ? 'Enviando...' : 'Arraste uma imagem aqui ou clique para enviar'}
                                    </p>
                                    <p className="text-[10px] text-neutral-400 font-sans mt-1">Recomendado: 1200×630px</p>
                                  </div>
                                  {siteTexts[field.key] && (
                                    <img src={siteTexts[field.key]} alt="OG Preview" className="mt-3 rounded-xl max-h-40 object-cover border border-neutral-200" />
                                  )}
                                  {!siteTexts[field.key] && (
                                    <p className="text-[10px] text-neutral-400 font-sans mt-2">Sem imagem definida — será usada a imagem padrão do Studio Dalla.</p>
                                  )}
                                </>
                              ) : field.rich ? (
                                <RichTextEditor
                                  value={siteTexts[field.key] || ''}
                                  onChange={(html) => updateTextField(field.key, html)}
                                />
                              ) : (
                                <input
                                  value={siteTexts[field.key] || ''}
                                  onChange={(e) => updateTextField(field.key, e.target.value)}
                                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                                  placeholder={field.label}
                                />
                              )}
                              {pageSubTab === 'imagens' && field.type !== 'image' && (
                                <>
                                  <div
                                    className={`mt-3 border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition-colors ${
                                      uploading ? 'opacity-50 pointer-events-none' : 'border-neutral-300 hover:border-black hover:bg-neutral-50'
                                    }`}
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const file = e.dataTransfer.files?.[0];
                                      if (file) handleImageFieldUpload(file, field.key, 'text');
                                    }}
                                    onClick={() => {
                                      const input = document.createElement('input');
                                      input.type = 'file';
                                      input.accept = 'image/*,video/*';
                                      input.onchange = (ev) => {
                                        const file = (ev.target as HTMLInputElement).files?.[0];
                                        if (file) handleImageFieldUpload(file, field.key, 'text');
                                      };
                                      input.click();
                                    }}
                                  >
                                    <p className="text-sm text-neutral-500 font-sans">
                                      {uploading ? 'Enviando...' : 'Arraste um arquivo aqui ou clique para enviar'}
                                    </p>
                                  </div>
                                  {siteTexts[field.key] && (
                                    /\.(mp4|mov|webm)$/i.test(siteTexts[field.key]) || field.key.includes('video') ? (
                                      <video src={siteTexts[field.key]} className="mt-3 rounded-xl max-h-40 w-full object-cover" controls muted />
                                    ) : (
                                      <img src={siteTexts[field.key]} alt="Preview" className="mt-3 rounded-xl max-h-40 object-cover" />
                                    )
                                  )}
                                </>
                              )}
                            </div>
                          ))}

                          {pageSubTab === 'imagens' && currentPage.hasHero && (
                            <div className="pt-6 mt-4 border-t border-neutral-100">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-5">Vídeo do Hero</h3>
                              <div className="space-y-5">
                                <div>
                                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Video Desktop (URL)</label>
                                  <input
                                    value={hero.desktopVideoUrl}
                                    onChange={(e) => setHero({ ...hero, desktopVideoUrl: e.target.value })}
                                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                                    placeholder="https://... ou /lovable-uploads/abertura-site.mp4"
                                  />
                                  {hero.desktopVideoUrl && (
                                    <video src={hero.desktopVideoUrl} className="mt-3 rounded-xl max-h-40 w-full object-cover" controls muted />
                                  )}
                                </div>
                                <div>
                                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Video Mobile (URL)</label>
                                  <input
                                    value={hero.mobileVideoUrl}
                                    onChange={(e) => setHero({ ...hero, mobileVideoUrl: e.target.value })}
                                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                                    placeholder="https://... ou /lovable-uploads/abertura-site-mobile.mp4"
                                  />
                                  {hero.mobileVideoUrl && (
                                    <video src={hero.mobileVideoUrl} className="mt-3 rounded-xl max-h-40 w-full object-cover" controls muted />
                                  )}
                                </div>
                                <div>
                                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Poster / Imagem de capa (URL)</label>
                                  <input
                                    value={hero.posterUrl}
                                    onChange={(e) => setHero({ ...hero, posterUrl: e.target.value })}
                                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-sans"
                                    placeholder="https://... ou /lovable-uploads/poster.png"
                                  />
                                  {hero.posterUrl && (
                                    <img src={hero.posterUrl} alt="Poster preview" className="mt-3 rounded-xl max-h-40 object-cover" />
                                  )}
                                </div>
                              </div>
                              <div className="mt-6">
                                <button
                                  onClick={saveHero}
                                  disabled={heroLoading}
                                  className="bg-black text-white px-8 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-wider disabled:opacity-50"
                                >
                                  {heroLoading ? 'Salvando...' : 'Salvar Hero'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
