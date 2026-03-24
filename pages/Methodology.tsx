import React from 'react';
import ContactSection from '../components/ContactSection';
import { Seo } from '../components/Seo';
import { useSiteTexts } from '@/src/hooks/useSiteTexts';

const Methodology: React.FC = () => {
  const t = useSiteTexts({
    method_header_badge: 'Dalla Design Brand',
    method_header_title: 'Estetica e consequencia. Posicionamento e decisao.',
    method_header_subtitle: 'Um metodo proprietario que une visao de mercado e design autoral para criar marcas com posicionamento incontestavel.',
    method_phase1_label: 'LANDSCAPE',
    method_phase1_title: 'Diagnostico.',
    method_phase1_desc: 'Revisao e aprofundamento do cenario atual da marca, analise de percepcao, concorrencia, territorio e oportunidades estrategicas.',
    method_phase2_label: 'ESSENCE + TERRITORY',
    method_phase2_title: 'Reposicionamento.',
    method_phase2_desc: 'Definicao clara do territorio exclusivo da marca. Refinamento da essencia, diferenciacao competitiva e construcao do posicionamento.',
    method_phase3_label: 'EXPRESSION',
    method_phase3_title: 'Sistema de Identidade Visual.',
    method_phase3_desc: 'Desenvolvimento de um sistema visual proprietario, com codigos exclusivos e estrutura que sustente reconhecimento e diferenciacao.',
    method_phase4_label: 'TERRITORY',
    method_phase4_title: 'Direcionamento e Consolidacao.',
    method_phase4_desc: 'Estruturacao das diretrizes de comunicacao, aplicacao da marca em canais fisicos e digitais e orientacao para expansao.',
    method_phase5_label: 'LEGACY',
    method_phase5_title: 'Legado.',
    method_phase5_desc: 'A marca transcende o presente. Construimos os alicerces para que ela se torne referencia duradoura no seu mercado.',
  });

  const phases = [
    { id: 'I', label: t.method_phase1_label, title: t.method_phase1_title, desc: t.method_phase1_desc },
    { id: 'II', label: t.method_phase2_label, title: t.method_phase2_title, desc: t.method_phase2_desc },
    { id: 'III', label: t.method_phase3_label, title: t.method_phase3_title, desc: t.method_phase3_desc },
    { id: 'IV', label: t.method_phase4_label, title: t.method_phase4_title, desc: t.method_phase4_desc },
    { id: 'V', label: t.method_phase5_label, title: t.method_phase5_title, desc: t.method_phase5_desc },
  ];

  return (
    <>
      <Seo
        title="Metodologia de Branding Dalla"
        description="Entenda o metodo proprietario do Estudio Dalla para criar marcas de luxo com posicionamento estrategico e estetica autoral."
        keywords="metodologia branding, processo de branding luxo, metodo Dalla"
      />
      <div className="animate-in fade-in duration-700">
        <header className="relative min-h-[85svh] md:h-[95vh] flex flex-col justify-start items-center overflow-hidden bg-black text-white rounded-b-[2.5rem] md:rounded-b-[6rem] pt-[120px] md:pt-[180px]">
          <div className="absolute inset-0 z-0 bg-black"></div>
          <div className="relative z-10 max-w-5xl w-full text-center px-6">
            <span className="uppercase tracking-[0.45em] text-white/40 mb-7 block font-sans text-[11px] md:text-sm font-normal">{t.method_header_badge}</span>
            <h1 className="text-white text-4xl sm:text-5xl md:text-8xl leading-[0.9] mb-6 md:mb-8 font-display tracking-tight">
              {t.method_header_title}
            </h1>
            <div className="max-w-2xl mx-auto text-base md:text-lg text-white/60 font-light font-sans leading-relaxed" dangerouslySetInnerHTML={{ __html: t.method_header_subtitle }} />
          </div>
        </header>

        <section className="py-20 md:py-40 px-6 max-w-6xl mx-auto">
          <div className="space-y-16 md:space-y-48">
            {phases.map((phase, idx) => (
              <div key={idx} className="grid md:grid-cols-[180px_1fr] gap-6 md:gap-16 items-start">
                <div className="flex flex-col gap-2 pt-2">
                  <span className="text-3xl md:text-5xl font-display tracking-tight leading-none">{phase.id}</span>
                  <span className="text-[11px] uppercase tracking-[0.35em] text-neutral-400 font-bold font-sans">{phase.label}</span>
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl md:text-7xl mb-6 md:mb-8 leading-[0.9] tracking-tighter font-display">{phase.title}</h2>
                  <div className="text-base md:text-2xl text-neutral-500 font-light font-sans leading-relaxed max-w-2xl" dangerouslySetInnerHTML={{ __html: phase.desc }} />
                  {idx < phases.length - 1 && <div className="mt-10 md:mt-24 border-b border-neutral-200"></div>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <ContactSection />
      </div>
    </>
  );
};

export default Methodology;
