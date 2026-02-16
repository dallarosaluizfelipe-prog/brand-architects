
import React from 'react';
import ContactSection from '../components/ContactSection';

const Home: React.FC<{onNavigate: (page: string) => void;}> = ({ onNavigate }) => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden bg-black text-white rounded-b-[4rem] md:rounded-b-[6rem]">
        <div className="absolute inset-0 z-0 opacity-40 grayscale">
          <img
            alt="Hero background"
            className="w-full h-full object-cover"
            src="https://picsum.photos/id/42/1920/1080?grayscale" />

          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        </div>
        <div className="relative z-10 max-w-6xl w-full text-center px-6">
          <h1 className="text-white text-7xl md:text-9xl leading-[0.9] mb-12 tracking-tight font-display">
            Poder criativo que impulsiona os negócios
          </h1>
          <div className="flex flex-col items-center gap-10">
            <p className="max-w-2xl mx-auto text-lg md:text-2xl text-white/70 font-light font-sans leading-relaxed">Identidades visuais pensadas para posicionar marcas no mercado.


            </p>
            <button onClick={() => onNavigate('methodology')}
            className="bg-white text-black px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 transition-all font-sans">

              Explore our methodology
            </button>
          </div>
        </div>
        <div className="absolute bottom-12 animate-bounce">
          <span className="material-symbols-outlined text-4xl opacity-50">expand_more</span>
        </div>
      </section>

      {/* Global Excellence Section */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-6xl md:text-7xl mb-8 leading-[0.9] tracking-tighter">Global Excellence in Design.</h2>
            <p className="text-xl md:text-2xl mb-12 text-neutral-500 font-light leading-relaxed">
              Our work is recognized for its clarity, precision, and impact. We transform business objectives into iconic visual legacies.
            </p>
            <button className="bg-black text-white px-10 py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity">
              Communicate with impact
            </button>
          </div>
          <div className="rounded-3xl overflow-hidden aspect-video bg-neutral-100 relative group cursor-pointer">
            <img
              alt="Studio work video placeholder"
              className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-110"
              src="https://picsum.photos/id/10/1200/800?grayscale" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-all">
                <span className="material-symbols-outlined text-white text-5xl">play_arrow</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Portfolio */}
      <section className="py-40 px-6 bg-neutral-50" id="work">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-8xl mb-8 tracking-tighter">Selected Portfolio.</h2>
            <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto font-light leading-relaxed">
              Visual identities that transform purpose into performance. Pure design, strictly executed.
            </p>
          </div>
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-8 group cursor-pointer" onClick={() => onNavigate('casestudy')}>
              <div className="rounded-3xl overflow-hidden aspect-[16/9] mb-8 relative shadow-lg">
                <img
                  alt="Artisanal Spirits"
                  className="w-full h-full object-cover image-bw"
                  src="https://picsum.photos/id/20/1200/800?grayscale" />

                <div className="absolute top-8 right-8 bg-black text-white px-5 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold font-sans">Featured Case</div>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
                <div>
                  <h3 className="text-4xl md:text-5xl mb-4">Artisanal Spirits — Rebranding</h3>
                  <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">Branding, Identity, Packaging</p>
                </div>
                <div className="text-black font-bold text-4xl tabular-nums mt-6 md:mt-0">+700% Impact</div>
              </div>
            </div>
            <div className="md:col-span-4 group cursor-pointer flex flex-col">
              <div className="rounded-3xl overflow-hidden aspect-square mb-8 shadow-lg flex-grow">
                <img
                  alt="Conceptual Living"
                  className="w-full h-full object-cover image-bw"
                  src="https://picsum.photos/id/30/800/800?grayscale" />

              </div>
              <div>
                <h3 className="text-3xl md:text-4xl mb-4">Conceptual Living</h3>
                <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">Digital Experience & Strategy</p>
              </div>
            </div>
          </div>
          <div className="mt-24 text-center">
            <button
              onClick={() => onNavigate('portfolio')}
              className="border border-black px-16 py-6 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all font-sans">

              View full portfolio
            </button>
          </div>
        </div>
      </section>

      {/* Partners Logos */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
            <h2 className="text-6xl md:text-8xl leading-[0.85] tracking-tighter max-w-2xl">World-class partners.</h2>
            <p className="text-neutral-400 max-w-xs md:text-right font-light text-lg">Strategic partners who put branding into action through integrated communication.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-16 items-center opacity-30 grayscale hover:opacity-100 transition-all duration-1000">
            <div className="flex justify-center text-4xl font-black tracking-tighter">VIGOR</div>
            <div className="flex justify-center text-4xl font-black">REDE</div>
            <div className="flex justify-center text-4xl font-bold">ULTRAGAZ</div>
            <div className="flex justify-center text-4xl font-serif italic">VELUM</div>
            <div className="flex justify-center text-4xl font-bold">FLASH</div>
            <div className="flex justify-center text-4xl font-black tracking-widest">MOBLY</div>
            <div className="flex justify-center text-4xl font-light tracking-[0.2em]">AREZZO</div>
            <div className="flex justify-center text-4xl font-black">ELETROBRAS</div>
            <div className="flex justify-center text-4xl font-mono">CODE</div>
            <div className="flex justify-center text-4xl font-extrabold uppercase">Sphere</div>
          </div>
        </div>
      </section>

      <ContactSection />
    </div>);

};

export default Home;