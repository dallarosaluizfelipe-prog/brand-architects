import React from 'react';
import ContactSection from '../components/ContactSection';
import lipePhoto from '@/assets/lipe-dalla-rosa.jpeg';
import { Seo } from '../components/Seo';
import { useSiteTexts } from '@/src/hooks/useSiteTexts';

const About: React.FC = () => {
  const t = useSiteTexts({
    about_header_badge: 'Nossa identidade',
    about_header_title: 'This is Dalla.',
    about_header_subtitle: 'Somos um estudio de design, estrategista e pensador, dedicado a busca da excelencia visual e da clareza estrategica.',
    about_vision_title: 'Criado com uma visao de precisao.',
    about_vision_p1: 'O Estudio Dalla surgiu com o principio de que o branding nao se resume a estetica, mas sim a base arquitetonica de uma marca forte.',
    about_vision_p2: 'Acreditamos no poder da estrategia, nao como discurso abstrato, mas como direcao clara para cada decisao. Nosso processo e estruturado e nossos resultados geram posicionamento e valor real.',
    about_pillars_badge: 'Nossos pilares',
    about_pillars_title: 'O que nos move.',
    about_pillar1_title: '01. Estrategia',
    about_pillar1_desc: 'Tudo comeca pela clareza de mercado. Analisamos cenario, concorrencia e negocio para transformar decisoes de design em vantagem competitiva.',
    about_pillar2_title: '02. Identidade',
    about_pillar2_desc: 'Construcao de sistemas visuais proprietarios, nao apenas estetica.',
    about_pillar3_title: '03. Posicionamento',
    about_pillar3_desc: 'Posicionamento e o territorio que a marca ocupa. Definimos espacos estrategicos que geram diferenciacao real e valor percebido.',
    about_seo_title: 'Sobre o Estudio Dalla',
    about_seo_description: 'Conheca a filosofia, valores e visao do Estudio Dalla, referencia em branding de luxo em Sao Paulo.',
    about_seo_keywords: 'sobre estudio de branding, branding SP, agencia branding luxo',
  });

  return (
    <>
      <Seo
        title={t.about_seo_title}
        description={t.about_seo_description}
        keywords={t.about_seo_keywords}
      />
      <div className="animate-in fade-in duration-700">
        <header className="pt-36 md:pt-48 pb-14 md:pb-20 px-6 max-w-7xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.5em] font-bold font-sans mb-6 md:mb-8 opacity-40">{t.about_header_badge}</p>
          <h1 className="text-5xl sm:text-6xl md:text-[12rem] leading-[0.82] tracking-tighter font-display mb-7 md:mb-10">{t.about_header_title}</h1>
          <div className="text-base md:text-2xl text-neutral-500 max-w-3xl font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: t.about_header_subtitle }} />
        </header>

        <section className="py-20 md:py-40 px-6 bg-neutral-50">
          <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-7">
              <h2 className="text-4xl md:text-7xl mb-8 md:mb-12 leading-[0.9] tracking-tighter">{t.about_vision_title}</h2>
              <div className="space-y-6 md:space-y-8 text-base md:text-xl text-neutral-600 font-light leading-relaxed font-sans">
                <div dangerouslySetInnerHTML={{ __html: t.about_vision_p1 }} />
                <div dangerouslySetInnerHTML={{ __html: t.about_vision_p2 }} />
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

        {/* Fundador Section */}
        <section className="bg-black text-white py-20 md:py-32 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 md:gap-20 items-center">
            <div className="w-full md:w-5/12 flex-shrink-0">
              <div className="rounded-[2rem] md:rounded-[2.5rem] overflow-hidden aspect-[3/4] shadow-2xl">
                <img
                  src={lipePhoto}
                  alt="Lipe Dalla-Rosa — Designer e Fundador do Studio Dalla"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="w-full md:w-7/12 space-y-6">
              <p className="text-[10px] uppercase tracking-[0.5em] font-bold font-sans opacity-40">Especialista em marcas</p>
              <h2 className="text-4xl md:text-7xl tracking-tighter leading-[0.9] font-display">Lipe Dalla-Rosa</h2>
              <p className="text-sm md:text-base uppercase tracking-[0.3em] font-sans opacity-50">Designer & Fundador</p>
              <div className="space-y-5 text-base md:text-lg text-neutral-400 font-light leading-relaxed font-sans">
                <p>Paranaense, pai e marido, sou apaixonado por design e por tudo que envolve construção de significado, estética e percepção. Acredito que as experiências que vivemos fora do trabalho moldam diretamente a forma como enxergamos o mundo e nos conectamos com as pessoas.</p>
                <p>Sou bacharel em Design e atuo como especialista em marca, desenvolvendo projetos que unem estratégia e direção estética para construir posicionamentos claros, consistentes e relevantes no mercado.</p>
                <p>Acredito que marcas fortes não são fruto do acaso, mas de decisões bem estruturadas, visão de longo prazo e intenção em cada detalhe, porque no fim, não se trata apenas de como uma marca parece, mas de como ela é percebida e valorizada.</p>
              </div>
            </div>
          </div>
        </section>


        <section className="py-20 md:py-40 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-14 md:mb-32">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold font-sans opacity-40">{t.about_pillars_badge}</span>
            <h2 className="text-4xl sm:text-5xl md:text-8xl mt-6 md:mt-8 tracking-tighter">{t.about_pillars_title}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10 md:gap-16">
            <div className="space-y-5 md:space-y-6">
              <div className="text-3xl md:text-4xl font-display">{t.about_pillar1_title}</div>
              <div className="text-neutral-500 font-light font-sans leading-relaxed" dangerouslySetInnerHTML={{ __html: t.about_pillar1_desc }} />
            </div>
            <div className="space-y-5 md:space-y-6">
              <div className="text-3xl md:text-4xl font-display">{t.about_pillar2_title}</div>
              <div className="text-neutral-500 font-light font-sans leading-relaxed" dangerouslySetInnerHTML={{ __html: t.about_pillar2_desc }} />
            </div>
            <div className="space-y-5 md:space-y-6">
              <div className="text-3xl md:text-4xl font-display">{t.about_pillar3_title}</div>
              <div className="text-neutral-500 font-light font-sans leading-relaxed" dangerouslySetInnerHTML={{ __html: t.about_pillar3_desc }} />
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
