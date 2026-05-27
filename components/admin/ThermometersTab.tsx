import React, { useEffect, useState } from 'react';
import { supabase } from '@/src/integrations/supabase/client';

interface Props {
  pin: string;
  onMessage: (msg: string) => void;
}

interface ThermoListItem {
  id: string;
  slug: string;
  client_name: string;
  client_logo_url: string;
  accent_color: string;
  admin_email: string;
  welcome_title: string;
  is_active: boolean;
  response_count: number;
}

interface Question {
  id?: string;
  question_text: string;
  left_label: string;
  left_icon: string;
  right_label: string;
  right_icon: string;
}

interface Editing {
  id?: string;
  slug: string;
  client_name: string;
  client_logo_url: string;
  accent_color: string;
  admin_email: string;
  welcome_title: string;
  is_active: boolean;
  questions: Question[];
}

const emptyQuestion = (): Question => ({
  question_text: '',
  left_label: '',
  left_icon: '',
  right_label: '',
  right_icon: '',
});

const emptyThermo = (): Editing => ({
  slug: '',
  client_name: '',
  client_logo_url: '',
  accent_color: '#000000',
  admin_email: 'lipe@estudiodalla.com',
  welcome_title: '',
  is_active: true,
  questions: [emptyQuestion(), emptyQuestion(), emptyQuestion()],
});

async function call(pin: string, action: string, data?: any) {
  const { data: resp, error } = await supabase.functions.invoke('thermometer-admin', {
    body: { action, pin, data },
  });
  if (error) throw error;
  if ((resp as any)?.error) throw new Error((resp as any).error);
  return resp as any;
}

