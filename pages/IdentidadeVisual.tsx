import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ContactSection from '../components/ContactSection';
import { Seo } from '../components/Seo';

const HERO_VIDEO_DESKTOP = '/lovable-uploads/abertura-site.mp4';
const HERO_VIDEO_MOBILE = '/lovable-uploads/abertura-site-mobile.mp4';
const HERO_POSTER = '/lovable-uploads/2fdb741b-7706-4fa8-b5f2-dda301d0572d.png';

const METHOD_PHASES = [
  {
    id: 'I',
    label: 'LANDSCAPE',
    title: 'Diagnóstico.',
    desc: 'Imersão no universo da marca. Mapeamos mercado, concorrência, público e percepção atual para construir uma base estratégica sólida.',
  },
  {
    id: 'II',
    label: 'ESSENCE + TERRITORY',
    title: 'Posicionamento.',
    desc: 'Definimos o território exclusivo da marca. Essência, diferenciação e o posicionamento que vai guiar toda a construção visual.',
  },
  {
    id: 'III',
    label: 'EXPRESSION',
    title: 'Sistema Visual.',
    desc: 'Criação do sistema de identidade visual proprietário: logo, tipografia, paleta, elementos gráficos e códigos visuais exclusivos.',
  },
  {
    id: 'IV',
    label: 'TERRITORY',
    title: 'Aplicações.',
    desc: 'Materialização da marca em todos os pontos de contato — digital, físico, embalagens, papelaria e ambientação.',
  },
  {
    id: 'V',
    label: 'LEGACY',
    title: 'Legado.',
    desc: 'Entrega do brandbook e diretrizes completas. Sua marca preparada para crescer com consistência e reconhecimento duradouro.',
  },
];

const DELIVERABLES = [
  { icon: 'brand_family', title: 'Logotipo e variações', desc: 'Versões principal, secundária, monocromática e responsiva.' },
  { icon: 'palette', title: 'Paleta de cores', desc: 'Sistema cromático estratégico para todos os canais.' },
  { icon: 'text_fields', title: 'Tipografia', desc: 'Seleção e hierarquia tipográfica exclusiva.' },
  { icon: 'grid_view', title: 'Elementos gráficos', desc: 'Patterns, texturas e ícones proprietários.' },
  { icon: 'auto_stories', title: 'Brandbook completo', desc: 'Manual de identidade com todas as diretrizes.' },
  { icon: 'devices', title: 'Aplicações digitais', desc: 'Social media, site, apresentações e e-mail.' },
];

