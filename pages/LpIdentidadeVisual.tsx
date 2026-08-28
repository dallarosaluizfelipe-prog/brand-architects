import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Seo } from '../components/Seo';
import { supabase } from '@/src/integrations/supabase/client';
import { pushToDataLayer, trackFormSubmission } from '@/src/hooks/useAnalytics';

/* ────────────────────────────────────────────────
   Landing Page — Identidade Visual (Google Ads)
   Rota: /lp/identidade-visual
   Estética: preto, branco, cinzas neutros. Editorial.
──────────────────────────────────────────────── */

const scrollToForm = (source: string) => {
  pushToDataLayer('dalla_cta_click', { cta_source: source, page_path: window.location.pathname });
  const el = document.getElementById('proposta');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const METHOD = [
  { n: '01', t: 'Estratégia', d: 'Entendimento do negócio, mercado, público e posicionamento.' },
  { n: '02', t: 'Conceito', d: 'Transformação da estratégia em um conceito visual proprietário.' },
  { n: '03', t: 'Identidade', d: 'Construção de logo, tipografia, cores, elementos gráficos e sistema visual.' },
  { n: '04', t: 'Aplicação', d: 'Desenvolvimento da identidade nos principais pontos de contato da marca.' },
  { n: '05', t: 'Sistema', d: 'Organização de uma identidade consistente, funcional e preparada para crescer.' },
];

const CASES = [
  {
    name: 'Lummina',
    segment: 'Iluminação e design',
    type: 'Branding · Identidade visual · Aplicações',
    desc: 'Uma identidade construída a partir da luz como território proprietário — sistema visual sóbrio, tipográfico e escalável.',
    cover: '/lovable-uploads/lummina-cover.png',
    gallery: ['/lovable-uploads/lummina-3.png', '/lovable-uploads/lummina-6.png', '/lovable-uploads/lummina-8.png'],
    href: '/cases/lummina',
  },
  {
    name: "Nuts O'Clock",
    segment: 'Alimentação saudável',
    type: 'Branding · Identidade visual · Embalagem',
    desc: 'Posicionamento claro em uma categoria saturada: identidade autoral, aplicada em embalagem e ponto de venda.',
    cover: '/lovable-uploads/nuts-oclock-cover.png',
    gallery: ['/lovable-uploads/nuts-2.png', '/lovable-uploads/nuts-11.png', '/lovable-uploads/nuts-13.png'],
    href: '/cases/nuts-oclock',
  },
  {
    name: 'Kuma Jiu-Jitsu',
    segment: 'Esporte e formação',
    type: 'Branding · Identidade visual',
    desc: 'Força e disciplina traduzidas em um sistema visual direto, reconhecível e consistente em todos os contatos.',
    cover: '/lovable-uploads/kuma-cover.gif',
    gallery: [],
    href: '/cases/kuma',
  },
];

const DELIVERY = [
  { t: 'Estratégia', items: ['Direcionamento estratégico', 'Posicionamento', 'Conceito visual'] },
  { t: 'Identidade', items: ['Logotipo', 'Versões da marca', 'Tipografia', 'Paleta cromática', 'Elementos gráficos', 'Direção visual'] },
  { t: 'Aplicações', items: ['Redes sociais', 'Materiais comerciais', 'Embalagens', 'Papelaria', 'Outras aplicações relevantes'] },
  { t: 'Guia', items: ['Diretrizes de identidade', 'Regras de aplicação', 'Arquivos finais organizados'] },
];

const FOR_WHO = [
  'Empresas em crescimento',
  'Marcas em reposicionamento',
  'Negócios entrando em uma nova fase',
  'Times profissionalizando a comunicação',
  'Marcas que precisam transmitir mais valor',
  'Quem quer deixar de parecer genérico',
];

const HOW = [
  { n: '01', t: 'Conversa inicial', d: 'Entendemos sua empresa e o momento da marca.' },
  { n: '02', t: 'Diagnóstico', d: 'Identificamos necessidades, objetivos e oportunidades.' },
  { n: '03', t: 'Proposta', d: 'Definimos escopo, investimento e prazo.' },
  { n: '04', t: 'Desenvolvimento', d: 'A identidade é construída estrategicamente.' },
  { n: '05', t: 'Entrega', d: 'Você recebe o sistema visual completo e organizado.' },
];

const FAQ = [
  { q: 'Quanto custa uma identidade visual?', a: 'Os projetos de Identidade Visual do Estúdio Dalla começam a partir de R$ 7.000. O investimento final depende do escopo e das necessidades da marca.' },
  { q: 'Quanto tempo leva?', a: 'O prazo depende do escopo do projeto e é definido antes do início do trabalho.' },
  { q: 'Vocês fazem apenas o logo?', a: 'Não. O logo é apenas uma parte da identidade visual. O projeto busca construir um sistema visual completo, consistente e estratégico para a marca.' },
  { q: 'O que está incluso?', a: 'O escopo é definido conforme as necessidades de cada projeto e pode envolver estratégia, identidade visual, aplicações e diretrizes de uso.' },
  { q: 'Vocês fazem rebranding?', a: 'Sim. O Estúdio Dalla também pode desenvolver projetos de reposicionamento e evolução de identidades existentes.', },
  { q: 'Como começo?', a: 'Preencha o formulário de contato. A partir das informações da sua empresa, será possível entender o cenário e avaliar o próximo passo.' },
];

const HERO_FRAMES = [
  { label: 'Logo', src: '/lovable-uploads/lummina-1.png' },
  { label: 'Tipografia', src: '/lovable-uploads/nuts-2.png' },
  { label: 'Cores', src: '/lovable-uploads/lummina-6.png' },
  { label: 'Elementos gráficos', src: '/lovable-uploads/nuts-11.png' },
  { label: 'Aplicações', src: '/lovable-uploads/lummina-8.png' },
  { label: 'Sistema final', src: '/lovable-uploads/nuts-13.png' },
];

const Eyebrow: React.FC<{ children: React.ReactNode; light?: boolean }> = ({ children, light }) => (
  <span className={`block font-sans text-[10px] md:text-[11px] tracking-[0.4em] mb-6 ${light ? 'text-white/40' : 'text-neutral-400'}`}>
    {children}
  </span>
);

const Cta: React.FC<{ source: string; label?: string; variant?: 'solid' | 'outline' | 'light'; className?: string }> = ({
  source,
  label = 'Solicitar proposta',
  variant = 'solid',
  className = '',
}) => {
  const base = 'inline-flex items-center justify-center px-10 py-4 md:py-5 rounded-full font-sans text-xs md:text-sm transition-all';
  const styles =
    variant === 'solid'
      ? 'bg-black text-white hover:bg-neutral-800'
      : variant === 'light'
        ? 'bg-white text-black hover:bg-neutral-200'
        : 'border border-black/30 text-black hover:bg-black hover:text-white';
  return (
    <button type="button" data-cta={source} id={`cta-${source}`} onClick={() => scrollToForm(source)} className={`${base} ${styles} ${className}`}>
      {label}
    </button>
  );
};

const LpIdentidadeVisual: React.FC = () => {
  const [frame, setFrame] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const startedRef = useRef(false);
  const scrollMarks = useRef<Record<number, boolean>>({});

  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    site: '',
    activity: '',
    need: '',
    budget: '',
    timing: '',
    email: '',
  });

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % HERO_FRAMES.length), 2600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = ((h.scrollTop + window.innerHeight) / h.scrollHeight) * 100;
      [25, 50, 75, 90].forEach((mark) => {
        if (pct >= mark && !scrollMarks.current[mark]) {
          scrollMarks.current[mark] = true;
          pushToDataLayer('dalla_scroll_depth', { percent: mark, page_path: window.location.pathname });
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    if (!startedRef.current) {
      startedRef.current = true;
      pushToDataLayer('dalla_form_start', { form_name: 'LP Identidade Visual' });
    }
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.name || !form.phone) return;
      setSending(true);
      const serviceSummary = [
        `LP Identidade Visual`,
        form.need && `Necessidade: ${form.need}`,
        form.budget && `Investimento: ${form.budget}`,
        form.timing && `Início: ${form.timing}`,
        form.site && `Site/Instagram: ${form.site}`,
        form.activity && `Atuação: ${form.activity}`,
      ]
        .filter(Boolean)
        .join(' · ');

      const email = form.email || 'nao-informado@estudiodalla.com';

      try {
        await trackFormSubmission({
          name: form.name,
          email,
          phone: form.phone,
          company: form.company,
          challenge: serviceSummary,
        } as any);
        await supabase.functions.invoke('send-contact', {
          body: { name: form.name, phone: form.phone, email, company: form.company, service: serviceSummary },
        });
        pushToDataLayer('dalla_lead_form_submit', {
          page_path: window.location.pathname,
          form_name: 'LP Identidade Visual',
          need: form.need,
          budget: form.budget,
          timing: form.timing,
        });
      } catch {
        /* silent */
      }
      setSending(false);
      setSubmitted(true);
    },
    [form],
  );

  const inputClass =
    'w-full bg-transparent border-0 border-b border-neutral-300 focus:border-black focus:ring-0 px-0 py-4 font-sans font-light text-black placeholder:text-neutral-400';

  return (
    <>
      <Seo
        title="Identidade Visual Estratégica | Estúdio Dalla"
        description="Criação de identidade visual estratégica para empresas que querem transmitir mais valor, fortalecer seu posicionamento e construir uma marca consistente."
        keywords="identidade visual, identidade visual estratégica, criação de identidade visual, branding, rebranding, designer de identidade visual, identidade de marca"
      />

      <div className="bg-white text-black min-h-screen overflow-x-hidden">
        {/* ── HEADER minimalista ── */}
        <header className="fixed top-0 inset-x-0 z-50 bg-white/85 backdrop-blur-md border-b border-black/5">
          <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 md:h-20 flex items-center justify-between gap-4">
            <span className="font-display text-base md:text-lg tracking-tight">Estúdio Dalla</span>
            <div className="flex items-center gap-6">
              <span className="hidden md:block font-sans text-[11px] tracking-[0.3em] text-neutral-400">Identidade visual</span>
              <button
                type="button"
                onClick={() => scrollToForm('header')}
                className="hidden sm:inline-flex bg-black text-white rounded-full px-6 py-3 font-sans text-[11px] md:text-xs hover:bg-neutral-800 transition-colors"
              >
                Solicitar proposta
              </button>
            </div>
          </div>
        </header>

        {/* ── 01 HERO ── */}
        <section className="pt-28 md:pt-40 pb-16 md:pb-28 px-5 md:px-10">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-20 items-center">
            <div>
              <Eyebrow>Identidade visual estratégica</Eyebrow>
              <h1 className="font-display text-[2.6rem] leading-[0.95] sm:text-6xl md:text-7xl lg:text-[5.2rem] lg:leading-[0.9] tracking-tight mb-8">
                Sua marca precisa ser mais do que bonita.
                <span className="block text-neutral-400">Precisa ser incontestável.</span>
              </h1>
              <p className="font-sans font-light text-base md:text-xl text-neutral-500 max-w-xl leading-relaxed mb-10">
                Criamos identidades visuais estratégicas para empresas que querem se posicionar melhor, transmitir mais valor e construir uma marca forte.
              </p>
              <Cta source="hero" label="Quero minha identidade visual" className="w-full sm:w-auto" />
              <p className="mt-6 font-sans text-xs md:text-sm text-neutral-400">
                +50 marcas criadas · 5+ anos de experiência · Especialista em Identidade Visual
              </p>
            </div>

            {/* Motion de apresentação de projeto */}
            <div className="relative">
              <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] rounded-[2rem] overflow-hidden bg-neutral-100 border border-black/5">
                {HERO_FRAMES.map((f, i) => (
                  <img
                    key={f.src + i}
                    src={f.src}
                    alt={`Projeto de identidade visual — ${f.label}`}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === frame ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 bg-gradient-to-t from-black/70 to-transparent">
                  <span className="font-sans text-[10px] md:text-[11px] tracking-[0.35em] text-white/80">
                    {HERO_FRAMES[frame].label}
                  </span>
                  <div className="mt-3 flex gap-1.5">
                    {HERO_FRAMES.map((_, i) => (
                      <span key={i} className={`h-px flex-1 ${i <= frame ? 'bg-white' : 'bg-white/25'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 02 PROVA / MARCAS ── */}
        <section className="py-16 md:py-28 px-5 md:px-10 border-t border-black/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-12 md:mb-16 max-w-2xl">
              Mais de 50 marcas já passaram pelo Dalla.
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-8 gap-y-10 items-center">
              {Array.from({ length: 10 }, (_, i) => (
                <img
                  key={i}
                  src={`/lovable-uploads/partner-${i + 1}.png`}
                  alt={`Marca atendida pelo Estúdio Dalla ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="h-10 md:h-16 w-full object-contain opacity-40 hover:opacity-100 transition-opacity duration-500"
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── 03 PROBLEMA ── */}
        <section className="py-24 md:py-40 px-5 md:px-10 border-t border-black/10">
          <div className="max-w-7xl mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-24 items-start">
            <h2 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[0.92] tracking-tight">
              Sua empresa evoluiu.
              <span className="block text-neutral-400">Sua marca ainda não?</span>
            </h2>
            <div className="md:pt-6">
              <p className="font-sans font-light text-lg md:text-2xl leading-relaxed text-neutral-500 mb-8">
                Uma empresa pode entregar muito valor e ainda parecer menor, genérica ou desatualizada por causa da própria identidade visual.
              </p>
              <p className="font-display text-2xl md:text-4xl tracking-tight">
                Sua marca comunica o que você realmente vale?
              </p>
            </div>
          </div>
        </section>

        {/* ── 04 MÉTODO ── */}
        <section className="py-24 md:py-40 px-5 md:px-10 bg-black text-white rounded-[2rem] md:rounded-[4rem]">
          <div className="max-w-7xl mx-auto">
            <Eyebrow light>Método Dalla</Eyebrow>
            <h2 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[0.92] tracking-tight max-w-4xl mb-8">
              Não começamos pelo logo. Começamos pela marca.
            </h2>
            <p className="font-sans font-light text-base md:text-xl text-white/50 max-w-2xl mb-16 md:mb-24">
              O projeto parte do negócio, do posicionamento e do contexto da empresa para transformar estratégia em um sistema visual proprietário.
            </p>

            <div className="divide-y divide-white/10 border-y border-white/10">
              {METHOD.map((m) => (
                <div key={m.n} className="grid md:grid-cols-[100px_260px_1fr] gap-3 md:gap-10 py-8 md:py-12 group">
                  <span className="font-display text-2xl md:text-4xl text-white/30 group-hover:text-white transition-colors">{m.n}</span>
                  <h3 className="font-display text-2xl md:text-4xl tracking-tight">{m.t}</h3>
                  <p className="font-sans font-light text-white/50 text-base md:text-lg max-w-2xl">{m.d}</p>
                </div>
              ))}
            </div>

            <div className="mt-14">
              <Cta source="metodo" variant="light" className="w-full sm:w-auto" />
            </div>
          </div>
        </section>

        {/* ── 05 CASES ── */}
        <section className="py-24 md:py-40 px-5 md:px-10">
          <div className="max-w-7xl mx-auto">
            <Eyebrow>Projetos</Eyebrow>
            <h2 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[0.92] tracking-tight max-w-3xl mb-16 md:mb-28">
              Identidades criadas para ocupar espaço.
            </h2>

            <div className="space-y-24 md:space-y-40">
              {CASES.map((c, idx) => (
                <article key={c.name} className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">
                  <div className={`lg:col-span-8 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-neutral-100 aspect-[4/3]">
                      <img
                        src={c.cover}
                        alt={`${c.name} — identidade visual desenvolvida pelo Estúdio Dalla`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {c.gallery.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 md:gap-5 mt-3 md:mt-5">
                        {c.gallery.map((g) => (
                          <div key={g} className="rounded-xl md:rounded-2xl overflow-hidden bg-neutral-100 aspect-square">
                            <img src={g} alt={`${c.name} — aplicação da identidade visual`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={`lg:col-span-4 lg:pt-6 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <h3 className="font-display text-3xl md:text-5xl tracking-tight mb-4">{c.name}</h3>
                    <p className="font-sans text-[11px] tracking-[0.3em] text-neutral-400 mb-2">{c.segment}</p>
                    <p className="font-sans text-[11px] tracking-[0.3em] text-neutral-400 mb-6">{c.type}</p>
                    <p className="font-sans font-light text-base md:text-lg text-neutral-500 leading-relaxed mb-6">{c.desc}</p>
                    <a href={c.href} className="font-sans text-sm underline underline-offset-4 text-neutral-500 hover:text-black transition-colors">
                      Ver projeto
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-20 text-center">
              <Cta source="cases" className="w-full sm:w-auto" />
            </div>
          </div>
        </section>

        {/* ── 06 LIPE ── */}
        <section className="py-24 md:py-40 px-5 md:px-10 bg-[#f4f4f4] rounded-[2rem] md:rounded-[4rem]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-[0.8fr_1.2fr] gap-12 md:gap-20 items-center">
            <div className="rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-neutral-200 aspect-[4/5]">
              <img
                src="/lovable-uploads/WhatsApp Image 2026-04-02 at 15.10.19.jpeg"
                alt="Lipe Dalla Rosa, designer responsável pelo Estúdio Dalla"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <Eyebrow>Estúdio Dalla</Eyebrow>
              <h2 className="font-display text-3xl sm:text-4xl md:text-6xl leading-[0.95] tracking-tight mb-8">
                Seu projeto é conduzido diretamente por quem cria a identidade.
              </h2>
              <p className="font-sans font-light text-base md:text-lg text-neutral-500 leading-relaxed mb-10 max-w-2xl">
                Lipe Dalla Rosa é o designer responsável pelo Estúdio Dalla, especializado em Branding e Identidade Visual. Seu trabalho combina estratégia, direção visual e construção de sistemas de identidade para empresas que precisam se posicionar melhor e transmitir mais valor.
              </p>
              <div className="grid grid-cols-2 gap-y-8 gap-x-6 border-t border-black/10 pt-10">
                {[
                  ['+5 anos', 'de experiência'],
                  ['+50 marcas', 'desenvolvidas'],
                  ['Atendimento', 'direto'],
                  ['Especialização', 'em identidade visual'],
                ].map(([a, b]) => (
                  <div key={a}>
                    <p className="font-display text-2xl md:text-3xl tracking-tight">{a}</p>
                    <p className="font-sans text-sm text-neutral-400">{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 07 O QUE O CLIENTE RECEBE ── */}
        <section className="py-24 md:py-40 px-5 md:px-10">
          <div className="max-w-7xl mx-auto">
            <Eyebrow>Entrega</Eyebrow>
            <h2 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[0.92] tracking-tight max-w-3xl mb-6">
              Uma identidade completa para sua marca.
            </h2>
            <p className="font-sans font-light text-neutral-500 max-w-2xl mb-16 md:mb-24">
              O escopo é definido projeto a projeto, conforme a necessidade da marca.
            </p>
            <div className="grid md:grid-cols-4 gap-x-10 gap-y-14 border-t border-black/10 pt-14">
              {DELIVERY.map((d) => (
                <div key={d.t}>
                  <h3 className="font-display text-2xl md:text-3xl tracking-tight mb-6">{d.t}</h3>
                  <ul className="space-y-3">
                    {d.items.map((i) => (
                      <li key={i} className="font-sans font-light text-neutral-500 text-sm md:text-base">{i}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 08 PARA QUEM É ── */}
        <section className="py-24 md:py-40 px-5 md:px-10 border-t border-black/10">
          <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_1fr] gap-12 md:gap-24">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight">
              Para empresas que precisam parecer tão boas quanto são.
            </h2>
            <div>
              <ul className="divide-y divide-black/10 border-y border-black/10">
                {FOR_WHO.map((f) => (
                  <li key={f} className="py-5 font-sans font-light text-base md:text-lg text-neutral-600">{f}</li>
                ))}
              </ul>
              <p className="mt-10 font-display text-xl md:text-2xl text-neutral-400 tracking-tight">
                Não é para quem procura apenas um logo barato.
              </p>
            </div>
          </div>
        </section>

        {/* ── 09 INVESTIMENTO ── */}
        <section className="py-24 md:py-40 px-5 md:px-10 bg-black text-white rounded-[2rem] md:rounded-[4rem]">
          <div className="max-w-4xl mx-auto text-center">
            <Eyebrow light>Investimento</Eyebrow>
            <p className="font-display text-3xl sm:text-4xl md:text-6xl leading-[0.95] tracking-tight mb-8">
              Projetos de Identidade Visual a partir de <span className="whitespace-nowrap">R$ 7.000</span>
            </p>
            <p className="font-sans font-light text-white/50 text-base md:text-xl mb-4">
              O investimento final varia conforme o escopo e as necessidades da marca.
            </p>
            <p className="font-sans font-light text-white/70 text-base md:text-xl mb-12">
              Se o objetivo é construir uma identidade profissional e estratégica, vamos entender o seu cenário.
            </p>
            <Cta source="investimento" variant="light" className="w-full sm:w-auto" />
          </div>
        </section>

        {/* ── 10 COMO FUNCIONA ── */}
        <section className="py-24 md:py-40 px-5 md:px-10">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight max-w-3xl mb-16 md:mb-24">
              Um processo claro, do primeiro contato à nova identidade.
            </h2>
            <div className="grid md:grid-cols-5 gap-10 md:gap-8 border-t border-black/10 pt-14">
              {HOW.map((h) => (
                <div key={h.n}>
                  <span className="font-sans text-[11px] tracking-[0.3em] text-neutral-400 block mb-4">{h.n}</span>
                  <h3 className="font-display text-xl md:text-2xl tracking-tight mb-3">{h.t}</h3>
                  <p className="font-sans font-light text-sm text-neutral-500 leading-relaxed">{h.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 11 DEPOIMENTOS ── */}
        <section className="py-24 md:py-40 px-5 md:px-10 border-t border-black/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl leading-[0.95] tracking-tight mb-16 max-w-2xl">
              O que clientes dizem sobre o processo.
            </h2>
            <div className="grid md:grid-cols-2 gap-6 md:gap-10">
              {[0, 1].map((i) => (
                <div key={i} className="border border-dashed border-black/15 rounded-3xl p-8 md:p-12">
                  <p className="font-sans text-sm text-neutral-400 leading-relaxed">
                    Espaço reservado para depoimento real de cliente — texto, nome, empresa, cargo e foto.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 12 FAQ ── */}
        <section className="py-24 md:py-40 px-5 md:px-10 border-t border-black/10">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight mb-14">
              Perguntas frequentes
            </h2>
            <div className="divide-y divide-black/10 border-y border-black/10">
              {FAQ.map((f, i) => (
                <div key={f.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    className="w-full text-left py-6 md:py-8 flex items-start justify-between gap-6"
                  >
                    <span className="font-display text-xl md:text-3xl tracking-tight">{f.q}</span>
                    <span className="font-sans text-2xl text-neutral-400 leading-none">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <p className="font-sans font-light text-neutral-500 text-base md:text-lg pb-8 max-w-3xl leading-relaxed">{f.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 13 CTA FINAL + FORMULÁRIO ── */}
        <section id="proposta" className="py-24 md:py-40 px-5 md:px-10 pb-32 md:pb-40 bg-[#f4f4f4] rounded-t-[2rem] md:rounded-t-[4rem] scroll-mt-20">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight mb-8">
                Pronto para construir uma marca à altura do seu negócio?
              </h2>
              <p className="font-sans font-light text-base md:text-xl text-neutral-500 max-w-lg mb-8">
                Conte um pouco sobre sua empresa e descubra como podemos transformar sua identidade visual.
              </p>
              <p className="font-sans text-sm text-neutral-400 max-w-sm">
                Sem compromisso. Primeiro entendemos sua marca e suas necessidades.
              </p>
            </div>

            <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-12">
              {submitted ? (
                <div className="min-h-[340px] flex flex-col justify-center">
                  <h3 className="font-display text-2xl md:text-4xl tracking-tight mb-4">Obrigado.</h3>
                  <p className="font-sans font-light text-neutral-500 text-base md:text-lg">
                    Recebemos suas informações. Em breve entraremos em contato para entender melhor sua marca e os próximos passos do projeto.
                  </p>
                </div>
              ) : (
                <form id="lp-form-identidade-visual" className="space-y-5" onSubmit={handleSubmit}>
                  <input aria-label="Nome" name="name" value={form.name} onChange={handleChange} required maxLength={100} placeholder="Nome *" className={inputClass} />
                  <input aria-label="Empresa" name="company" value={form.company} onChange={handleChange} maxLength={100} placeholder="Empresa" className={inputClass} />
                  <input aria-label="WhatsApp" name="phone" type="tel" value={form.phone} onChange={handleChange} required maxLength={30} placeholder="WhatsApp *" className={inputClass} />
                  <input aria-label="E-mail" name="email" type="email" value={form.email} onChange={handleChange} maxLength={255} placeholder="E-mail" className={inputClass} />
                  <input aria-label="Site ou Instagram" name="site" value={form.site} onChange={handleChange} maxLength={200} placeholder="Site ou Instagram" className={inputClass} />
                  <input aria-label="O que sua empresa faz" name="activity" value={form.activity} onChange={handleChange} maxLength={200} placeholder="O que sua empresa faz?" className={inputClass} />

                  <select aria-label="O que você precisa" name="need" value={form.need} onChange={handleChange} className={`${inputClass} appearance-none`}>
                    <option value="">O que você precisa?</option>
                    <option>Criar uma identidade visual</option>
                    <option>Rebranding</option>
                    <option>Atualizar minha identidade atual</option>
                    <option>Ainda não sei</option>
                  </select>

                  <select aria-label="Investimento pretendido" name="budget" value={form.budget} onChange={handleChange} className={`${inputClass} appearance-none`}>
                    <option value="">Qual o investimento que você pretende realizar?</option>
                    <option>R$7–10 mil</option>
                    <option>R$10–15 mil</option>
                    <option>R$15–20 mil</option>
                    <option>Acima de R$20 mil</option>
                    <option>Ainda não sei</option>
                  </select>

                  <select aria-label="Quando pretende começar" name="timing" value={form.timing} onChange={handleChange} className={`${inputClass} appearance-none`}>
                    <option value="">Quando pretende começar?</option>
                    <option>Agora</option>
                    <option>Nos próximos 30 dias</option>
                    <option>1–3 meses</option>
                    <option>Ainda estou pesquisando</option>
                  </select>

                  <button
                    type="submit"
                    disabled={sending}
                    id="cta-form-submit"
                    className="w-full bg-black text-white rounded-full py-5 font-sans text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50"
                  >
                    {sending ? 'Enviando...' : 'Solicitar proposta'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Rodapé mínimo */}
        <footer className="bg-black text-white px-5 md:px-10 py-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <span className="font-display text-base">Estúdio Dalla</span>
            <span className="font-sans text-[10px] tracking-[0.25em] text-white/40">
              © 2024 BRANDING STUDIO. ALL RIGHTS RESERVED.
            </span>
          </div>
        </footer>

        {/* CTA fixo mobile */}
        <div className="md:hidden fixed bottom-0 inset-x-0 z-50 p-3 bg-white/90 backdrop-blur border-t border-black/10">
          <button
            type="button"
            id="cta-sticky-mobile"
            onClick={() => scrollToForm('sticky_mobile')}
            className="w-full bg-black text-white rounded-full py-4 font-sans text-sm"
          >
            Solicitar proposta
          </button>
        </div>
      </div>
    </>
  );
};

export default LpIdentidadeVisual;
