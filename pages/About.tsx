
import React from 'react';
import ContactSection from '../components/ContactSection';

const About: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <header className="pt-48 pb-20 px-6 max-w-7xl mx-auto">
        <p className="text-[10px] uppercase tracking-[0.5em] font-bold font-sans mb-8 opacity-40">Nossa identidade </p>
        <h1 className="text-8xl md:text-[12rem] leading-[0.8] tracking-tighter font-display mb-10">This is Dalla</h1>
        <p className="text-xl text-neutral-400 max-w-3xl font-light leading-relaxed md:text-2xl">
          Somos um estúdio de design, estrategista e pensador, dedicado à busca da excelência visual e da clareza estratégica.
        </p>
      </header>

      {/* Narrative Section */}
      <section className="py-40 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-16">
          <div className="md:col-span-7">
            <h2 className="text-5xl md:text-7xl mb-12 leading-[0.9] tracking-tighter"> Criado com uma visão de precisão.</h2>
            <div className="space-y-8 text-xl text-neutral-600 font-light leading-relaxed font-sans">
              <p className="text-xl font-light">
                 O Estúdio Dalla surgiu com o princípio de que o branding não se resume à estética, mas sim à base arquitetônica de uma marca forte.
              </p>
              <p className="text-xl font-light">
                Acreditamos no poder da estratégia, não como discurso abstrato, mas como direção clara e intencional para cada decisão. Nosso processo é estruturado, nossa construção é fundamentada e nossos resultados geram posicionamento, valor e diferenciação real.
              </p>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="rounded-[2.5rem] overflow-hidden aspect-[3/4] shadow-2xl">
              <img
                alt="Studio Atmosphere"
                className="w-full h-full object-cover grayscale"
                src="https://picsum.photos/id/111/800/1000?grayscale" />

            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-32">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold font-sans opacity-40">Nossos pilares  </span>
          <h2 className="text-6xl md:text-8xl mt-8 tracking-tighter">O que nos move.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <div className="text-4xl font-display italic">01. Precision</div>
            <p className="text-neutral-500 font-light font-sans leading-relaxed">Every pixel has a purpose. We don't guess; we calculate. Our design systems are built with mathematical rigor.</p>
          </div>
          <div className="space-y-6">
            <div className="text-4xl font-display italic">02. Timelessness</div>
            <p className="text-neutral-500 font-light font-sans leading-relaxed">Trends fade, but legacy remains. We build identities meant to resonate for decades, not seasons.</p>
          </div>
          <div className="space-y-6">
            <div className="text-4xl font-display italic">03. Performance</div>
            <p className="text-neutral-500 font-light font-sans leading-relaxed">Design is a business tool. Our success is measured by the growth and clarity we provide to our clients.</p>
          </div>
        </div>
      </section>

      {/* Wide Image */}
      <section className="px-6 mb-40">
        <div className="max-w-[1440px] mx-auto rounded-[3rem] overflow-hidden aspect-[21/9] shadow-2xl bg-neutral-100">
          <img
            alt="Wide studio view"
            className="w-full h-full object-cover grayscale opacity-80"
            src="https://picsum.photos/id/115/1920/800?grayscale" />

        </div>
      </section>

      <ContactSection />
    </div>);

};

export default About;