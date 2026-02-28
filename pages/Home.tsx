
import React from 'react';
import ContactSection from '../components/ContactSection';

const Home: React.FC<{onNavigate: (page: string) => void;}> = ({ onNavigate }) => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden bg-black rounded-b-[4rem] md:rounded-b-[6rem]">
        <video
          src="/lovable-uploads/abertura-site.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </section>

      {/* Global Excellence Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-7xl md:text-8xl leading-[0.9] tracking-tight mb-5">
            Poder criativo que
          </h2>
          <h2 className="text-8xl leading-[0.9] tracking-tight mb-10">
            impulsiona os negócios
          </h2>
          <p className="max-w-2xl text-lg md:text-xl text-neutral-500 font-light leading-relaxed mb-10">
            Identidades visuais pensadas para posicionar marcas no mercado.
          </p>
          <button onClick={() => onNavigate('methodology')} className="bg-black text-white px-12 py-5 rounded-full text-sm font-bold uppercase tracking-wider hover:scale-105 transition-all font-sans">
            Conheça o Dalla design brand
          </button>
        </div>
      </section>

      {/* Selected Portfolio */}
      <section className="py-16 px-6 bg-[#efeff0]" id="work">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl md:text-8xl mb-8 tracking-tighter">Conheça Nossos Cases</h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto font-light leading-relaxed md:text-xl">Marcas que carregam estratégia na essência, e validaram o nosso método.

            </p>
          </div>
          {/* Row 1 - 2 cases */}
          <div className="grid md:grid-cols-2 gap-12">
            <div className="group cursor-pointer" onClick={() => onNavigate('casestudy')}>
              <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-8 shadow-lg">
                <img alt="Yerbal" className="w-full h-full object-cover" src="/lovable-uploads/yerbal-cover.gif" />
              </div>
              <div>
                <h3 className="text-3xl md:text-5xl mb-4">Yerbal</h3>
                <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">Branding  -   Identidade Visual   -   Embalagem</p>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-8 shadow-lg">
                <img alt="Clave" className="w-full h-full object-cover" src="/lovable-uploads/7eb64c92-69f8-4c75-8d27-c09dcc336dfb.png" />
              </div>
              <div>
                <h3 className="text-3xl md:text-5xl mb-4">Clave</h3>
                <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">Identidade  -   Tipografia</p>
              </div>
            </div>
          </div>
          {/* Row 2 - 1 case full width */}
          <div className="mt-12">
            <div className="group cursor-pointer">
              <div className="rounded-3xl overflow-hidden aspect-[21/9] mb-8 shadow-lg">
                <img alt="Nuts O'Clock" className="w-full h-full object-cover" src="/lovable-uploads/nuts-oclock-cover.gif" />
              </div>
              <div>
                <h3 className="text-3xl md:text-5xl mb-4">Nuts O'Clock</h3>
                <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">Branding  -   Identidade Visual   -   Embalagem</p>
              </div>
            </div>
          </div>
          {/* Row 3 - 2 cases */}
          <div className="grid md:grid-cols-2 gap-12 mt-12">
            <div className="group cursor-pointer">
              <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-8 shadow-lg">
                <img alt="Lummina" className="w-full h-full object-cover" src="/lovable-uploads/lummina-cover.png" />
              </div>
              <div>
                <h3 className="text-3xl md:text-5xl mb-4">Lummina</h3>
                <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">Branding  -   Identidade Visual   -   Embalagem</p>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-8 shadow-lg">
                <img alt="Case 5" className="w-full h-full object-cover bg-neutral-200" src="" />
              </div>
              <div>
                <h3 className="text-3xl md:text-5xl mb-4">Case 5</h3>
                <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">Branding  -   Identidade Visual</p>
              </div>
            </div>
          </div>
          <div className="mt-16 text-center">
            <button onClick={() => onNavigate('portfolio')} className="border border-black px-16 py-6 rounded-full font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all font-sans text-sm">
              ver todo os cases    
            </button>
          </div>
        </div>
      </section>

      {/* Partners Logos */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
            <h2 className="text-6xl md:text-8xl leading-[0.85] tracking-tighter max-w-2xl">Nossos Parceiros </h2>
            <p className="text-neutral-400 max-w-xs md:text-right font-light text-lg">Parceiros estratégicos que colocam a marca em ação por meio do design. </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-16 items-center opacity-30 grayscale hover:opacity-100 transition-all duration-1000">
            <div className="flex justify-center"><img src="/lovable-uploads/partner-1.png" alt="Parceiro 1" className="h-24 md:h-32 object-contain" /></div>
            <div className="flex justify-center"><img src="/lovable-uploads/partner-2.png" alt="Parceiro 2" className="h-24 md:h-32 object-contain" /></div>
            <div className="flex justify-center"><img src="/lovable-uploads/partner-3.png" alt="Parceiro 3" className="h-24 md:h-32 object-contain" /></div>
            <div className="flex justify-center"><img src="/lovable-uploads/partner-4.png" alt="Parceiro 4" className="h-24 md:h-32 object-contain" /></div>
            <div className="flex justify-center"><img src="/lovable-uploads/partner-5.png" alt="Parceiro 5" className="h-24 md:h-32 object-contain" /></div>
            <div className="flex justify-center"><img src="/lovable-uploads/partner-6.png" alt="Parceiro 6" className="h-24 md:h-32 object-contain" /></div>
            <div className="flex justify-center"><img src="/lovable-uploads/partner-7.png" alt="Parceiro 7" className="h-24 md:h-32 object-contain" /></div>
            <div className="flex justify-center"><img src="/lovable-uploads/partner-8.png" alt="Parceiro 8" className="h-24 md:h-32 object-contain" /></div>
            <div className="flex justify-center"><img src="/lovable-uploads/partner-9.png" alt="Parceiro 9" className="h-24 md:h-32 object-contain" /></div>
            <div className="flex justify-center"><img src="/lovable-uploads/partner-10.png" alt="Parceiro 10" className="h-24 md:h-32 object-contain" /></div>
          </div>
        </div>
      </section>

      <ContactSection />
    </div>);};export default Home;