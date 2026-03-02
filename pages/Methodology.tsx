
import React from 'react';
import ContactSection from '../components/ContactSection';

const Methodology: React.FC = () => {
  const phases = [
  {
    id: 'I',
    label: 'LANDSCAPE',
    title: 'Diagnóstico.',
    desc: 'Revisão e aprofundamento do cenário atual da marca, análise de percepção, concorrência, território e oportunidades estratégicas.'
  },
  {
    id: 'II + III',
    label: 'ESSENCE + TERRITORY',
    title: 'Reposicionamento.',
    desc: 'Definição clara do território exclusivo da marca. Refinamento da essência, diferenciação competitiva e construção do posicionamento.'
  },
  {
    id: 'IV',
    label: 'EXPRESSION',
    title: 'Sistema de Identidade Visual.',
    desc: 'Desenvolvimento de um sistema visual proprietário, com códigos exclusivos, elementos gráficos autorais e estrutura que sustente reconhecimento e diferenciação.'
  },
  {
    id: 'III',
    label: 'EXPRESSION',
    title: 'Direcionamento e Consolidação.',
    desc: 'Estruturação das diretrizes de comunicação, aplicação da marca em canais físicos e digitais e orientação estratégica para expansão e fortalecimento.'
  },
  {
    id: 'V',
    label: 'LEGACY',
    title: 'Legado.',
    desc: 'A marca transcende o presente. Construímos os alicerces para que ela se torne referência duradoura no seu mercado.'
  }];


  return (
    <div className="animate-in fade-in duration-700">
      <header className="relative h-[95vh] flex flex-col justify-start items-center overflow-hidden bg-black text-white rounded-b-[4rem] md:rounded-b-[6rem] pt-[140px] md:pt-[180px]">
        <div className="absolute inset-0 z-0 bg-black"></div>
        <div className="relative z-10 max-w-5xl w-full text-center px-6">
          <span className="uppercase tracking-[0.5em] text-white/40 mb-8 block font-sans text-sm font-normal">Dalla Design Brand</span>
          <h1 className="text-white text-5xl md:text-8xl leading-[0.9] mb-8 font-display tracking-tight">
            Estética é consequência. Posicionamento é decisão.
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/50 font-light font-sans leading-relaxed md:text-lg">
            Um método proprietário que une visão de mercado e design autoral para criar marcas com posicionamento incontestável.
          </p>
        </div>
      </header>

      <section className="py-40 px-6 max-w-6xl mx-auto">
        <div className="space-y-32 md:space-y-48">
          {phases.map((phase, idx) =>
          <div key={idx} className="grid md:grid-cols-[180px_1fr] gap-8 md:gap-16 items-start">
              <div className="flex flex-col gap-2 pt-2">
                <span className="text-3xl md:text-5xl font-display tracking-tight leading-none">{phase.id}</span>
                <span className="text-[11px] uppercase tracking-[0.4em] text-neutral-400 font-bold font-sans">{phase.label}</span>
              </div>
              <div>
                <h2 className="text-5xl mb-8 leading-[0.85] tracking-tighter font-display md:text-7xl">{phase.title}</h2>
                <p className="text-xl md:text-2xl text-neutral-500 font-light font-sans leading-relaxed max-w-2xl">
                  {phase.desc}
                </p>
                {idx < phases.length - 1 &&
              <div className="mt-16 md:mt-24 border-b border-neutral-200"></div>
              }
              </div>
            </div>
          )}
        </div>
      </section>

      <ContactSection />
    </div>);


};

export default Methodology;