const IdentidadeVisual: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activePhase, setActivePhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const PHASE_DURATION = 4000;
  const TICK = 50;

  const handlePhaseClick = useCallback((idx: number) => {
    setActivePhase(idx);
    setProgress(0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK / PHASE_DURATION) * 100;
        if (next >= 100) {
          setActivePhase((p) => (p + 1) % METHOD_PHASES.length);
          return 0;
        }
        return next;
      });
    }, TICK);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Seo
        title="Identidade Visual para Marcas de Alto Valor — Studio Dalla"
        description="Criamos identidades visuais estratégicas que posicionam marcas no mercado de luxo. Método proprietário Dalla Design Brand para empresas que buscam autoridade e diferenciação."
        keywords="identidade visual, identidade visual de luxo, branding SP, logo marca premium, identidade visual empresas, rebranding, studio branding São Paulo"
      />

      <div className="animate-in fade-in duration-700">

        {/* ── HERO: Vídeo institucional ── */}
        <section className="relative min-h-[100svh] md:min-h-screen overflow-hidden bg-white rounded-b-[2.5rem] md:rounded-b-[6rem]">
          <div className="relative z-10 flex flex-col items-center justify-between min-h-[100svh] md:min-h-screen text-center px-6 pt-28 md:pt-32 pb-28 md:pb-32">
            <div />
            <div className="flex flex-col items-center">
              <span className="uppercase tracking-[0.45em] text-black/40 mb-4 block font-sans text-[11px] md:text-sm">
                Identidade visual estratégica
              </span>
              <h1 className="text-black text-4xl sm:text-5xl md:text-8xl leading-[0.9] tracking-tight max-w-5xl font-display mb-6 md:mb-8">
                Só estética não vende.
                <br />
                Sem estratégia, sua marca
                <br />
                não será escolhida.
              </h1>
              <p className="text-black/50 font-sans font-light text-base md:text-lg max-w-2xl mb-10 leading-relaxed">
                Criamos identidades visuais que não só atraem,
                <br />
                mas posicionam você para ser a decisão óbvia.
              </p>
              <Link
                to="/contato"
                className="inline-block border border-black/40 text-black px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all hover:bg-black hover:text-white font-sans"
              >
                Solicitar proposta
              </Link>
            </div>
            <div />
          </div>
        </section>

        {/* ── QUEM SOMOS ── */}
        <section className="py-20 md:py-32 px-6 bg-[#efeff0] rounded-[2.5rem] md:rounded-[5rem]">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <span className="text-[11px] uppercase tracking-[0.4em] text-neutral-400 font-sans font-bold mb-6 block">
                Sobre nós
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-6xl leading-[0.9] tracking-tight font-display mb-6">
                Estratégia e estética a serviço do seu negócio.
              </h2>
              <p className="text-neutral-500 font-sans font-light text-base md:text-lg leading-relaxed mb-4">
                Somos o Estúdio Dalla, especialista em estratégias para marcas que não querem disputar, querem ser escolhidas.
              </p>
              <p className="text-neutral-500 font-sans font-light text-base md:text-lg leading-relaxed mb-4">
                Unindo análise de mercado e design estratégico
                <br />
                para criar identidades que sustentam valor e posicionamento.
              </p>
              <p className="text-neutral-500 font-sans font-light text-base md:text-lg leading-relaxed mb-4">
                Não é só sobre como sua marca parece, é sobre como ela é percebida e por que isso define quanto ela vale.
              </p>
              <p className="text-neutral-500 font-sans font-light text-base md:text-lg leading-relaxed mb-8">
                Cada projeto é conduzido com profundidade estratégica
                <br />
                e rigor criativo para transformar estética em decisão de compra.
              </p>
              <Link
                to="/estudio"
                className="inline-block bg-black text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all hover:scale-105 font-sans"
              >
                Conheça o estúdio
              </Link>
            </div>
            <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-lg">
              <video
                src="/lovable-uploads/dalla-teaser.mov"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* ── MÉTODO (timeline rotativa) ── */}
        <section className="py-20 md:py-40 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 md:mb-24">
              <span className="uppercase tracking-[0.45em] text-neutral-400 mb-6 block font-sans text-[11px] md:text-sm font-bold">
                Dalla Design Brand
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-7xl leading-[0.9] tracking-tight font-display mb-6">
                Um método que resolve problemas de marca.
              </h2>
              <p className="text-neutral-500 font-sans font-light text-base md:text-xl max-w-2xl mx-auto">
                Cinco etapas estratégicas que transformam diagnóstico em identidade visual de alto impacto.
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Progress bar */}
              <div className="hidden md:flex justify-between items-center mb-16 relative">
                <div className="absolute left-0 right-0 top-1/2 h-px bg-neutral-200" />
                {METHOD_PHASES.map((phase, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhase(idx)}
                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold font-sans transition-all duration-500 ${
                      idx === activePhase
                        ? 'bg-black text-white scale-110'
                        : idx < activePhase
                        ? 'bg-neutral-800 text-white'
                        : 'bg-neutral-200 text-neutral-500'
                    }`}
                  >
                    {phase.id}
                  </button>
                ))}
              </div>

              {/* Active phase content */}
              <div className="bg-[#efeff0] rounded-3xl p-8 md:p-16 transition-all duration-500 min-h-[280px]">
                <div className="grid md:grid-cols-[120px_1fr] gap-6 md:gap-12 items-start">
                  <div>
                    <span className="text-4xl md:text-6xl font-display tracking-tight leading-none block">
                      {METHOD_PHASES[activePhase].id}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-400 font-bold font-sans mt-2 block">
                      {METHOD_PHASES[activePhase].label}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl md:text-5xl mb-4 md:mb-6 leading-[0.9] tracking-tighter font-display">
                      {METHOD_PHASES[activePhase].title}
                    </h3>
                    <p className="text-base md:text-xl text-neutral-500 font-light font-sans leading-relaxed max-w-2xl">
                      {METHOD_PHASES[activePhase].desc}
                    </p>
                  </div>
                </div>

                {/* Mobile dots */}
                <div className="flex md:hidden justify-center gap-2 mt-8">
                  {METHOD_PHASES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhase(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === activePhase ? 'bg-black scale-125' : 'bg-neutral-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center mt-10">
                <Link
                  to="/metodologia"
                  className="inline-block border border-black/40 text-black px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all hover:bg-black hover:text-white font-sans"
                >
                  Ver metodologia completa
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── ENTREGÁVEIS ── */}
        <section className="py-20 md:py-32 px-6 bg-black text-white rounded-[2.5rem] md:rounded-[5rem]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 md:mb-20">
              <span className="uppercase tracking-[0.45em] text-white/40 mb-6 block font-sans text-[11px] md:text-sm font-bold">
                Entregáveis
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-7xl leading-[0.9] tracking-tight font-display mb-6">
                O que sua marca ganha.
              </h2>
              <p className="text-white/50 font-sans font-light text-base md:text-xl max-w-2xl mx-auto">
                Cada projeto é entregue com um sistema visual completo, pronto para ser aplicado em todos os pontos de contato da marca.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {DELIVERABLES.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-all"
                >
                  <span className="material-symbols-outlined text-3xl mb-4 opacity-60">{item.icon}</span>
                  <h3 className="text-lg md:text-xl font-display mb-2">{item.title}</h3>
                  <p className="text-white/50 font-sans font-light text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12 md:mt-16">
              <Link
                to="/contato"
                className="inline-block bg-white text-black px-10 md:px-16 py-5 md:py-6 rounded-full text-[11px] font-bold uppercase tracking-[0.22em] hover:scale-105 transition-all shadow-xl font-sans"
              >
                Quero uma identidade visual
              </Link>
            </div>
          </div>
        </section>

        {/* ── CASES ── */}
        <section className="py-20 md:py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <span className="uppercase tracking-[0.45em] text-neutral-400 mb-6 block font-sans text-[11px] md:text-sm font-bold">
                Quem confiou no nosso método
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-7xl leading-[0.9] tracking-tight font-display mb-6">
                Cases que comprovam resultados.
              </h2>
              <p className="text-neutral-500 font-sans font-light text-base md:text-xl max-w-2xl mx-auto">
                Marcas que carregam estratégia na essência e validaram o método Dalla Design Brand.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 md:gap-12">
              <Link to="/cases/yerbal" className="group cursor-pointer">
                <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-6 shadow-lg">
                  <img alt="Yerbal — Identidade Visual" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="/lovable-uploads/yerbal-cover.gif" loading="lazy" />
                </div>
                <h3 className="text-2xl md:text-4xl mb-2 font-display">Yerbal</h3>
                <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">Branding — Identidade Visual — Embalagem</p>
              </Link>
              <Link to="/cases/clave" className="group cursor-pointer">
                <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-6 shadow-lg">
                  <img alt="Clave — Identidade Visual" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="/lovable-uploads/7eb64c92-69f8-4c75-8d27-c09dcc336dfb.png" loading="lazy" />
                </div>
                <h3 className="text-2xl md:text-4xl mb-2 font-display">Clave</h3>
                <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">Identidade — Tipografia</p>
              </Link>
              <Link to="/cases/nuts-oclock" className="group cursor-pointer">
                <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-6 shadow-lg">
                  <img alt="Nuts O'Clock — Identidade Visual" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="/lovable-uploads/nuts-oclock-cover.gif" loading="lazy" />
                </div>
                <h3 className="text-2xl md:text-4xl mb-2 font-display">Nuts O'Clock</h3>
                <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">Branding — Identidade Visual — Embalagem</p>
              </Link>
              <Link to="/cases/dalla" className="group cursor-pointer">
                <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-6 shadow-lg">
                  <img alt="Dalla — Identidade Visual" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="/lovable-uploads/dalla-cover.gif" loading="lazy" />
                </div>
                <h3 className="text-2xl md:text-4xl mb-2 font-display">Dalla</h3>
                <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">Branding — Identidade Visual</p>
              </Link>
            </div>

            <div className="text-center mt-12 md:mt-16">
              <Link
                to="/cases"
                className="inline-block border border-black px-10 md:px-16 py-4 md:py-6 rounded-full font-bold uppercase tracking-[0.18em] hover:bg-black hover:text-white transition-all font-sans text-xs md:text-sm"
              >
                Ver todos os cases
              </Link>
            </div>
          </div>
        </section>

        {/* ── PARCEIROS ── */}
        <section className="py-20 md:py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-20">
              <span className="uppercase tracking-[0.45em] text-neutral-400 mb-6 block font-sans text-[11px] md:text-sm font-bold">
                Parceiros
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-7xl leading-[0.9] tracking-tight font-display mb-6">
                Quem caminha com a gente.
              </h2>
              <p className="text-neutral-500 font-sans font-light text-base md:text-xl max-w-xl mx-auto">
                Parceiros estratégicos que colocam a marca em ação por meio do design.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-16 items-center md:opacity-30 md:grayscale hover:opacity-100 transition-all duration-1000">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="flex justify-center">
                  <img
                    src={`/lovable-uploads/partner-${i + 1}.png`}
                    alt={`Parceiro ${i + 1}`}
                    loading="lazy"
                    className="h-16 md:h-32 object-contain"
                  />
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/contato"
                className="inline-block border border-black/40 text-black px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all hover:bg-black hover:text-white font-sans"
              >
                Seja um parceiro
              </Link>
            </div>
          </div>
        </section>

        {/* ── FORMULÁRIO DE CONTATO ── */}
        <ContactSection />
      </div>
    </>
  );
};

export default IdentidadeVisual;
