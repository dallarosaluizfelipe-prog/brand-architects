import React from 'react';
import ContactSection from '../components/ContactSection';
import { Seo } from '../components/Seo';

const About: React.FC = () => {
  return (
    <>
      <Seo
        title="Sobre o Estudio Dalla"
        description="Conheca a filosofia, valores e visao do Estudio Dalla, referencia em branding de luxo em Sao Paulo."
        keywords="sobre estudio de branding, branding SP, agencia branding luxo"
      />
      <div className="animate-in fade-in duration-700">
        <header className="pt-36 md:pt-48 pb-14 md:pb-20 px-6 max-w-7xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.5em] font-bold font-sans mb-6 md:mb-8 opacity-40">Nossa identidade</p>
          <h1 className="text-5xl sm:text-6xl md:text-[12rem] leading-[0.82] tracking-tighter font-display mb-7 md:mb-10">This is Dalla.</h1>
          <p className="text-base md:text-2xl text-neutral-500 max-w-3xl font-light leading-relaxed">
            Somos um estudio de design, estrategista e pensador, dedicado a busca da excelencia visual e da clareza estrategica.
          </p>
        </header>

        <section className="py-20 md:py-40 px-6 bg-neutral-50">
          <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-7">
              <h2 className="text-4xl md:text-7xl mb-8 md:mb-12 leading-[0.9] tracking-tighter">Criado com uma visao de precisao.</h2>
              <div className="space-y-6 md:space-y-8 text-base md:text-xl text-neutral-600 font-light leading-relaxed font-sans">
                <p>
                  O Estudio Dalla surgiu com o principio de que o branding nao se resume a estetica, mas sim a base arquitetonica de uma marca forte.
                </p>
                <p>
                  Acreditamos no poder da estrategia, nao como discurso abstrato, mas como direcao clara para cada decisao. Nosso processo e estruturado e nossos resultados geram posicionamento e valor real.
                </p>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="rounded-[2rem] md:rounded-[2.5rem] overflow-hidden aspect-[3/4] shadow-2xl">
                <video
                  className="w-full h-full object-cover grayscale"
                  src="/lovable-uploads/dalla-teaser.mov"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-40 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-14 md:mb-32">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold font-sans opacity-40">Nossos pilares</span>
            <h2 className="text-4xl sm:text-5xl md:text-8xl mt-6 md:mt-8 tracking-tighter">O que nos move.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10 md:gap-16">
            <div className="space-y-5 md:space-y-6">
              <div className="text-3xl md:text-4xl font-display">01. Estrategia</div>
              <p className="text-neutral-500 font-light font-sans leading-relaxed">Tudo comeca pela clareza de mercado. Analisamos cenario, concorrencia e negocio para transformar decisoes de design em vantagem competitiva.</p>
            </div>
            <div className="space-y-5 md:space-y-6">
              <div className="text-3xl md:text-4xl font-display">02. Identidade</div>
              <p className="text-neutral-500 font-light font-sans leading-relaxed">Construcao de sistemas visuais proprietarios, nao apenas estetica.</p>
            </div>
            <div className="space-y-5 md:space-y-6">
              <div className="text-3xl md:text-4xl font-display">03. Posicionamento</div>
              <p className="text-neutral-500 font-light font-sans leading-relaxed">Posicionamento e o territorio que a marca ocupa. Definimos espacos estrategicos que geram diferenciacao real e valor percebido.</p>
            </div>
          </div>
        </section>

        <section className="px-6 mb-24 md:mb-40">
          <div className="max-w-[1440px] mx-auto rounded-[2rem] md:rounded-[3rem] overflow-hidden aspect-[16/10] md:aspect-[21/9] shadow-2xl bg-neutral-100">
            <img alt="Wide studio view" className="w-full h-full object-cover" src="/lovable-uploads/logo-giratoria-2.gif" loading="lazy" />
          </div>
        </section>

        <ContactSection />
      </div>
    </>
  );
};

export default About;
