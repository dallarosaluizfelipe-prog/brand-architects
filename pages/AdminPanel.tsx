import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/integrations/supabase/client';
import { SiteProposal, slugify } from '../src/data/siteProposals';

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

const AdminPanel: React.FC<AdminPanelProps> = ({ pin, onLogout }) => {
  const [tab, setTab] = useState<'cases' | 'media' | 'hero' | 'proposals' | 'tags'>('cases');
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

  useEffect(() => {
    loadCases();
    loadMedia();
    loadHero();
    loadProposals();
    loadTags();
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
        {(['cases', 'media', 'hero', 'proposals', 'tags'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 rounded-full text-sm font-sans font-medium transition-all ${
              tab === t ? 'bg-black text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {t === 'cases' ? 'Cases' : t === 'media' ? 'Midia' : t === 'hero' ? 'Hero' : t === 'proposals' ? 'Propostas' : 'Tags'}
          </button>
        ))}
      </div>

      <div className="px-6 pb-20 max-w-5xl mx-auto">
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
      </div>
    </div>
  );
};

export default AdminPanel;
