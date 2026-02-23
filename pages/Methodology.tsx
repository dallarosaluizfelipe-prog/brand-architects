
import React from 'react';
import ContactSection from '../components/ContactSection';

const Methodology: React.FC = () => {
  const phases = [
  {
    id: '01',
    title: 'Archetypal Discovery.',
    desc: 'We begin by stripping away the noise to find the core truth of your business. Through intensive workshops and market audit, we identify the archetypal foundation of your brand.',
    image: 'https://picsum.photos/id/50/1200/1500?grayscale',
    aspect: 'aspect-[4/5]'
  },
  {
    id: '02',
    title: 'Strategic Narrative.',
    desc: "Strategy is the blueprint. We define your brand's voice, positioning, and value proposition. We create a narrative that isn't just told, but felt across every touchpoint.",
    image: 'https://picsum.photos/id/51/1200/900?grayscale',
    aspect: 'aspect-[4/3]'
  },
  {
    id: '03',
    title: 'Visual Synthesis.',
    desc: 'The translation of concept into form. We develop bespoke typography, rigorous grid systems, and a color palette that evokes authority and elegance.',
    image: 'https://picsum.photos/id/52/1000/1000?grayscale',
    aspect: 'aspect-square'
  },
  {
    id: '04',
    title: 'The Manifestation.',
    desc: 'From digital ecosystems to tactile physical collateral. We oversee the precise implementation of the brand system, ensuring consistency and excellence in every medium.',
    image: 'https://picsum.photos/id/53/1600/900?grayscale',
    aspect: 'aspect-[16/9]'
  }];


  return (
    <div className="animate-in fade-in duration-700">
      <header className="relative h-[80vh] flex flex-col justify-center items-center overflow-hidden bg-black text-white rounded-b-[4rem] md:rounded-b-[6rem]">
        <div className="absolute inset-0 z-0 opacity-40 grayscale">
          <img alt="Hero" className="w-full h-full object-cover" src="https://picsum.photos/id/60/1920/1080?grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/80"></div>
        </div>
        <div className="relative z-10 max-w-5xl w-full text-center px-6">
          <h1 className="text-white text-6xl md:text-8xl leading-[0.9] mb-8 font-display tracking-tight">
            Antes de desenhar qualquer marca, estruturamos o território que ela vai ocupar.
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-2xl text-white/60 font-light font-sans leading-relaxed">
            Não nos limitamos a criar apenas uma logo, construímos posicionamento de marca estratégicas.     
          </p>
        </div>
      </header>

      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="space-y-40 md:space-y-64">
          {phases.map((phase, idx) =>
          <div key={phase.id} className={`grid md:grid-cols-2 gap-16 md:gap-32 items-center ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
              <div className={`${idx % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400 mb-6 block font-sans">Phase {phase.id}</span>
                <h2 className="text-5xl md:text-8xl mb-10 leading-[0.85] tracking-tighter">{phase.title}</h2>
                <p className="text-xl md:text-2xl text-neutral-500 font-light font-sans leading-relaxed max-w-md">
                  {phase.desc}
                </p>
              </div>
              <div className={`${idx % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                <div className={`rounded-3xl overflow-hidden ${phase.aspect} bg-neutral-100 shadow-2xl group`}>
                  <img alt={phase.title} className="w-full h-full object-cover image-bw group-hover:scale-105 transition-transform duration-1000" src={phase.image} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <ContactSection />
    </div>);

};

export default Methodology;