import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/integrations/supabase/client';
import { SiteProposal, slugify } from '../src/data/siteProposals';
import RichTextEditor from '../src/components/RichTextEditor';

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
  period_days: number;
}

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
}

interface TextSection {
  page: string;
  label: string;
  fields: TextFieldDef[];
}

const TEXT_SECTIONS: TextSection[] = [
  {
    page: 'home',
    label: 'Home',
    fields: [
      { key: 'home_hero_badge', label: 'Badge do Hero' },
      { key: 'home_hero_title', label: 'Titulo do Hero' },
      { key: 'home_hero_subtitle', label: 'Subtitulo do Hero', rich: true },
      { key: 'home_cases_title', label: 'Titulo da Secao Cases' },
      { key: 'home_cases_subtitle', label: 'Subtitulo da Secao Cases', rich: true },
      { key: 'home_partners_title', label: 'Titulo Parceiros' },
      { key: 'home_partners_subtitle', label: 'Subtitulo Parceiros', rich: true },
    ],
  },
  {
    page: 'about',
    label: 'Sobre',
    fields: [
      { key: 'about_header_badge', label: 'Badge do Header' },
      { key: 'about_header_title', label: 'Titulo do Header' },
      { key: 'about_header_subtitle', label: 'Subtitulo do Header', rich: true },
      { key: 'about_vision_title', label: 'Titulo Visao' },
      { key: 'about_vision_p1', label: 'Visao - Paragrafo 1', rich: true },
      { key: 'about_vision_p2', label: 'Visao - Paragrafo 2', rich: true },
      { key: 'about_pillars_badge', label: 'Badge dos Pilares' },
      { key: 'about_pillars_title', label: 'Titulo dos Pilares' },
      { key: 'about_pillar1_title', label: 'Pilar 1 - Titulo' },
      { key: 'about_pillar1_desc', label: 'Pilar 1 - Descricao', rich: true },
      { key: 'about_pillar2_title', label: 'Pilar 2 - Titulo' },
      { key: 'about_pillar2_desc', label: 'Pilar 2 - Descricao', rich: true },
      { key: 'about_pillar3_title', label: 'Pilar 3 - Titulo' },
      { key: 'about_pillar3_desc', label: 'Pilar 3 - Descricao', rich: true },
    ],
  },
  {
    page: 'methodology',
    label: 'Metodologia',
    fields: [
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
  },
  {
    page: 'portfolio',
    label: 'Portfolio',
    fields: [
      { key: 'portfolio_header_title', label: 'Titulo do Header' },
      { key: 'portfolio_header_subtitle', label: 'Subtitulo do Header', rich: true },
    ],
  },
  {
    page: 'contact',
    label: 'Contato',
    fields: [
      { key: 'contact_header_title', label: 'Titulo do Header' },
      { key: 'contact_info', label: 'Info de Contato (endereco/tel)', rich: true },
      { key: 'contact_emails', label: 'Emails', rich: true },
    ],
  },
  {
    page: 'footer',
    label: 'Footer',
    fields: [
      { key: 'footer_contacts', label: 'Info de Contatos', rich: true },
      { key: 'footer_copyright', label: 'Copyright' },
    ],
  },
  {
    page: 'contact_section',
    label: 'Secao de Contato (CTA)',
    fields: [
      { key: 'cta_section_title', label: 'Titulo da Secao CTA', rich: true },
    ],
  },
  {
    page: 'seo',
    label: 'SEO Padrao',
    fields: [
      { key: 'seo_default_title', label: 'Titulo Padrao' },
      { key: 'seo_default_description', label: 'Descricao Padrao' },
      { key: 'seo_default_keywords', label: 'Keywords Padrao' },
    ],
  },
];

const AdminPanel: React.FC<AdminPanelProps> = ({ pin, onLogout }) => {
  const [tab, setTab] = useState<'dashboard' | 'cases' | 'media' | 'hero' | 'proposals' | 'tags' | 'textos'>('dashboard');
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
  const [siteTexts, setSiteTexts] = useState<Record<string, string>>({});
  const [textsLoading, setTextsLoading] = useState(false);
  const [textsDirty, setTextsDirty] = useState<Set<string>>(new Set());
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  // Dashboard state
  const [dashPeriod, setDashPeriod] = useState(30);
  const [dashData, setDashData] = useState<AnalyticsSummary | null>(null);
  const [dashLoading, setDashLoading] = useState(false);
  const [dashSubmissions, setDashSubmissions] = useState<FormSubmission[]>([]);
  const [dashSubsLoading, setDashSubsLoading] = useState(false);

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
  });

  const loadCases = async () => {
    setLoading(true);
    const result = await apiCall('list_cases');
    const mapped = (result.cases || []).map(normalizeCase);
    setCases(mapped);
    setLoading(false);
  };

  const loadMedia = async () => {
    const { data } = await supabase.storage.from('media').list('', { limit: 200 });
    setMediaFiles((data || []).map((f) => f.name));
  };

  const loadHero = async () => {
    const result = await apiCall('list_content');
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
    await apiCall('upsert_content', {
      section_key: 'hero_video_desktop',
      title: 'Hero Video Desktop',
      video_url: hero.desktopVideoUrl,
      image_url: hero.posterUrl,
    });
    await apiCall('upsert_content', {
      section_key: 'hero_video_mobile',
      title: 'Hero Video Mobile',
      video_url: hero.mobileVideoUrl,
    });
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
    created_at: item.created_at,
    updated_at: item.updated_at,
  });

  const loadProposals = async () => {
    setProposalsLoading(true);
    const result = await apiCall('list_proposals');
    const mapped = (result.proposals || []).map(normalizeProposal);
    setProposals(mapped);
    setProposalsLoading(false);
  };

  const saveProposal = async () => {
    if (!editingProposal) return;
    setProposalsLoading(true);
    await apiCall('upsert_proposal', editingProposal);
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

  const loadTexts = async () => {
    setTextsLoading(true);
    const result = await apiCall('list_content');
    const items: any[] = result.content || [];
    const map: Record<string, string> = {};
    for (const item of items) {
      if (item.section_key && item.body != null) {
        map[item.section_key] = item.body;
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
    await apiCall('upsert_content', {
      section_key: key,
      title: key,
      body: siteTexts[key] || '',
    });
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
    for (const key of dirty) {
      await apiCall('upsert_content', {
        section_key: key,
        title: key,
        body: siteTexts[key] || '',
      });
    }
    setTextsDirty(new Set());
    showMessage(`${dirty.length} texto(s) salvo(s)!`);
    setTextsLoading(false);
  };

  const toggleSection = (page: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
  };

  const loadDashboard = async (days?: number) => {
    const d = days ?? dashPeriod;
    setDashLoading(true);
    const result = await apiCall('analytics_summary', { days: d });
    setDashData(result);
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

  useEffect(() => {
    loadCases();
    loadMedia();
    loadHero();
    loadProposals();
    loadTags();
    loadTexts();
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
    cta_url: 'https://api.whatsapp.com/send/?phone=5542999153814&text=Ola%2C+quero+falar+sobre+um+projeto+de+branding&type=phone_number&app_absent=0',
    display_order: cases.length + 1,
    is_featured: false,
    is_visible: true,
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-display tracking-tight">Painel Admin</h1>
        <button onClick={onLogout} className="text-sm text-neutral-400 hover:text-black font-sans transition-colors">
          Sair
        </button>
      </div>

      {message && (
        <div className="fixed top-20 right-6 bg-black text-white px-6 py-3 rounded-xl text-sm font-sans z-50 animate-in fade-in slide-in-from-top-2">
          {message}
        </div>
      )}

      <div className="px-6 py-4 flex gap-2 max-w-5xl mx-auto flex-wrap">
        {(['dashboard', 'cases', 'media', 'hero', 'proposals', 'tags', 'textos'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 rounded-full text-sm font-sans font-medium transition-all ${
              tab === t ? 'bg-black text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {t === 'dashboard' ? 'Dashboard' : t === 'cases' ? 'Cases' : t === 'media' ? 'Midia' : t === 'hero' ? 'Hero' : t === 'proposals' ? 'Propostas' : t === 'tags' ? 'Tags' : 'Textos'}
          </button>
        ))}
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
              <button
                onClick={() => { loadDashboard(); loadFormSubmissions(); }}
                disabled={dashLoading}
                className="ml-auto text-xs font-sans text-neutral-500 hover:text-black px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                {dashLoading ? 'Atualizando...' : 'Atualizar'}
              </button>
            </div>

            {dashLoading && !dashData ? (
              <p className="text-neutral-400 font-sans text-sm">Carregando dashboard...</p>
            ) : dashData ? (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Visitas</p>
                    <p className="text-4xl font-display">{dashData.total_page_views.toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-neutral-400 font-sans mt-1">ultimos {dashData.period_days} dias</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Cliques WhatsApp</p>
                    <p className="text-4xl font-display">{dashData.whatsapp_clicks.toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-neutral-400 font-sans mt-1">ultimos {dashData.period_days} dias</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans mb-2">Formularios</p>
                    <p className="text-4xl font-display">{dashData.form_submissions.toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-neutral-400 font-sans mt-1">ultimos {dashData.period_days} dias</p>
                  </div>
                </div>

                {/* Daily Views Mini-Chart */}
                {Object.keys(dashData.daily_views).length > 0 && (
                  <div className="bg-white rounded-2xl p-6 border border-neutral-200 mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 font-sans mb-4">Visitas por Dia</h3>
                    <div className="flex items-end gap-[2px] h-32">
                      {(() => {
                        const entries = Object.entries(dashData.daily_views).sort(([a], [b]) => a.localeCompare(b));
                        const maxVal = Math.max(...entries.map(([, v]) => v), 1);
                        return entries.map(([day, count]) => (
                          <div
                            key={day}
                            className="flex-1 bg-black rounded-t-sm hover:bg-neutral-700 transition-colors group relative min-w-[3px]"
                            style={{ height: `${Math.max((count / maxVal) * 100, 2)}%` }}
                            title={`${day}: ${count} visita(s)`}
                          >
                            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-sans">
                              {day.slice(5)}: {count}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Top Pages */}
                  <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 font-sans mb-4">Paginas Mais Visitadas</h3>
                    {dashData.top_pages.length === 0 ? (
                      <p className="text-neutral-400 font-sans text-sm">Sem dados ainda.</p>
                    ) : (
                      <div className="space-y-3">
                        {dashData.top_pages.map((p, i) => {
                          const maxCount = dashData.top_pages[0]?.count || 1;
                          return (
                            <div key={i}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-sans truncate max-w-[70%]">{p.page}</span>
                                <span className="text-sm font-sans font-medium text-neutral-600">{p.count}</span>
                              </div>
                              <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                <div className="h-full bg-black rounded-full transition-all" style={{ width: `${(p.count / maxCount) * 100}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Top Regions */}
                  <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 font-sans mb-4">Visitas por Regiao</h3>
                    {dashData.top_regions.length === 0 ? (
                      <p className="text-neutral-400 font-sans text-sm">Sem dados ainda.</p>
                    ) : (
                      <div className="space-y-3">
                        {dashData.top_regions.map((r, i) => {
                          const maxCount = dashData.top_regions[0]?.count || 1;
                          return (
                            <div key={i}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-sans truncate max-w-[70%]">{r.region}</span>
                                <span className="text-sm font-sans font-medium text-neutral-600">{r.count}</span>
                              </div>
                              <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                <div className="h-full bg-black rounded-full transition-all" style={{ width: `${(r.count / maxCount) * 100}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
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
              </>
            ) : (
              <p className="text-neutral-400 font-sans text-sm">Sem dados de analytics disponiveiss.</p>
            )}
          </div>
        )}

        {tab === 'cases' && (
          <div>
            {editingCase ? (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                <h2 className="text-lg font-display mb-6">{editingCase.id ? 'Editar Case' : 'Novo Case'}</h2>
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
                          <h3 className="font-display text-lg truncate">{c.title}</h3>
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

        {tab === 'hero' && (
          <div className="bg-white rounded-2xl p-6 border border-neutral-200">
            <h2 className="text-lg font-display mb-6">Video do Hero</h2>
            <p className="text-sm text-neutral-500 font-sans mb-6">Gerencie os videos exibidos na hero da pagina inicial. Envie os arquivos na aba Midia, copie a URL e cole aqui.</p>
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
            <div className="mt-8">
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
                <h2 className="text-lg font-display mb-6">{editingProposal.id ? 'Editar Proposta' : 'Nova Proposta'}</h2>
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
                          <h3 className="font-display text-lg truncate">{p.title}</h3>
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
                <h2 className="text-lg font-display mb-6">{editingTag.id ? 'Editar Tag' : 'Nova Tag'}</h2>
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
                            <h3 className="font-display text-lg truncate">{tag.label || tag.tag_id}</h3>
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

        {tab === 'textos' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-display">Textos do Site</h2>
                <p className="text-sm text-neutral-500 font-sans mt-1">Edite os textos de todas as paginas. Campos com editor permitem negrito, italico e sublinhado.</p>
              </div>
              {textsDirty.size > 0 && (
                <button
                  onClick={saveAllTexts}
                  disabled={textsLoading}
                  className="bg-black text-white px-8 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {textsLoading ? 'Salvando...' : `Salvar Todos (${textsDirty.size})`}
                </button>
              )}
            </div>

            {textsLoading && Object.keys(siteTexts).length === 0 ? (
              <p className="text-neutral-400 font-sans text-sm">Carregando textos...</p>
            ) : (
              <div className="space-y-4">
                {TEXT_SECTIONS.map((section) => {
                  const isOpen = openSections.has(section.page);
                  const dirtyCount = section.fields.filter((f) => textsDirty.has(f.key)).length;
                  return (
                    <div key={section.page} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.page)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-display">{section.label}</span>
                          <span className="text-xs text-neutral-400 font-sans">{section.fields.length} campos</span>
                          {dirtyCount > 0 && (
                            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-sans font-medium">
                              {dirtyCount} alterado(s)
                            </span>
                          )}
                        </div>
                        <span className="text-neutral-400 text-xl transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          ▾
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6 space-y-5 border-t border-neutral-100">
                          {section.fields.map((field) => (
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
                              {field.rich ? (
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
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
