import React from 'react';
import ContactSection from '../components/ContactSection';
import { Seo } from '../components/Seo';

const Methodology: React.FC = () => {
  const phases = [
    {
      id: 'I',
      label: 'LANDSCAPE',
      title: 'Diagnostico.',
      desc: 'Revisao e aprofundamento do cenario atual da marca, analise de percepcao, concorrencia, territorio e oportunidades estrategicas.'
    },
    {
      id: 'II',
      label: 'ESSENCE + TERRITORY',
      title: 'Reposicionamento.',
      desc: 'Definicao clara do territorio exclusivo da marca. Refinamento da essencia, diferenciacao competitiva e construcao do posicionamento.'
    },
    {
      id: 'III',
      label: 'EXPRESSION',
      title: 'Sistema de Identidade Visual.',
      desc: 'Desenvolvimento de um sistema visual proprietario, com codigos exclusivos e estrutura que sustente reconhecimento e diferenciacao.'
    },
    {
      id: 'IV',
      label: 'TERRITORY',
      title: 'Direcionamento e Consolidacao.',
      desc: 'Estruturacao das diretrizes de comunicacao, aplicacao da marca em canais fisicos e digitais e orientacao para expansao.'
    },
    {
      id: 'V',
      label: 'LEGACY',
      title: 'Legado.',
      desc: 'A marca transcende o presente. Construimos os alicerces para que ela se torne referencia duradoura no seu mercado.'
    }
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
            <span className="uppercase tracking-[0.45em] text-white/40 mb-7 block font-sans text-[11px] md:text-sm font-normal">Dalla Design Brand</span>
            <h1 className="text-white text-4xl sm:text-5xl md:text-8xl leading-[0.9] mb-6 md:mb-8 font-display tracking-tight">
              Estetica e consequencia. Posicionamento e decisao.
            </h1>
            <p className="max-w-2xl mx-auto text-base md:text-lg text-white/60 font-light font-sans leading-relaxed">
              Um metodo proprietario que une visao de mercado e design autoral para criar marcas com posicionamento incontestavel.
            </p>
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
                  <p className="text-base md:text-2xl text-neutral-500 font-light font-sans leading-relaxed max-w-2xl">{phase.desc}</p>
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
