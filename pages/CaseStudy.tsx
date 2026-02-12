
import React from 'react';
import ContactSection from '../components/ContactSection';

const CaseStudy: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700">
      <header className="pt-48 pb-24 px-6 max-w-[1440px] mx-auto">
        <div className="mb-20">
          <p className="text-[10px] uppercase tracking-[0.5em] font-bold font-sans mb-8 opacity-40">Case Study 01</p>
          <h1 className="text-8xl md:text-[14rem] leading-[0.8] font-display tracking-tighter">
            Artisanal Spirits.
          </h1>
        </div>
        <div className="w-full aspect-[21/9] rounded-[3rem] overflow-hidden bg-neutral-100 shadow-2xl group">
          <img 
            alt="Artisanal Spirits Header" 
            className="w-full h-full object-cover image-bw group-hover:scale-105 transition-transform duration-1000" 
            src="https://picsum.photos/id/102/1920/1080?grayscale" 
          />
        </div>
      </header>

      <section className="py-40 px-6 max-w-[1440px] mx-auto">
        <div className="grid md:grid-cols-12 gap-16 md:gap-24 items-start mb-40">
          <div className="md:col-span-4">
            <h2 className="text-6xl md:text-8xl font-display tracking-tighter leading-[0.9]">The Brand</h2>
          </div>
          <div className="md:col-span-8">
            <p className="text-2xl md:text-4xl font-light text-neutral-500 leading-relaxed max-w-3xl">
              A heritage distillery reinvented for a modern audience. We stripped away the excess to reveal the soul of the craft. Clarity in identity, precision in execution.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="rounded-[2.5rem] overflow-hidden aspect-[4/5] bg-neutral-100 shadow-lg">
            <img alt="Brand detail 1" className="w-full h-full object-cover image-bw" src="https://picsum.photos/id/103/1200/1500?grayscale" />
          </div>
          <div className="rounded-[2.5rem] overflow-hidden aspect-[4/5] bg-neutral-100 shadow-lg">
            <img alt="Brand detail 2" className="w-full h-full object-cover image-bw" src="https://picsum.photos/id/104/1200/1500?grayscale" />
          </div>
        </div>
      </section>

      <section className="px-6 py-20 max-w-[1440px] mx-auto">
        <div className="rounded-[3rem] overflow-hidden aspect-video w-full relative shadow-2xl group cursor-pointer">
          <img alt="Cinematic wide" className="w-full h-full object-cover image-bw" src="https://picsum.photos/id/106/1920/1080?grayscale" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-all">
              <span className="material-symbols-outlined text-white text-6xl">play_arrow</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-40 px-6 max-w-[1440px] mx-auto">
        <div className="grid md:grid-cols-12 gap-16 md:gap-24 items-start mb-40">
          <div className="md:col-span-4">
            <h2 className="text-6xl md:text-8xl font-display tracking-tighter leading-[0.9]">The Digital Experience</h2>
          </div>
          <div className="md:col-span-8">
            <p className="text-2xl md:text-4xl font-light text-neutral-500 leading-relaxed max-w-3xl">
              Translating physical texture into digital interaction. A seamless interface that prioritizes visual storytelling and conversion through minimalist design patterns.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8 rounded-[2.5rem] overflow-hidden aspect-video bg-neutral-100 shadow-lg">
            <img alt="Digital 1" className="w-full h-full object-cover image-bw" src="https://picsum.photos/id/107/1200/800?grayscale" />
          </div>
          <div className="md:col-span-4 rounded-[2.5rem] overflow-hidden aspect-[9/16] bg-neutral-100 shadow-lg">
            <img alt="Digital 2" className="w-full h-full object-cover image-bw" src="https://picsum.photos/id/108/800/1422?grayscale" />
          </div>
        </div>
      </section>

      <section className="py-40 px-6 bg-neutral-50 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-24">
            <div className="animate-in slide-in-from-bottom duration-1000">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold font-sans opacity-40">Impact</span>
              <h3 className="text-8xl font-display mt-8 tracking-tighter">+700%</h3>
              <p className="text-sm uppercase tracking-[0.3em] mt-4 font-sans font-bold text-neutral-400">Brand Resonance</p>
            </div>
            <div className="animate-in slide-in-from-bottom duration-1000 delay-200">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold font-sans opacity-40">Market</span>
              <h3 className="text-8xl font-display mt-8 tracking-tighter">Global</h3>
              <p className="text-sm uppercase tracking-[0.3em] mt-4 font-sans font-bold text-neutral-400">Distribution Expansion</p>
            </div>
            <div className="animate-in slide-in-from-bottom duration-1000 delay-400">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold font-sans opacity-40">Recognition</span>
              <h3 className="text-8xl font-display mt-8 tracking-tighter">Gold</h3>
              <p className="text-sm uppercase tracking-[0.3em] mt-4 font-sans font-bold text-neutral-400">Design Excellence</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-64 px-6 text-center">
        <span className="text-[10px] uppercase tracking-[0.5em] font-bold font-sans mb-12 block opacity-40">Next Project</span>
        <a className="group inline-block" href="#">
          <h2 className="text-7xl md:text-[10vw] font-display leading-none hover:opacity-40 transition-opacity tracking-tighter">Conceptual Living.</h2>
        </a>
      </section>

      <ContactSection />
    </div>
  );
};

export default CaseStudy;
