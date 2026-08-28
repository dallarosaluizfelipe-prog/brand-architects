import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Seo } from '../components/Seo';
import { supabase } from '@/src/integrations/supabase/client';
import { pushToDataLayer, trackFormSubmission } from '@/src/hooks/useAnalytics';

/* ───────────────────────────────────────────────────────────────────────────
   LANDING PAGE — IDENTIDADE VISUAL ESTRATÉGICA (ESTÚDIO DALLA)
   Finalidade: Tráfego pago (Google Ads) & Conversão Direcionada
   Estética: Editorial de luxo, minimalista, preto/branco/cinzas neutros,
   tipografia Instrument Serif & Nunito Sans.
   ─────────────────────────────────────────────────────────────────────────── */

// Smooth scroll helper com disparo de analytics
const scrollToForm = (source: string) => {
  pushToDataLayer('dalla_cta_click', {
    cta_source: source,
    page_path: window.location.pathname,
    cta_label: source === 'hero' ? 'QUERO MINHA IDENTIDADE VISUAL' : 'SOLICITAR PROPOSTA',
  });
  const el = document.getElementById('proposta');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const METHOD = [
  {
    n: '01',
    t: 'ESTRATÉGIA',
    d: 'Entendimento do negócio, mercado, público e posicionamento.',
  },
  {
    n: '02',
    t: 'CONCEITO',
    d: 'Transformação da estratégia em um conceito visual proprietário.',
  },
  {
    n: '03',
    t: 'IDENTIDADE',
    d: 'Construção de logo, tipografia, cores, elementos gráficos e sistema visual.',
  },
  {
    n: '04',
    t: 'APLICAÇÃO',
    d: 'Desenvolvimento da identidade nos principais pontos de contato da marca.',
  },
  {
    n: '05',
    t: 'SISTEMA',
    d: 'Organização de uma identidade consistente, funcional e preparada para crescer.',
  },
];

const CASES = [
  {
    name: 'Lummina',
    segment: 'Iluminação e design',
    type: 'Branding · Identidade visual · Aplicações',
    desc: 'Uma identidade construída a partir da luz como território proprietário — sistema visual sóbrio, tipográfico e escalável.',
    cover: '/lovable-uploads/lummina-cover.png',
    gallery: [
      '/lovable-uploads/lummina-3.png',
      '/lovable-uploads/lummina-6.png',
      '/lovable-uploads/lummina-8.png',
    ],
    href: '/cases/lummina',
  },
  {
    name: "Nuts O'Clock",
    segment: 'Alimentação saudável',
    type: 'Branding · Identidade visual · Embalagem',
    desc: 'Posicionamento claro em uma categoria saturada: identidade autoral, aplicada em embalagem e ponto de venda.',
    cover: '/lovable-uploads/nuts-oclock-cover.png',
    gallery: [
      '/lovable-uploads/nuts-2.png',
      '/lovable-uploads/nuts-11.png',
      '/lovable-uploads/nuts-13.png',
    ],
    href: '/cases/nuts-oclock',
  },
  {
    name: 'Kuma Jiu-Jitsu',
    segment: 'Esporte e formação',
    type: 'Branding · Identidade visual',
    desc: 'Força e disciplina traduzidas em um sistema visual direto, reconhecível e consistente em todos os contatos.',
    cover: '/lovable-uploads/kuma-cover.gif',
    gallery: [
      '/lovable-uploads/yerbal-6.png',
      '/lovable-uploads/clave-6.png',
      '/lovable-uploads/yerbal-12.png',
    ],
    href: '/cases/kuma',
  },
];

const DELIVERY = [
  {
    t: 'ESTRATÉGIA',
    items: ['Direcionamento estratégico', 'Posicionamento', 'Conceito visual'],
  },
  {
    t: 'IDENTIDADE',
    items: [
      'Logotipo',
      'Versões da marca',
      'Tipografia',
      'Paleta cromática',
      'Elementos gráficos',
      'Direção visual',
    ],
  },
  {
    t: 'APLICAÇÕES',
    items: [
      'Redes sociais',
      'Materiais comerciais',
      'Embalagens',
      'Papelaria',
      'Outras aplicações relevantes ao projeto',
    ],
  },
  {
    t: 'GUIA',
    items: [
      'Diretrizes de identidade',
      'Regras de aplicação',
      'Arquivos finais organizados',
    ],
  },
];

const FOR_WHO = [
  'Empresas em crescimento',
  'Marcas em reposicionamento',
  'Negócios entrando em uma nova fase',
  'Times profissionalizando a comunicação',
  'Marcas que precisam transmitir mais valor',
  'Quem quer deixar de parecer genérico',
];

const HOW_IT_WORKS = [
  {
    n: '01',
    t: 'Conversa inicial',
    d: 'Entendemos sua empresa e o momento da marca.',
  },
  {
    n: '02',
    t: 'Diagnóstico',
    d: 'Identificamos necessidades, objetivos e oportunidades.',
  },
  {
    n: '03',
    t: 'Proposta',
    d: 'Definimos escopo, investimento e prazo.',
  },
  {
    n: '04',
    t: 'Desenvolvimento',
    d: 'A identidade é construída estrategicamente.',
  },
  {
    n: '05',
    t: 'Entrega',
    d: 'Você recebe o sistema visual completo e organizado.',
  },
];

const FAQ = [
  {
    q: 'Quanto custa uma identidade visual?',
    a: 'Os projetos de Identidade Visual do Estúdio Dalla começam a partir de R$ 7.000. O investimento final depende do escopo e das necessidades da marca.',
  },
  {
    q: 'Quanto tempo leva?',
    a: 'O prazo depende do escopo do projeto e é definido antes do início do trabalho.',
  },
  {
    q: 'Vocês fazem apenas o logo?',
    a: 'Não. O logo é apenas uma parte da identidade visual. O projeto busca construir um sistema visual completo, consistente e estratégico para a marca.',
  },
  {
    q: 'O que está incluso?',
    a: 'O escopo é definido conforme as necessidades de cada projeto e pode envolver estratégia, identidade visual, aplicações e diretrizes de uso.',
  },
  {
    q: 'Vocês fazem rebranding?',
    a: 'Sim. O Estúdio Dalla também pode desenvolver projetos de reposicionamento e evolução de identidades existentes.',
  },
  {
    q: 'Como começo?',
    a: 'Preencha o formulário de contato. A partir das informações da sua empresa, será possível entender o cenário e avaliar o próximo passo.',
  },
];

const HERO_STORYBOARD = [
  {
    id: 'logo',
    label: '01. Logo',
    stepTitle: 'Construção do Símbolo & Wordmark',
    src: '/lovable-uploads/lummina-1.png',
    placeholderTag: '[Etapa 1: Logo & Símbolo]',
  },
  {
    id: 'tipografia',
    label: '02. Tipografia',
    stepTitle: 'Curadoria & Escala Tipográfica',
    src: '/lovable-uploads/nuts-2.png',
    placeholderTag: '[Etapa 2: Sistema Tipográfico]',
  },
  {
    id: 'cores',
    label: '03. Cores',
    stepTitle: 'Território Cromático Proprietário',
    src: '/lovable-uploads/lummina-6.png',
    placeholderTag: '[Etapa 3: Paleta de Cores]',
  },
  {
    id: 'elementos',
    label: '04. Gráficos',
    stepTitle: 'Códigos & Elementos de Apoio',
    src: '/lovable-uploads/nuts-11.png',
    placeholderTag: '[Etapa 4: Elementos Gráficos]',
  },
  {
    id: 'aplicacoes',
    label: '05. Aplicações',
    stepTitle: 'Pontos de Contato & Embalagens',
    src: '/lovable-uploads/lummina-8.png',
    placeholderTag: '[Etapa 5: Aplicações da Marca]',
  },
  {
    id: 'sistema',
    label: '06. Sistema',
    stepTitle: 'Composição & Sistema Final',
    src: '/lovable-uploads/nuts-13.png',
    placeholderTag: '[Etapa 6: Sistema Visual Completo]',
  },
];

const Eyebrow: React.FC<{ children: React.ReactNode; light?: boolean }> = ({
  children,
  light = false,
}) => (
  <span
    className={`block font-sans text-[10px] sm:text-[11px] md:text-xs tracking-[0.35em] mb-4 md:mb-6 font-semibold uppercase ${
      light ? 'text-white/40' : 'text-neutral-400'
    }`}
  >
    {children}
  </span>
);

interface CtaButtonProps {
  source: string;
  label?: string;
  variant?: 'solid' | 'light' | 'outline';
  className?: string;
  size?: 'normal' | 'large';
}

const CtaButton: React.FC<CtaButtonProps> = ({
  source,
  label = 'SOLICITAR PROPOSTA',
  variant = 'solid',
  className = '',
  size = 'normal',
}) => {
  const isLarge = size === 'large';
  const padding = isLarge ? 'px-8 md:px-12 py-4 md:py-5' : 'px-7 md:px-10 py-3.5 md:py-4';
  const textSize = isLarge ? 'text-xs md:text-sm tracking-[0.18em]' : 'text-[11px] md:text-xs tracking-[0.18em]';

  let variantStyles = 'bg-black text-white hover:bg-neutral-800 shadow-sm';
  if (variant === 'light') {
    variantStyles = 'bg-white text-black hover:bg-neutral-100 shadow-sm';
  } else if (variant === 'outline') {
    variantStyles = 'border border-black/30 text-black hover:bg-black hover:text-white';
  }

  return (
    <button
      type="button"
      id={`cta-${source}`}
      data-cta={source}
      onClick={() => scrollToForm(source)}
      className={`inline-flex items-center justify-center rounded-full font-sans font-medium transition-all duration-300 transform active:scale-95 cursor-pointer uppercase ${padding} ${textSize} ${variantStyles} ${className}`}
    >
      {label}
    </button>
  );
};

const LpIdentidadeVisual: React.FC = () => {
  const [activeFrame, setActiveFrame] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const formStartedRef = useRef(false);
  const scrollMarksRef = useRef<Record<number, boolean>>({});

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    site: '',
    activity: '',
    need: '',
    budget: '',
    timing: '',
  });

  // Storyboard motion auto-advancement
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFrame((prev) => (prev + 1) % HERO_STORYBOARD.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // Scroll depth tracking (25%, 50%, 75%, 90%)
  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const totalScroll = doc.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const currentPercent = (window.scrollY / totalScroll) * 100;

      [25, 50, 75, 90].forEach((milestone) => {
        if (currentPercent >= milestone && !scrollMarksRef.current[milestone]) {
          scrollMarksRef.current[milestone] = true;
          pushToDataLayer('dalla_scroll_depth', {
            percent: milestone,
            page_path: window.location.pathname,
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      pushToDataLayer('dalla_form_start', {
        form_name: 'LP Identidade Visual Estrategica',
        page_path: window.location.pathname,
      });
    }
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  /**
   * Ponto central de integração para envio de formulário
   * Integração com backend, CRM, webhook ou Edge Function
   */
  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name.trim() || !formData.phone.trim()) return;

      setSending(true);

      const serviceSummary = [
        'LP Identidade Visual Estratégica',
        formData.need && `Necessidade: ${formData.need}`,
        formData.budget && `Investimento: ${formData.budget}`,
        formData.timing && `Início: ${formData.timing}`,
        formData.company && `Empresa: ${formData.company}`,
        formData.site && `Site/Instagram: ${formData.site}`,
        formData.activity && `Atuação: ${formData.activity}`,
      ]
        .filter(Boolean)
        .join(' | ');

      const userEmail = formData.email.trim() || 'nao-informado@estudiodalla.com';

      try {
        // Envio estruturado de tracking
        await trackFormSubmission({
          name: formData.name,
          email: userEmail,
          phone: formData.phone,
          company: formData.company,
          challenge: serviceSummary,
        } as any);

        // Chamada segura para edge function
        await supabase.functions.invoke('send-contact', {
          body: {
            name: formData.name,
            phone: formData.phone,
            email: userEmail,
            company: formData.company,
            service: serviceSummary,
          },
        });

        // Disparo de evento de conversão no GTM / Google Ads
        pushToDataLayer('lead', {
          event: 'formulario_enviado',
          page_path: window.location.pathname,
          form_name: 'LP Identidade Visual Estrategica',
          need: formData.need,
          budget: formData.budget,
          timing: formData.timing,
        });
      } catch (err) {
        // Silencioso para o usuário — continua exibindo a tela de sucesso
        console.warn('Form dispatch fallback:', err);
      } finally {
        setSending(false);
        setSubmitted(true);
      }
    },
    [formData]
  );

  const inputClass =
    'w-full bg-transparent border-0 border-b border-neutral-300 focus:border-black focus:ring-0 px-0 py-4 font-sans font-light text-black placeholder:text-neutral-400 text-sm md:text-base transition-colors outline-none';

  return (
    <>
      <Seo
        title="Identidade Visual Estratégica | Estúdio Dalla"
        description="Criação de identidade visual estratégica para empresas que querem transmitir mais valor, fortalecer seu posicionamento e construir uma marca consistente."
        keywords="identidade visual, identidade visual estratégica, criação de identidade visual, branding, rebranding, designer de identidade visual, identidade de marca, estúdio de branding São Paulo"
      />

      {/* JSON-LD Schema para SEO Comercial */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: 'Estúdio Dalla — Identidade Visual Estratégica',
            description:
              'Criação de identidade visual estratégica para empresas que querem transmitir mais valor, fortalecer seu posicionamento e construir uma marca forte.',
            url: 'https://estudiodalla.com/lp/identidade-visual',
            founder: {
              '@type': 'Person',
              name: 'Lipe Dalla Rosa',
              jobTitle: 'Designer & Diretor de Arte',
            },
            priceRange: 'A partir de R$ 7.000',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'São Paulo',
              addressRegion: 'SP',
              addressCountry: 'BR',
            },
          }),
        }}
      />

      <div className="bg-white text-black min-h-screen selection:bg-black selection:text-white font-sans antialiased overflow-x-hidden">
        {/* ── HEADER MINIMALISTA (Sem links de distração para tráfego pago) ── */}
        <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5">
          <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 md:h-20 flex items-center justify-between gap-4">
            <a
              href="#top"
              className="font-serif text-xl sm:text-2xl tracking-tight text-black hover:opacity-80 transition-opacity"
            >
              ESTÚDIO DALLA
            </a>

            <div className="flex items-center gap-4 sm:gap-6">
              <span className="hidden md:inline-block font-sans text-[11px] tracking-[0.25em] text-neutral-400 uppercase font-semibold">
                IDENTIDADE VISUAL
              </span>
              <CtaButton
                source="header"
                label="SOLICITAR PROPOSTA"
                size="normal"
                className="hidden sm:inline-flex"
              />
            </div>
          </div>
        </header>

        {/* Âncora de topo */}
        <div id="top" className="h-0 w-0" />

        {/* ── 01 — HERO (PRIORIDADE MÁXIMA) ── */}
        <section className="pt-28 md:pt-44 pb-16 md:pb-28 px-5 md:px-10 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
            <div>
              <Eyebrow>IDENTIDADE VISUAL ESTRATÉGICA</Eyebrow>

              <h1 className="font-serif text-[2.75rem] leading-[0.94] sm:text-6xl md:text-7xl lg:text-[5.4rem] lg:leading-[0.9] tracking-tight mb-8">
                Sua marca precisa ser mais do que bonita.{' '}
                <span className="block text-neutral-400 mt-2">
                  Precisa ser incontestável.
                </span>
              </h1>

              <p className="font-sans font-light text-base sm:text-lg md:text-xl text-neutral-500 max-w-xl leading-relaxed mb-10">
                Criamos identidades visuais estratégicas para empresas que querem se
                posicionar melhor, transmitir mais valor e construir uma marca forte.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <CtaButton
                  source="hero"
                  label="QUERO MINHA IDENTIDADE VISUAL"
                  size="large"
                  className="w-full sm:w-auto"
                />
              </div>

              {/* Prova social discreta */}
              <div className="mt-8 pt-6 border-t border-neutral-200/60 flex items-center gap-2 text-neutral-400 font-sans text-xs md:text-sm tracking-normal">
                <span className="inline-block w-2 h-2 rounded-full bg-black/60 mr-1 animate-pulse" />
                <p>
                  +50 marcas criadas · 5+ anos de experiência · Especialista em Identidade Visual
                </p>
              </div>
            </div>

            {/* Motion / Storyboard de apresentação de projeto */}
            <div className="relative">
              <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] rounded-[2rem] overflow-hidden bg-neutral-900 border border-black/5 shadow-2xl">
                {HERO_STORYBOARD.map((item, index) => {
                  const isVisible = index === activeFrame;
                  const hasError = imageErrors[item.id];

                  return (
                    <div
                      key={item.id}
                      className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
                        isVisible ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      {!hasError ? (
                        <img
                          src={item.src}
                          alt={`Projeto de identidade visual — ${item.label}`}
                          onError={() => handleImageError(item.id)}
                          loading={index === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                          className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-1000 transform scale-100 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-neutral-900 text-white text-center">
                          <span className="font-sans text-xs tracking-[0.3em] uppercase text-white/50 mb-3">
                            {item.placeholderTag}
                          </span>
                          <span className="font-serif text-3xl md:text-4xl text-white/90">
                            {item.stepTitle}
                          </span>
                          <span className="mt-4 text-xs font-sans text-white/40 tracking-wider">
                            ESTÚDIO DALLA DESIGN SYSTEM
                          </span>
                        </div>
                      )}

                      {/* Overlay editorial inferior */}
                      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black via-black/70 to-transparent">
                        <div className="flex items-center justify-between text-white mb-2">
                          <span className="font-sans text-xs tracking-[0.25em] uppercase text-white/80 font-medium">
                            {item.label}
                          </span>
                          <span className="font-sans text-[11px] text-white/50">
                            {index + 1} / {HERO_STORYBOARD.length}
                          </span>
                        </div>
                        <p className="font-serif text-xl md:text-2xl text-white tracking-tight">
                          {item.stepTitle}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Linhas de progresso do storyboard */}
                <div className="absolute top-4 inset-x-6 z-20 flex gap-1.5">
                  {HERO_STORYBOARD.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`Ver frame ${item.label}`}
                      onClick={() => setActiveFrame(idx)}
                      className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden transition-all"
                    >
                      <div
                        className={`h-full bg-white transition-all duration-300 ${
                          idx === activeFrame ? 'w-full' : idx < activeFrame ? 'w-full opacity-60' : 'w-0'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Legenda de navegação rápida dos frames */}
              <div className="hidden sm:flex items-center justify-between mt-4 px-2">
                {HERO_STORYBOARD.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveFrame(idx)}
                    className={`font-sans text-[11px] tracking-wider uppercase transition-colors ${
                      idx === activeFrame
                        ? 'text-black font-semibold border-b border-black'
                        : 'text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    {item.id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 02 — PROVA / MARCAS ── */}
        <section className="py-16 md:py-24 px-5 md:px-10 border-b border-neutral-100 bg-[#fafafa]">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-tight mb-10 md:mb-14 text-center md:text-left text-neutral-800">
              Mais de 50 marcas já passaram pelo Dalla.
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8 items-center justify-items-center">
              {Array.from({ length: 10 }, (_, i) => {
                const partnerId = `partner-${i + 1}`;
                const hasError = imageErrors[partnerId];

                return !hasError ? (
                  <div
                    key={partnerId}
                    className="w-full h-14 md:h-16 flex items-center justify-center p-2 rounded-xl bg-white/80 border border-neutral-200/60 shadow-xs hover:border-black/20 transition-all duration-300"
                  >
                    <img
                      src={`/lovable-uploads/partner-${i + 1}.png`}
                      alt={`Marca cliente atendida pelo Estúdio Dalla ${i + 1}`}
                      onError={() => handleImageError(partnerId)}
                      loading="lazy"
                      decoding="async"
                      className="max-h-8 md:max-h-10 max-w-[80%] object-contain opacity-50 hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                ) : (
                  <div
                    key={partnerId}
                    className="w-full h-14 md:h-16 flex items-center justify-center rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-400 font-sans text-xs uppercase tracking-widest"
                  >
                    [Logo Cliente {i + 1}]
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 03 — PROBLEMA ── */}
        <section className="py-24 md:py-36 px-5 md:px-10 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-20 items-start">
            <div>
              <Eyebrow>O DESAFIO DE POSICIONAMENTO</Eyebrow>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-[0.94] tracking-tight">
                Sua empresa evoluiu.{' '}
                <span className="block text-neutral-400 mt-2">
                  Sua marca ainda não?
                </span>
              </h2>
            </div>

            <div className="md:pt-8">
              <p className="font-sans font-light text-lg sm:text-xl md:text-2xl leading-relaxed text-neutral-600 mb-8">
                Uma empresa pode entregar muito valor e ainda parecer menor, genérica
                ou desatualizada por causa da própria identidade visual.
              </p>
              <div className="p-6 md:p-8 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <p className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-tight text-black leading-snug">
                  Sua marca comunica o que você realmente vale?
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 04 — MÉTODO DALLA (PRIORIDADE MÁXIMA) ── */}
        <section className="py-20 md:py-32 px-4 sm:px-6 md:px-10">
          <div className="max-w-7xl mx-auto bg-black text-white rounded-[2rem] md:rounded-[3.5rem] p-8 sm:p-12 md:p-20 shadow-2xl">
            <Eyebrow light>MÉTODO DALLA</Eyebrow>

            <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-[0.94] tracking-tight max-w-4xl mb-8">
              Não começamos pelo logo.{' '}
              <span className="block text-neutral-400">Começamos pela marca.</span>
            </h2>

            <p className="font-sans font-light text-base sm:text-lg md:text-xl text-neutral-400 max-w-3xl mb-16 md:mb-20 leading-relaxed">
              O projeto parte do negócio, do posicionamento e do contexto da empresa
              para transformar estratégia em um sistema visual proprietário.
            </p>

            <div className="divide-y divide-white/10 border-y border-white/10">
              {METHOD.map((m) => (
                <div
                  key={m.n}
                  className="grid md:grid-cols-[100px_260px_1fr] gap-4 md:gap-10 py-8 md:py-10 group items-baseline"
                >
                  <span className="font-serif text-3xl md:text-4xl text-neutral-600 group-hover:text-white transition-colors duration-300">
                    {m.n}
                  </span>
                  <h3 className="font-sans font-semibold text-lg md:text-xl tracking-[0.1em] text-white">
                    {m.t}
                  </h3>
                  <p className="font-sans font-light text-neutral-400 text-base md:text-lg leading-relaxed max-w-2xl">
                    {m.d}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-14 md:mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <CtaButton
                source="metodo"
                variant="light"
                size="large"
                label="SOLICITAR PROPOSTA"
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </section>

        {/* ── 05 — CASES (PRIORIDADE MÁXIMA) ── */}
        <section className="py-24 md:py-36 px-5 md:px-10 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mb-16 md:mb-24">
              <Eyebrow>PORTFÓLIO SELECIONADO</Eyebrow>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-[0.94] tracking-tight mb-6">
                Identidades criadas para ocupar espaço.
              </h2>
              <p className="font-sans font-light text-base md:text-lg text-neutral-500">
                Projetos desenvolvidos com rigor técnico, posicionamento claro e sistemas visuais proprietários.
              </p>
            </div>

            <div className="space-y-28 md:space-y-40">
              {CASES.map((caseItem, idx) => {
                const coverKey = `case-cover-${caseItem.name}`;
                const hasCoverError = imageErrors[coverKey];

                return (
                  <article
                    key={caseItem.name}
                    className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start"
                  >
                    {/* Imagens / Placeholders */}
                    <div
                      className={`lg:col-span-8 ${
                        idx % 2 === 1 ? 'lg:order-2' : ''
                      }`}
                    >
                      <div className="rounded-[1.75rem] md:rounded-[2.25rem] overflow-hidden bg-neutral-100 border border-black/5 aspect-[4/3] shadow-md group">
                        {!hasCoverError ? (
                          <img
                            src={caseItem.cover}
                            alt={`${caseItem.name} — identidade visual desenvolvida pelo Estúdio Dalla`}
                            onError={() => handleImageError(coverKey)}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-neutral-100 text-neutral-700 text-center">
                            <span className="font-sans text-xs tracking-[0.3em] uppercase text-neutral-400 mb-2">
                              [Imagem principal do case: {caseItem.name}]
                            </span>
                            <span className="font-serif text-3xl md:text-5xl text-black">
                              {caseItem.name}
                            </span>
                            <span className="mt-3 text-xs text-neutral-400">
                              {caseItem.type}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Galeria de aplicações */}
                      {caseItem.gallery.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 md:gap-4 mt-3 md:mt-4">
                          {caseItem.gallery.map((gallerySrc, gIdx) => {
                            const galleryKey = `gallery-${caseItem.name}-${gIdx}`;
                            const hasGalError = imageErrors[galleryKey];

                            return (
                              <div
                                key={galleryKey}
                                className="rounded-xl md:rounded-2xl overflow-hidden bg-neutral-100 aspect-square border border-black/5"
                              >
                                {!hasGalError ? (
                                  <img
                                    src={gallerySrc}
                                    alt={`${caseItem.name} — aplicação ${gIdx + 1}`}
                                    onError={() => handleImageError(galleryKey)}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center p-2 text-center bg-neutral-100 text-neutral-400 text-[10px] uppercase tracking-wider">
                                    [Aplicação {gIdx + 1}]
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Descrição e Metadados do Case */}
                    <div
                      className={`lg:col-span-4 lg:pt-6 ${
                        idx % 2 === 1 ? 'lg:order-1' : ''
                      }`}
                    >
                      <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-neutral-400 font-semibold block mb-2">
                        {caseItem.segment}
                      </span>

                      <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4">
                        {caseItem.name}
                      </h3>

                      <p className="font-sans text-xs tracking-[0.15em] text-neutral-500 uppercase mb-6 font-medium">
                        {caseItem.type}
                      </p>

                      <p className="font-sans font-light text-base md:text-lg text-neutral-600 leading-relaxed mb-8">
                        {caseItem.desc}
                      </p>

                      <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                        <span className="font-sans text-xs tracking-wider uppercase text-neutral-400">
                          Case Study
                        </span>
                        <button
                          type="button"
                          onClick={() => scrollToForm(`case_${caseItem.name.toLowerCase()}`)}
                          className="font-sans text-xs tracking-widest uppercase font-semibold text-black hover:opacity-70 transition-opacity underline underline-offset-8"
                        >
                          SOLICITAR PROJETO SIMILAR →
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-20 md:mt-28 text-center pt-10 border-t border-neutral-100">
              <CtaButton
                source="cases"
                label="SOLICITAR PROPOSTA"
                size="large"
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </section>

        {/* ── 06 — LIPE / ESTÚDIO DALLA ── */}
        <section className="py-20 md:py-32 px-4 sm:px-6 md:px-10">
          <div className="max-w-7xl mx-auto bg-[#f5f5f5] rounded-[2rem] md:rounded-[3.5rem] p-8 sm:p-12 md:p-20">
            <div className="grid md:grid-cols-[0.8fr_1.2fr] gap-10 md:gap-16 items-center">
              {/* Foto do Lipe */}
              <div className="rounded-[1.75rem] md:rounded-[2.25rem] overflow-hidden bg-neutral-200 aspect-[4/5] border border-black/5 shadow-md">
                {!imageErrors['lipe-photo'] ? (
                  <img
                    src="/src/assets/lipe-dalla-rosa.jpeg"
                    alt="Lipe Dalla Rosa, designer e diretor do Estúdio Dalla"
                    onError={() => handleImageError('lipe-photo')}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover grayscale contrast-110"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-neutral-200 text-neutral-700 text-center">
                    <span className="font-sans text-xs tracking-[0.3em] uppercase text-neutral-400 mb-2">
                      [Foto: Lipe Dalla Rosa]
                    </span>
                    <span className="font-serif text-3xl text-black">
                      Lipe Dalla Rosa
                    </span>
                    <span className="mt-2 text-xs text-neutral-500 font-sans">
                      Fundador & Diretor de Criação
                    </span>
                  </div>
                )}
              </div>

              {/* Conteúdo de Autoridade */}
              <div>
                <Eyebrow>ATENDIMENTO DIRETO</Eyebrow>

                <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl leading-[0.95] tracking-tight mb-8">
                  Seu projeto é conduzido diretamente por quem cria a identidade.
                </h2>

                <p className="font-sans font-light text-base sm:text-lg text-neutral-600 leading-relaxed mb-10 max-w-2xl">
                  Lipe Dalla Rosa é o designer responsável pelo Estúdio Dalla,
                  especializado em Branding e Identidade Visual. Seu trabalho combina
                  estratégia, direção visual e construção de sistemas de identidade para
                  empresas que precisam se posicionar melhor e transmitir mais valor.
                </p>

                <div className="grid grid-cols-2 gap-y-8 gap-x-6 border-t border-black/10 pt-8">
                  <div>
                    <p className="font-serif text-3xl md:text-4xl tracking-tight text-black">
                      +5 anos
                    </p>
                    <p className="font-sans text-xs md:text-sm text-neutral-500 tracking-wide mt-1">
                      de experiência
                    </p>
                  </div>
                  <div>
                    <p className="font-serif text-3xl md:text-4xl tracking-tight text-black">
                      +50 marcas
                    </p>
                    <p className="font-sans text-xs md:text-sm text-neutral-500 tracking-wide mt-1">
                      desenvolvidas
                    </p>
                  </div>
                  <div>
                    <p className="font-serif text-3xl md:text-4xl tracking-tight text-black">
                      Atendimento
                    </p>
                    <p className="font-sans text-xs md:text-sm text-neutral-500 tracking-wide mt-1">
                      direto com o especialista
                    </p>
                  </div>
                  <div>
                    <p className="font-serif text-3xl md:text-4xl tracking-tight text-black">
                      Especialista
                    </p>
                    <p className="font-sans text-xs md:text-sm text-neutral-500 tracking-wide mt-1">
                      em Identidade Visual
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 07 — O QUE O CLIENTE RECEBE ── */}
        <section className="py-24 md:py-36 px-5 md:px-10 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto">
            <Eyebrow>ENTREGA COMPLETA</Eyebrow>

            <div className="max-w-3xl mb-16 md:mb-20">
              <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-[0.94] tracking-tight mb-6">
                Uma identidade completa para sua marca.
              </h2>
              <p className="font-sans font-light text-base md:text-lg text-neutral-500">
                O escopo é definido projeto a projeto, conforme as necessidades da marca.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 border-t border-black/10 pt-12">
              {DELIVERY.map((block) => (
                <div key={block.t} className="space-y-6">
                  <div className="border-b border-black/10 pb-4">
                    <h3 className="font-sans font-bold text-sm tracking-[0.2em] text-black uppercase">
                      {block.t}
                    </h3>
                  </div>
                  <ul className="space-y-3.5">
                    {block.items.map((item) => (
                      <li
                        key={item}
                        className="font-sans font-light text-neutral-600 text-sm md:text-base flex items-start gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-black/40 mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 08 — PARA QUEM É ── */}
        <section className="py-24 md:py-36 px-5 md:px-10 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-20">
            <div>
              <Eyebrow>PERFIL IDEAL</Eyebrow>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight mb-8">
                Para empresas que precisam parecer tão boas quanto são.
              </h2>
              <p className="font-sans font-light text-base md:text-lg text-neutral-500 leading-relaxed max-w-lg">
                Atendemos negócios em momentos-chave onde a percepção visual precisa
                acompanhar a excelência do produto ou serviço entregue.
              </p>
            </div>

            <div>
              <ul className="divide-y divide-black/10 border-y border-black/10">
                {FOR_WHO.map((item) => (
                  <li
                    key={item}
                    className="py-5 font-sans font-light text-base md:text-lg text-neutral-800 flex items-center justify-between"
                  >
                    <span>{item}</span>
                    <span className="text-black/30 font-serif">→</span>
                  </li>
                ))}
              </ul>

              {/* Frase de filtro */}
              <div className="mt-8 p-6 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <p className="font-serif text-xl md:text-2xl text-neutral-600 tracking-tight">
                  Não é para quem procura apenas um logo barato.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 09 — INVESTIMENTO ── */}
        <section className="py-20 md:py-32 px-4 sm:px-6 md:px-10">
          <div className="max-w-4xl mx-auto bg-black text-white rounded-[2rem] md:rounded-[3.5rem] p-8 sm:p-12 md:p-20 text-center shadow-2xl">
            <Eyebrow light>INVESTIMENTO</Eyebrow>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl leading-[0.95] tracking-tight mb-8">
              Projetos de Identidade Visual a partir de{' '}
              <span className="whitespace-nowrap font-normal text-white">
                R$ 7.000
              </span>
            </h2>

            <p className="font-sans font-light text-neutral-400 text-base md:text-xl mb-4 max-w-2xl mx-auto">
              O investimento final varia conforme o escopo e as necessidades da marca.
            </p>

            <p className="font-sans font-light text-neutral-300 text-base md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Se o objetivo é construir uma identidade profissional e estratégica, vamos
              entender o seu cenário.
            </p>

            <CtaButton
              source="investimento"
              variant="light"
              size="large"
              label="SOLICITAR PROPOSTA"
              className="w-full sm:w-auto"
            />
          </div>
        </section>

        {/* ── 10 — COMO FUNCIONA ── */}
        <section className="py-24 md:py-36 px-5 md:px-10 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto">
            <Eyebrow>PROCESSO CLARO</Eyebrow>

            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight max-w-3xl mb-16 md:mb-20">
              Um processo claro, do primeiro contato à nova identidade.
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-6 border-t border-black/10 pt-12">
              {HOW_IT_WORKS.map((h) => (
                <div key={h.n} className="space-y-3">
                  <span className="font-serif text-2xl md:text-3xl text-neutral-400 block mb-3">
                    {h.n}
                  </span>
                  <h3 className="font-sans font-semibold text-base md:text-lg text-black tracking-wide">
                    {h.t}
                  </h3>
                  <p className="font-sans font-light text-sm text-neutral-500 leading-relaxed">
                    {h.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 11 — DEPOIMENTOS (PLACEHOLDERS ESTRUTURADOS) ── */}
        <section className="py-24 md:py-36 px-5 md:px-10 border-b border-neutral-100 bg-[#fafafa]">
          <div className="max-w-7xl mx-auto">
            <Eyebrow>FEEDBACK DE CLIENTES</Eyebrow>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl leading-[0.95] tracking-tight mb-16 max-w-2xl">
              O que clientes dizem sobre o processo.
            </h2>

            <div className="grid md:grid-cols-2 gap-8 md:gap-10">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="border border-dashed border-neutral-300 bg-white rounded-3xl p-8 md:p-12 flex flex-col justify-between"
                >
                  <div className="space-y-4 mb-8">
                    <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-neutral-400 block">
                      [Aguardando depoimento oficial #{i}]
                    </span>
                    <p className="font-serif text-xl md:text-2xl text-neutral-700 leading-snug">
                      “Espaço estruturado para depoimento real sobre a metodologia,
                      clareza estratégica e impacto visual gerado para o cliente.”
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-6 border-t border-neutral-100">
                    <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center font-sans text-xs text-neutral-500 uppercase">
                      CL
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-sm text-black">
                        [Nome do Cliente / Cargo]
                      </p>
                      <p className="font-sans text-xs text-neutral-400">
                        [Nome da Empresa]
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 12 — FAQ (ACCORDION) ── */}
        <section className="py-24 md:py-36 px-5 md:px-10 border-b border-neutral-100">
          <div className="max-w-4xl mx-auto">
            <Eyebrow>TIRE SUAS DÚVIDAS</Eyebrow>

            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight mb-12 md:mb-16">
              Perguntas frequentes
            </h2>

            <div className="divide-y divide-black/10 border-y border-black/10">
              {FAQ.map((faqItem, idx) => {
                const isOpen = openFaq === idx;

                return (
                  <div key={faqItem.q} className="py-2">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full text-left py-6 flex items-start justify-between gap-6 group cursor-pointer"
                    >
                      <span className="font-serif text-xl sm:text-2xl md:text-3xl tracking-tight text-black group-hover:text-neutral-600 transition-colors">
                        {faqItem.q}
                      </span>
                      <span className="font-serif text-2xl md:text-3xl text-neutral-400 group-hover:text-black transition-colors leading-none shrink-0">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="pb-8 pt-2">
                        <p className="font-sans font-light text-neutral-600 text-base md:text-lg max-w-3xl leading-relaxed">
                          {faqItem.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 13 — CTA FINAL + FORMULÁRIO (CONVERSÃO MÁXIMA) ── */}
        <section
          id="proposta"
          className="py-24 md:py-36 px-5 md:px-10 pb-32 md:pb-40 bg-[#f4f4f4] scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
            <div>
              <Eyebrow>SOLICITAÇÃO DE PROPOSTA</Eyebrow>

              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight mb-8">
                Pronto para construir uma marca à altura do seu negócio?
              </h2>

              <p className="font-sans font-light text-base sm:text-lg md:text-xl text-neutral-600 max-w-lg mb-8 leading-relaxed">
                Conte um pouco sobre sua empresa e descubra como podemos transformar sua
                identidade visual.
              </p>

              <div className="p-6 rounded-2xl bg-white/70 border border-neutral-200/80 max-w-md">
                <p className="font-sans text-xs md:text-sm text-neutral-500 leading-relaxed">
                  <strong className="text-black font-semibold">Sem compromisso.</strong>{' '}
                  Primeiro entendemos sua marca e suas necessidades para desenhar o escopo
                  ideal.
                </p>
              </div>
            </div>

            {/* Container do Formulário */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-10 md:p-14 shadow-xl border border-black/5">
              {submitted ? (
                <div className="min-h-[380px] flex flex-col justify-center text-center p-4">
                  <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
                    Recebemos suas informações.
                  </h3>
                  <p className="font-sans font-light text-neutral-600 text-base md:text-lg max-w-md mx-auto leading-relaxed">
                    Em breve entraremos em contato para entender melhor sua marca e os
                    próximos passos do projeto.
                  </p>
                </div>
              ) : (
                <form
                  id="lp-form-identidade-visual"
                  className="space-y-6"
                  onSubmit={handleFormSubmit}
                >
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <input
                        aria-label="Nome completo"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        maxLength={100}
                        placeholder="Nome *"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <input
                        aria-label="Nome da empresa"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        maxLength={100}
                        placeholder="Empresa"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <input
                        aria-label="WhatsApp com DDD"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        maxLength={30}
                        placeholder="WhatsApp *"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <input
                        aria-label="Endereço de E-mail"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        maxLength={255}
                        placeholder="E-mail"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      aria-label="Site ou perfil do Instagram"
                      name="site"
                      value={formData.site}
                      onChange={handleInputChange}
                      maxLength={200}
                      placeholder="Site ou Instagram da empresa"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <textarea
                      aria-label="O que sua empresa faz"
                      name="activity"
                      rows={2}
                      value={formData.activity}
                      onChange={handleInputChange}
                      maxLength={300}
                      placeholder="O que sua empresa faz? (breve descrição)"
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans uppercase tracking-wider text-neutral-400 mb-1">
                      O que você precisa?
                    </label>
                    <select
                      aria-label="O que você precisa"
                      name="need"
                      value={formData.need}
                      onChange={handleInputChange}
                      className={`${inputClass} cursor-pointer bg-white`}
                    >
                      <option value="">Selecione uma opção</option>
                      <option value="Criar uma identidade visual">
                        Criar uma identidade visual
                      </option>
                      <option value="Rebranding">Rebranding</option>
                      <option value="Atualizar minha identidade atual">
                        Atualizar minha identidade atual
                      </option>
                      <option value="Ainda não sei">Ainda não sei</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-sans uppercase tracking-wider text-neutral-400 mb-1">
                      Investimento pretendido
                    </label>
                    <select
                      aria-label="Qual o investimento que você pretende realizar"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className={`${inputClass} cursor-pointer bg-white`}
                    >
                      <option value="">Qual o investimento que você pretende realizar?</option>
                      <option value="R$7–10 mil">R$7–10 mil</option>
                      <option value="R$10–15 mil">R$10–15 mil</option>
                      <option value="R$15–20 mil">R$15–20 mil</option>
                      <option value="Acima de R$20 mil">Acima de R$20 mil</option>
                      <option value="Ainda não sei">Ainda não sei</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-sans uppercase tracking-wider text-neutral-400 mb-1">
                      Quando pretende começar?
                    </label>
                    <select
                      aria-label="Quando pretende começar"
                      name="timing"
                      value={formData.timing}
                      onChange={handleInputChange}
                      className={`${inputClass} cursor-pointer bg-white`}
                    >
                      <option value="">Selecione o prazo ideal</option>
                      <option value="Agora">Agora</option>
                      <option value="Nos próximos 30 dias">Nos próximos 30 dias</option>
                      <option value="1–3 meses">1–3 meses</option>
                      <option value="Ainda estou pesquisando">Ainda estou pesquisando</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={sending}
                      id="cta-form-submit"
                      className="w-full bg-black text-white rounded-full py-5 font-sans text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all duration-300 transform active:scale-98 disabled:opacity-50 cursor-pointer shadow-lg"
                    >
                      {sending ? 'ENVIANDO INFORMAÇÕES...' : 'SOLICITAR PROPOSTA'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ── RODAPÉ MÍNIMO ── */}
        <footer className="bg-black text-white px-5 md:px-10 py-10 border-t border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-center sm:text-left">
            <span className="font-serif text-lg tracking-tight">ESTÚDIO DALLA</span>
            <span className="font-sans text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
              © {new Date().getFullYear()} ESTÚDIO DALLA · TODOS OS DIREITOS RESERVADOS
            </span>
          </div>
        </footer>

        {/* ── BARRA FIXA MOBILE (STICKY BOTTOM CTA) ── */}
        <div className="md:hidden fixed bottom-0 inset-x-0 z-50 p-3 bg-white/95 backdrop-blur-md border-t border-black/10 shadow-2xl">
          <button
            type="button"
            id="cta-sticky-mobile"
            onClick={() => scrollToForm('sticky_mobile')}
            className="w-full bg-black text-white rounded-full py-4 font-sans text-xs font-semibold tracking-[0.2em] uppercase active:scale-98 shadow-md"
          >
            SOLICITAR PROPOSTA
          </button>
        </div>
      </div>
    </>
  );
};

export default LpIdentidadeVisual;
