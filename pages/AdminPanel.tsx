import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/integrations/supabase/client';

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

const AdminPanel: React.FC<AdminPanelProps> = ({ pin, onLogout }) => {
  const [tab, setTab] = useState<'cases' | 'media'>('cases');
  const [cases, setCases] = useState<SiteCase[]>([]);
  const [editingCase, setEditingCase] = useState<SiteCase | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [message, setMessage] = useState('');

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

  useEffect(() => {
    loadCases();
    loadMedia();
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

      <div className="px-6 py-4 flex gap-2 max-w-5xl mx-auto">
        {(['cases', 'media'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 rounded-full text-sm font-sans font-medium transition-all ${
              tab === t ? 'bg-black text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {t === 'cases' ? 'Cases' : 'Midia'}
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
      </div>
    </div>
  );
};

export default AdminPanel;
