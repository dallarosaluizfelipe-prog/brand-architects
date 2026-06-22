import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ContactSection from '../components/ContactSection';
import { Seo } from '../components/Seo';
import { supabase } from '@/src/integrations/supabase/client';
import { useSiteTexts } from '@/src/hooks/useSiteTexts';
import { useSiteTextStyles } from '@/src/hooks/useSiteTextStyles';
import { getSiteCases, SiteCase } from '@/src/data/siteCases';
import { getSitePartners, SitePartner } from '@/src/data/sitePartners';
import { useLocale } from '@/src/contexts/LocaleContext';

const FALLBACK_DESKTOP = '/lovable-uploads/abertura-site.mp4';
const FALLBACK_MOBILE = '/lovable-uploads/abertura-site-mobile.mp4';
const FALLBACK_POSTER = '/lovable-uploads/2fdb741b-7706-4fa8-b5f2-dda301d0572d.png';

const Home: React.FC = () => {
  const { locale } = useLocale();
  const [heroDesktop, setHeroDesktop] = useState(FALLBACK_DESKTOP);
  const [heroMobile, setHeroMobile] = useState(FALLBACK_MOBILE);
  const [heroPoster, setHeroPoster] = useState('');
  const [homeCases, setHomeCases] = useState<SiteCase[]>([]);
  const [partners, setPartners] = useState<SitePartner[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const t = useSiteTexts({
    home_hero_badge: 'branding e posicionamento',
    home_hero_title: 'Marcas de alto valor com estrategia que vira percepcao.',
    home_hero_subtitle: 'O Studio Dalla une direcao estrategica e identidade visual para empresas que precisam de autoridade imediata.',
    home_hero_cta_primary: 'Ver cases',
    home_hero_cta_secondary: 'Falar com o estúdio',
    home_cases_title: 'Conheca Nossos Cases',
    home_cases_subtitle: 'Marcas que carregam estrategia na essencia, e validaram o nosso metodo.',
    home_cases_cta: 'ver todo os cases',
    home_case_card_title: '',
    home_case_card_category: '',
    home_partners_title: 'Nossos Parceiros',
    home_partners_subtitle: 'Parceiros estrategicos que colocam a marca em acao por meio do design.',
    home_seo_title: 'Estudio de Branding de Luxo em Sao Paulo',
    home_seo_description: 'Poder criativo que impulsiona negocios de marcas premium. Identidades visuais estrategicamente desenvolvidas para o mercado de luxo em Sao Paulo.',
    home_seo_keywords: 'branding luxo, agencia de branding SP, identidade visual premium',
    home_og_image: '',
  }, locale);

  const s = useSiteTextStyles(
    ['home_hero_badge','home_hero_title','home_hero_subtitle','home_hero_cta_primary','home_hero_cta_secondary','home_cases_title','home_cases_subtitle','home_cases_cta','home_case_card_title','home_case_card_category','home_partners_title','home_partners_subtitle'],
    locale,
  );

  useEffect(() => {
    supabase
      .from('site_content')
      .select('section_key, video_url, image_url')
      .in('section_key', ['hero_video_desktop', 'hero_video_mobile'])
      .then(({ data }) => {
        if (!data) return;
        const desktop = data.find((r) => r.section_key === 'hero_video_desktop');
        const mobile = data.find((r) => r.section_key === 'hero_video_mobile');
        if (desktop?.video_url) setHeroDesktop(desktop.video_url);
        setHeroPoster(desktop?.image_url || FALLBACK_POSTER);
        if (mobile?.video_url) setHeroMobile(mobile.video_url);

        // Reload <video> with new sources
        videoRef.current?.load();
      });
  }, []);

  useEffect(() => {
    getSiteCases(5, locale).then(setHomeCases);
    getSitePartners().then(setPartners);
  }, [locale]);
  return (
    <>
      <Seo
        title={t.home_seo_title}
        description={t.home_seo_description}
        keywords={t.home_seo_keywords}
        image={t.home_og_image || undefined}
      />
      <div className="animate-in fade-in duration-700">
        <section className="relative min-h-[100svh] md:min-h-screen overflow-hidden bg-black rounded-b-[2.5rem] md:rounded-b-[6rem]">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={heroPoster || undefined}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={heroMobile} media="(max-width: 768px)" type="video/mp4" />
            <source src={heroDesktop} media="(min-width: 769px)" type="video/mp4" />
          </video>
        </section>

        <section className="py-14 md:py-24 px-6 max-w-4xl mx-auto">
          <span className="inline-block text-[11px] uppercase tracking-[0.24em] text-neutral-500 font-sans mb-6" style={s.home_hero_badge}>
            {t.home_hero_badge}
          </span>
          <h1 className="text-[clamp(2.5rem,10vw,5.5rem)] leading-[0.9] tracking-tight mb-5" style={s.home_hero_title}>
            {t.home_hero_title}
          </h1>
          <div className="max-w-xl text-neutral-500 text-base md:text-xl leading-relaxed font-sans mb-8" style={s.home_hero_subtitle} dangerouslySetInnerHTML={{ __html: t.home_hero_subtitle }} />
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/cases" style={s.home_hero_cta_primary} className="bg-black text-white px-10 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all active:scale-95 text-center flex-1 sm:flex-none sm:min-w-[200px]">
              {t.home_hero_cta_primary}
            </Link>
            <Link to="/contato" style={s.home_hero_cta_secondary} className="border border-black/40 text-black px-10 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all active:scale-95 text-center flex-1 sm:flex-none sm:min-w-[200px]">
              {t.home_hero_cta_secondary}
            </Link>
          </div>
        </section>

        <section className="py-14 md:py-16 px-6 bg-[#efeff0]" id="work">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-5xl sm:text-5xl md:text-8xl mb-6 md:mb-8 tracking-tighter" style={s.home_cases_title}>{t.home_cases_title}</h2>
              <div className="text-base md:text-xl text-neutral-400 max-w-3xl mx-auto font-light leading-relaxed" style={s.home_cases_subtitle} dangerouslySetInnerHTML={{ __html: t.home_cases_subtitle }} />
            </div>

            <div className="grid md:grid-cols-2 gap-10 md:gap-12">
              {homeCases.slice(0, 2).map((c) => (
                <Link key={c.slug} to={`/cases/${c.slug}`} className="group cursor-pointer">
                  <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-8 shadow-lg">
                    <img alt={c.title} className="w-full h-full object-cover" src={c.cover_url} loading="lazy" />
                  </div>
                  <div>
                    <h3 style={s.home_case_card_title} className="text-2xl md:text-5xl mb-3 md:mb-4">{c.title}</h3>
                    <p style={s.home_case_card_category} className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">{c.category}</p>
                  </div>
                </Link>
              ))}
            </div>

            {homeCases[2] && (
              <div className="mt-10 md:mt-12">
                <Link to={`/cases/${homeCases[2].slug}`} className="group cursor-pointer">
                  <div className="rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[21/9] mb-8 shadow-lg">
                    <img alt={homeCases[2].title} className="w-full h-full object-cover" src={homeCases[2].cover_url} loading="lazy" />
                  </div>
                  <div>
                    <h3 style={s.home_case_card_title} className="text-2xl md:text-5xl mb-3 md:mb-4">{homeCases[2].title}</h3>
                    <p style={s.home_case_card_category} className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">{homeCases[2].category}</p>
                  </div>
                </Link>
              </div>
            )}

            {homeCases.length > 3 && (
              <div className="grid md:grid-cols-2 gap-10 md:gap-12 mt-10 md:mt-12">
                {homeCases.slice(3, 5).map((c) => (
                  <Link key={c.slug} to={`/cases/${c.slug}`} className="group cursor-pointer">
                    <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-8 shadow-lg">
                      <img alt={c.title} className="w-full h-full object-cover" src={c.cover_url} loading="lazy" />
                    </div>
                    <div>
                      <h3 style={s.home_case_card_title} className="text-2xl md:text-5xl mb-3 md:mb-4">{c.title}</h3>
                      <p style={s.home_case_card_category} className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">{c.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-12 md:mt-16 text-center">
              <Link to="/cases" style={s.home_cases_cta} className="inline-block border border-black px-10 md:px-16 py-4 md:py-6 rounded-full font-bold uppercase tracking-[0.18em] hover:bg-black hover:text-white transition-all font-sans text-xs md:text-sm">
                {t.home_cases_cta}
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-40 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-24 gap-8 md:gap-10">
              <h2 className="text-5xl sm:text-5xl md:text-8xl leading-[0.85] tracking-tighter max-w-2xl" style={s.home_partners_title}>{t.home_partners_title}</h2>
              <div className="text-neutral-400 max-w-xs md:text-right font-light text-base md:text-lg" style={s.home_partners_subtitle} dangerouslySetInnerHTML={{ __html: t.home_partners_subtitle }} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-16 items-center transition-all duration-1000 md:opacity-30 md:grayscale hover:opacity-100">
              {partners.map((p) => (
                <Link key={p.logo_url} to={p.link_url} className="flex justify-center">
                  <img src={p.logo_url} alt={p.name} loading="lazy" className="h-28 md:h-32 object-contain" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <ContactSection />
      </div>
    </>
  );
};

export default Home;
