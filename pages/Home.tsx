import React from 'react';
import { Link } from 'react-router-dom';
import ContactSection from '../components/ContactSection';
import { Seo } from '../components/Seo';

const Home: React.FC = () => {
  return (
    <>
      <Seo
        title="Estudio de Branding de Luxo em Sao Paulo"
        description="Poder criativo que impulsiona negocios de marcas premium. Identidades visuais estrategicamente desenvolvidas para o mercado de luxo em Sao Paulo."
        keywords="branding luxo, agencia de branding SP, identidade visual premium"
      />
      <div className="animate-in fade-in duration-700">
        <section className="relative min-h-[100svh] md:min-h-screen overflow-hidden bg-black rounded-b-[2.5rem] md:rounded-b-[6rem]">
          <video
            src="/lovable-uploads/abertura-site.mp4"
            autoPlay
            loop
            muted
            playsInline
            poster="/lovable-uploads/2fdb741b-7706-4fa8-b5f2-dda301d0572d.png"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/70"></div>
          <div className="relative z-10 min-h-[100svh] md:min-h-screen px-6 pb-14 pt-32 md:pt-44 flex items-end">
            <div className="max-w-4xl">
              <span className="inline-block rounded-full border border-white/30 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/80 font-sans mb-6">
                branding e posicionamento
              </span>
              <h1 className="text-white text-[clamp(2.2rem,10vw,5.5rem)] leading-[0.9] tracking-tight mb-5">
                Marcas de alto valor com estrategia que vira percepcao.
              </h1>
              <p className="max-w-xl text-white/80 text-base md:text-xl leading-relaxed font-sans mb-8">
                O Studio Dalla une direcao estrategica e identidade visual para empresas que precisam de autoridade imediata.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/cases" className="bg-white text-black px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all active:scale-95">
                  Ver cases
                </Link>
                <Link to="/contato" className="border border-white/40 text-white px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all active:scale-95">
                  Falar com o studio
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-4xl sm:text-5xl md:text-8xl leading-[0.9] tracking-tight mb-2 md:mb-5">Poder criativo que</h2>
            <h2 className="text-5xl sm:text-6xl md:text-8xl leading-[0.9] tracking-tight mb-8 md:mb-10">impulsiona os negocios</h2>
            <p className="max-w-2xl text-base md:text-xl text-neutral-500 font-light leading-relaxed mb-8 md:mb-10">
              Identidades visuais pensadas para posicionar marcas no mercado.
            </p>
            <Link to="/metodologia" className="bg-black text-white px-9 md:px-12 py-4 md:py-5 rounded-full text-xs md:text-sm font-bold uppercase tracking-[0.16em] hover:scale-105 transition-all font-sans">
              Conheca o Dalla design brand
            </Link>
          </div>
        </section>

        <section className="py-14 md:py-16 px-6 bg-[#efeff0]" id="work">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-8xl mb-6 md:mb-8 tracking-tighter">Conheca Nossos Cases</h2>
              <p className="text-base md:text-xl text-neutral-400 max-w-3xl mx-auto font-light leading-relaxed">
                Marcas que carregam estrategia na essencia, e validaram o nosso metodo.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 md:gap-12">
              <Link to="/cases/yerbal" className="group cursor-pointer">
                <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-8 shadow-lg">
                  <img alt="Yerbal" className="w-full h-full object-cover" src="/lovable-uploads/yerbal-cover.gif" loading="lazy" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-5xl mb-3 md:mb-4">Yerbal</h3>
                  <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">Branding  -   Identidade Visual   -   Embalagem</p>
                </div>
              </Link>
              <Link to="/cases/clave" className="group cursor-pointer">
                <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-8 shadow-lg">
                  <img alt="Clave" className="w-full h-full object-cover" src="/lovable-uploads/7eb64c92-69f8-4c75-8d27-c09dcc336dfb.png" loading="lazy" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-5xl mb-3 md:mb-4">Clave</h3>
                  <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">Identidade  -   Tipografia</p>
                </div>
              </Link>
            </div>

            <div className="mt-10 md:mt-12">
              <Link to="/cases/nuts-oclock" className="group cursor-pointer">
                <div className="rounded-3xl overflow-hidden aspect-[21/9] mb-8 shadow-lg">
                  <img alt="Nuts O'Clock" className="w-full h-full object-cover" src="/lovable-uploads/nuts-oclock-cover.gif" loading="lazy" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-5xl mb-3 md:mb-4">Nuts O'Clock</h3>
                  <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">Branding  -   Identidade Visual   -   Embalagem</p>
                </div>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-10 md:gap-12 mt-10 md:mt-12">
              <Link to="/cases/lummina" className="group cursor-pointer">
                <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-8 shadow-lg">
                  <img alt="Lummina" className="w-full h-full object-cover" src="/lovable-uploads/lummina-cover.png" loading="lazy" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-5xl mb-3 md:mb-4">Lummina</h3>
                  <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">Branding  -   Identidade Visual   -   Embalagem</p>
                </div>
              </Link>
              <Link to="/cases/dalla" className="group cursor-pointer">
                <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-8 shadow-lg">
                  <img alt="Dalla" className="w-full h-full object-cover" src="/lovable-uploads/dalla-cover.gif" loading="lazy" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-5xl mb-3 md:mb-4">Dalla</h3>
                  <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">Branding  -   Identidade Visual</p>
                </div>
              </Link>
            </div>

            <div className="mt-12 md:mt-16 text-center">
              <Link to="/cases" className="inline-block border border-black px-10 md:px-16 py-4 md:py-6 rounded-full font-bold uppercase tracking-[0.18em] hover:bg-black hover:text-white transition-all font-sans text-xs md:text-sm">
                ver todo os cases
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-40 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-24 gap-8 md:gap-10">
              <h2 className="text-4xl sm:text-5xl md:text-8xl leading-[0.85] tracking-tighter max-w-2xl">Nossos Parceiros</h2>
              <p className="text-neutral-400 max-w-xs md:text-right font-light text-base md:text-lg">Parceiros estrategicos que colocam a marca em acao por meio do design.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-16 items-center transition-all duration-1000 md:opacity-30 md:grayscale hover:opacity-100">
              <div className="flex justify-center"><img src="/lovable-uploads/partner-1.png" alt="Parceiro 1" loading="lazy" className="h-16 md:h-32 object-contain" /></div>
              <div className="flex justify-center"><img src="/lovable-uploads/partner-2.png" alt="Parceiro 2" loading="lazy" className="h-16 md:h-32 object-contain" /></div>
              <div className="flex justify-center"><img src="/lovable-uploads/partner-3.png" alt="Parceiro 3" loading="lazy" className="h-16 md:h-32 object-contain" /></div>
              <div className="flex justify-center"><img src="/lovable-uploads/partner-4.png" alt="Parceiro 4" loading="lazy" className="h-16 md:h-32 object-contain" /></div>
              <div className="flex justify-center"><img src="/lovable-uploads/partner-5.png" alt="Parceiro 5" loading="lazy" className="h-16 md:h-32 object-contain" /></div>
              <div className="flex justify-center"><img src="/lovable-uploads/partner-6.png" alt="Parceiro 6" loading="lazy" className="h-16 md:h-32 object-contain" /></div>
              <div className="flex justify-center"><img src="/lovable-uploads/partner-7.png" alt="Parceiro 7" loading="lazy" className="h-16 md:h-32 object-contain" /></div>
              <div className="flex justify-center"><img src="/lovable-uploads/partner-8.png" alt="Parceiro 8" loading="lazy" className="h-16 md:h-32 object-contain" /></div>
              <div className="flex justify-center"><img src="/lovable-uploads/partner-9.png" alt="Parceiro 9" loading="lazy" className="h-16 md:h-32 object-contain" /></div>
              <div className="flex justify-center"><img src="/lovable-uploads/partner-10.png" alt="Parceiro 10" loading="lazy" className="h-16 md:h-32 object-contain" /></div>
            </div>
          </div>
        </section>

        <ContactSection />
      </div>
    </>
  );
};

export default Home;