const ThermometersTab: React.FC<Props> = ({ pin, onMessage }) => {
  const [items, setItems] = useState<ThermoListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [saving, setSaving] = useState(false);
  const [viewingResponses, setViewingResponses] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);
  const [expandedRespId, setExpandedRespId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await call(pin, 'list');
      setItems(r.items || []);
    } catch (e: any) {
      onMessage(e.message || 'Erro ao carregar termômetros');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startEdit(id: string) {
    try {
      const r = await call(pin, 'get', { id });
      setEditing({
        ...r.thermometer,
        questions:
          r.questions?.length > 0
            ? r.questions.map((q: any) => ({
                id: q.id,
                question_text: q.question_text,
                left_label: q.left_label,
                left_icon: q.left_icon,
                right_label: q.right_label,
                right_icon: q.right_icon,
              }))
            : [emptyQuestion(), emptyQuestion(), emptyQuestion()],
      });
    } catch (e: any) {
      onMessage(e.message || 'Erro');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este termômetro? Esta ação não pode ser desfeita.')) return;
    try {
      await call(pin, 'delete', { id });
      onMessage('Termômetro excluído');
      load();
    } catch (e: any) {
      onMessage(e.message);
    }
  }

  async function handleDuplicate(id: string) {
    try {
      await call(pin, 'duplicate', { id });
      onMessage('Termômetro duplicado');
      load();
    } catch (e: any) {
      onMessage(e.message);
    }
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.client_name.trim()) {
      onMessage('Informe o nome do cliente');
      return;
    }
    if (editing.questions.length < 3 || editing.questions.length > 12) {
      onMessage('O número de perguntas deve estar entre 3 e 12');
      return;
    }
    setSaving(true);
    try {
      await call(pin, 'upsert', {
        thermometer: {
          id: editing.id,
          slug: editing.slug,
          client_name: editing.client_name,
          client_logo_url: editing.client_logo_url,
          accent_color: editing.accent_color,
          admin_email: editing.admin_email,
          welcome_title: editing.welcome_title,
          is_active: editing.is_active,
        },
        questions: editing.questions,
      });
      onMessage('Termômetro salvo');
      setEditing(null);
      load();
    } catch (e: any) {
      onMessage(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function viewResponses(item: ThermoListItem) {
    try {
      const r = await call(pin, 'responses', { id: item.id });
      setViewingResponses({ item, ...r });
      setExpandedRespId(null);
    } catch (e: any) {
      onMessage(e.message);
    }
  }

  async function handleLogoUpload(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const name = `thermometers/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('media').upload(name, file);
      if (error) throw error;
      const { data } = supabase.storage.from('media').getPublicUrl(name);
      setEditing((prev) => (prev ? { ...prev, client_logo_url: data.publicUrl } : prev));
    } catch (e: any) {
      onMessage(e.message || 'Falha no upload');
    } finally {
      setUploading(false);
    }
  }

  function updateQ(idx: number, patch: Partial<Question>) {
    if (!editing) return;
    setEditing({
      ...editing,
      questions: editing.questions.map((q, i) => (i === idx ? { ...q, ...patch } : q)),
    });
  }

  function moveQ(idx: number, dir: -1 | 1) {
    if (!editing) return;
    const next = [...editing.questions];
    const tgt = idx + dir;
    if (tgt < 0 || tgt >= next.length) return;
    [next[idx], next[tgt]] = [next[tgt], next[idx]];
    setEditing({ ...editing, questions: next });
  }

  function addQ() {
    if (!editing || editing.questions.length >= 12) return;
    setEditing({ ...editing, questions: [...editing.questions, emptyQuestion()] });
  }

  function removeQ(idx: number) {
    if (!editing || editing.questions.length <= 3) return;
    setEditing({
      ...editing,
      questions: editing.questions.filter((_, i) => i !== idx),
    });
  }

  function copyLink(slug: string) {
    const url = `${window.location.origin}/termometro/${slug}`;
    navigator.clipboard.writeText(url);
    onMessage('Link copiado');
  }

  if (editing) {
    return (
      <div className="font-sans">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">
            {editing.id ? 'Editar termômetro' : 'Novo termômetro'}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(null)}
              className="px-4 py-2 text-sm border border-neutral-300 rounded-full hover:bg-neutral-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 text-sm bg-black text-white rounded-full disabled:opacity-50"
            >
              {saving ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-neutral-500">Nome do cliente</span>
              <input
                value={editing.client_name}
                onChange={(e) => setEditing({ ...editing, client_name: e.target.value })}
                className="w-full mt-1 border border-neutral-300 rounded px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-neutral-500">Slug do link (opcional)</span>
              <input
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                placeholder="gerado automaticamente"
                className="w-full mt-1 border border-neutral-300 rounded px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-neutral-500">E-mail do admin</span>
              <input
                type="email"
                value={editing.admin_email}
                onChange={(e) => setEditing({ ...editing, admin_email: e.target.value })}
                className="w-full mt-1 border border-neutral-300 rounded px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-neutral-500">Cor de destaque</span>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={editing.accent_color}
                  onChange={(e) => setEditing({ ...editing, accent_color: e.target.value })}
                  className="w-12 h-10 border border-neutral-300 rounded"
                />
                <input
                  value={editing.accent_color}
                  onChange={(e) => setEditing({ ...editing, accent_color: e.target.value })}
                  className="flex-1 border border-neutral-300 rounded px-3 py-2 text-sm"
                />
              </div>
            </label>
            <label className="block md:col-span-2">
              <span className="text-xs uppercase tracking-widest text-neutral-500">Título da tela de boas-vindas</span>
              <input
                value={editing.welcome_title}
                onChange={(e) => setEditing({ ...editing, welcome_title: e.target.value })}
                placeholder="Ex.: Termômetro de Marca"
                className="w-full mt-1 border border-neutral-300 rounded px-3 py-2 text-sm"
              />
            </label>

            <div className="md:col-span-2">
              <span className="text-xs uppercase tracking-widest text-neutral-500">Logo do cliente</span>
              <div className="flex items-center gap-4 mt-2">
                {editing.client_logo_url ? (
                  <img
                    src={editing.client_logo_url}
                    alt="logo"
                    className="h-16 max-w-[160px] object-contain border border-neutral-200 p-2 rounded"
                  />
                ) : (
                  <div className="h-16 w-32 border border-dashed border-neutral-300 rounded flex items-center justify-center text-xs text-neutral-400">
                    Sem logo
                  </div>
                )}
                <label className="px-4 py-2 text-sm border border-neutral-300 rounded-full hover:bg-neutral-50 cursor-pointer">
                  {uploading ? 'Enviando…' : 'Enviar logo'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleLogoUpload(f);
                    }}
                  />
                </label>
                {editing.client_logo_url && (
                  <button
                    onClick={() => setEditing({ ...editing, client_logo_url: '' })}
                    className="text-xs text-red-600 hover:underline"
                  >
                    remover
                  </button>
                )}
              </div>
            </div>

            <label className="flex items-center gap-2 md:col-span-2">
              <input
                type="checkbox"
                checked={editing.is_active}
                onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
              />
              <span className="text-sm">Ativo (link público funciona)</span>
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium uppercase tracking-widest">
                Perguntas ({editing.questions.length}/12)
              </h3>
              <button
                onClick={addQ}
                disabled={editing.questions.length >= 12}
                className="text-xs px-3 py-1 border border-neutral-300 rounded-full hover:bg-neutral-50 disabled:opacity-30"
              >
                + Adicionar pergunta
              </button>
            </div>
            <div className="space-y-4">
              {editing.questions.map((q, idx) => (
                <div key={idx} className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-widest text-neutral-500">
                      Pergunta {idx + 1}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => moveQ(idx, -1)}
                        disabled={idx === 0}
                        className="text-xs px-2 py-1 border border-neutral-200 rounded disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveQ(idx, 1)}
                        disabled={idx === editing.questions.length - 1}
                        className="text-xs px-2 py-1 border border-neutral-200 rounded disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeQ(idx)}
                        disabled={editing.questions.length <= 3}
                        className="text-xs px-2 py-1 border border-neutral-200 rounded text-red-600 disabled:opacity-30"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <input
                    placeholder="Texto da pergunta (ex.: Como você quer que sua marca seja percebida?)"
                    value={q.question_text}
                    onChange={(e) => updateQ(idx, { question_text: e.target.value })}
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-sm mb-3"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase tracking-widest text-neutral-400">Polo esquerdo</div>
                      <input
                        placeholder="Label (ex.: Moderna)"
                        value={q.left_label}
                        onChange={(e) => updateQ(idx, { left_label: e.target.value })}
                        className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
                      />
                      <input
                        placeholder="Ícone (emoji, ex.: ⚡)"
                        value={q.left_icon}
                        onChange={(e) => updateQ(idx, { left_icon: e.target.value })}
                        className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase tracking-widest text-neutral-400">Polo direito</div>
                      <input
                        placeholder="Label (ex.: Clássica)"
                        value={q.right_label}
                        onChange={(e) => updateQ(idx, { right_label: e.target.value })}
                        className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
                      />
                      <input
                        placeholder="Ícone (emoji, ex.: 🏛️)"
                        value={q.right_icon}
                        onChange={(e) => updateQ(idx, { right_icon: e.target.value })}
                        className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewingResponses) {
    const { item, responses, answers, questions = [] } = viewingResponses;
    const accent = item.accent_color || '#000000';

    function exportCsv() {
      const header = ['Email', 'Data', 'Média', ...questions.map((q: any) => q.question_text)];
      const lines = [header.map(csvCell).join(',')];
      for (const r of responses) {
        const ras = answers.filter((a: any) => a.response_id === r.id);
        const avg =
          ras.length > 0 ? (ras.reduce((s: number, a: any) => s + a.value, 0) / ras.length).toFixed(2) : '';
        const row = [
          r.client_email || 'Anônimo',
          new Date(r.completed_at).toLocaleString('pt-BR'),
          avg,
          ...questions.map((q: any) => {
            const a = ras.find((x: any) => x.question_id === q.id);
            return a ? String(a.value) : '';
          }),
        ];
        lines.push(row.map(csvCell).join(','));
      }
      const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `termometro-${item.slug}-respostas.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }

    return (
      <div className="font-sans">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Respostas — {item.client_name}</h2>
          <div className="flex gap-2">
            {responses.length > 0 && (
              <button
                onClick={exportCsv}
                className="px-4 py-2 text-sm border border-neutral-300 rounded-full hover:bg-neutral-50"
              >
                Exportar CSV
              </button>
            )}
            <button
              onClick={() => setViewingResponses(null)}
              className="px-4 py-2 text-sm border border-neutral-300 rounded-full hover:bg-neutral-50"
            >
              ← Voltar
            </button>
          </div>
        </div>
        {responses.length === 0 ? (
          <p className="text-sm text-neutral-500">Nenhuma resposta ainda.</p>
        ) : (
          <div className="space-y-3">
            {responses.map((r: any) => {
              const ras = answers.filter((a: any) => a.response_id === r.id);
              const avg =
                ras.length > 0 ? (ras.reduce((s: number, a: any) => s + a.value, 0) / ras.length).toFixed(1) : '—';
              const isOpen = expandedRespId === r.id;
              return (
                <div key={r.id} className="border border-neutral-200 rounded">
                  <button
                    type="button"
                    onClick={() => setExpandedRespId(isOpen ? null : r.id)}
                    className="w-full p-3 flex justify-between items-center text-sm text-left hover:bg-neutral-50"
                  >
                    <div>
                      <div className="font-medium">{r.client_email || 'Anônimo'}</div>
                      <div className="text-xs text-neutral-500">
                        {new Date(r.completed_at).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-neutral-500">Média</div>
                        <div className="font-medium">{avg}</div>
                      </div>
                      <span className="text-neutral-400 text-xs">{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t border-neutral-200 p-4 space-y-4 bg-neutral-50/40">
                      {questions.length === 0 ? (
                        <p className="text-xs text-neutral-500">Sem perguntas para exibir.</p>
                      ) : (
                        questions.map((q: any) => {
                          const a = ras.find((x: any) => x.question_id === q.id);
                          const val = a?.value;
                          const pct = val ? ((val - 1) / 9) * 100 : 0;
                          return (
                            <div key={q.id} className="text-sm">
                              <div className="mb-2 text-neutral-800">{q.question_text}</div>
                              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
                                <span>{q.left_label}</span>
                                <span>{q.right_label}</span>
                              </div>
                              <div className="relative h-1.5 bg-neutral-200 rounded-full">
                                {val !== undefined && (
                                  <>
                                    <div
                                      className="absolute inset-y-0 left-0 rounded-full"
                                      style={{ width: `${pct}%`, background: accent }}
                                    />
                                    <div
                                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow"
                                      style={{ left: `calc(${pct}% - 6px)`, background: accent }}
                                    />
                                  </>
                                )}
                              </div>
                              <div className="mt-1 text-right text-xs text-neutral-600">
                                {val !== undefined ? `${val} / 10` : '—'}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Termômetros</h2>
        <button
          onClick={() => setEditing(emptyThermo())}
          className="px-6 py-2 text-sm bg-black text-white rounded-full"
        >
          + Novo termômetro
        </button>
      </div>
      {loading ? (
        <p className="text-sm text-neutral-500">Carregando…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-neutral-500">Nenhum termômetro criado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((it) => (
            <div key={it.id} className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                {it.client_logo_url ? (
                  <img
                    src={it.client_logo_url}
                    alt={it.client_name}
                    className="h-12 w-16 object-contain border border-neutral-100 rounded"
                  />
                ) : (
                  <div
                    className="h-12 w-16 rounded"
                    style={{ background: it.accent_color }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{it.client_name || '(sem nome)'}</div>
                  <div className="text-xs text-neutral-500 truncate">/termometro/{it.slug}</div>
                  <div className="text-xs text-neutral-400 mt-1">
                    {it.response_count} resposta{it.response_count === 1 ? '' : 's'} ·{' '}
                    {it.is_active ? 'Ativo' : 'Inativo'}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => startEdit(it.id)}
                  className="text-xs px-3 py-1 border border-neutral-300 rounded-full hover:bg-neutral-50"
                >
                  Editar
                </button>
                <button
                  onClick={() => copyLink(it.slug)}
                  className="text-xs px-3 py-1 border border-neutral-300 rounded-full hover:bg-neutral-50"
                >
                  Copiar link
                </button>
                <button
                  onClick={() => viewResponses(it)}
                  className="text-xs px-3 py-1 border border-neutral-300 rounded-full hover:bg-neutral-50"
                >
                  Ver respostas
                </button>
                <button
                  onClick={() => handleDuplicate(it.id)}
                  className="text-xs px-3 py-1 border border-neutral-300 rounded-full hover:bg-neutral-50"
                >
                  Duplicar
                </button>
                <button
                  onClick={() => handleDelete(it.id)}
                  className="text-xs px-3 py-1 border border-neutral-300 rounded-full hover:bg-neutral-50 text-red-600"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThermometersTab;

function csvCell(v: any): string {
  const s = String(v ?? '');
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}