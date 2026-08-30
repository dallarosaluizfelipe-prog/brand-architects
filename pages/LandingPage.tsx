import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import ContactSection from '../components/ContactSection';
import { Seo } from '../components/Seo';
import { getLpBySlug, SiteLp, LpPhase } from '@/src/data/siteLps';
import { useLocale } from '@/src/contexts/LocaleContext';
import { getSitePartners, SitePartner } from '@/src/data/sitePartners';
import { getFieldStyle } from '@/src/utils/textStyles';

const PHASE_DURATION = 4000;
const TICK = 50;

const LandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lp, setLp] = useState<SiteLp | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [partners, setPartners] = useState<SitePartner[]>([]);

  const [activePhase, setActivePhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return; }
    setLoading(true);
    getLpBySlug(slug, locale).then((data) => {
      if (!data) { setNotFound(true); } else { setLp(data); }
      setLoading(false);
    });
  }, [slug, locale]);

  useEffect(() => {
    if (lp?.partners_show) getSitePartners().then(setPartners);
  }, [lp?.partners_show]);

  const phases: LpPhase[] = lp?.method_phases ?? [];
  const institutionalDesktopVideo = lp?.institutional_video_url ?? '';
  const institutionalMobileVideo = lp?.institutional_video_mobile_url || institutionalDesktopVideo;
  const hasInstitutionalVideo = Boolean(institutionalDesktopVideo || institutionalMobileVideo);

  const handlePhaseClick = useCallback((idx: number) => {
    setActivePhase(idx);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (phases.length === 0) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK / PHASE_DURATION) * 100;
        if (next >= 100) {
          setActivePhase((p) => (p + 1) % phases.length);
          return 0;
        }
        return next;
      });
    }, TICK);
    return () => clearInterval(interval);
  }, [phases.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !lp) return <Navigate to="/" replace />;

  return (
    <>
      <Seo
        title={lp.meta_title}
        description={lp.meta_description}
        keywords={lp.meta_keywords}
      />

      <div className="animate-in fade-in duration-700">

        {/* ── HERO ── */}
        <section className="relative min-h-[100svh] md:min-h-screen overflow-hidden bg-white rounded-b-[2.5rem] md:rounded-b-[6rem]">
          <div className="relative z-10 flex flex-col items-center justify-between min-h-[100svh] md:min-h-screen text-center px-6 pt-28 md:pt-32 pb-28 md:pb-32">
            <div />
            <div className="flex flex-col items-center">
              <span
                className="uppercase tracking-[0.45em] text-black/40 mb-4 block font-sans text-[11px] md:text-sm"
                style={getFieldStyle(lp.text_styles, 'hero_badge')}
              >
                {lp.hero_badge}
              </span>
              <h1 className="text-black text-4xl sm:text-5xl md:text-8xl leading-[0.9] tracking-tight max-w-5xl font-display mb-6 md:mb-8"
                  style={{ whiteSpace: 'pre-line', ...getFieldStyle(lp.text_styles, 'hero_title') }}>
                {lp.hero_title}
              </h1>
              <p className="text-black/50 font-sans font-light text-base md:text-lg max-w-2xl mb-10 leading-relaxed"
                 style={{ whiteSpace: 'pre-line', ...getFieldStyle(lp.text_styles, 'hero_subtitle') }}>
                {lp.hero_subtitle}
              </p>
              <Link
                to={lp.hero_cta_url}
                className="inline-block border border-black/40 text-black px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all hover:bg-black hover:text-white font-sans"
                style={getFieldStyle(lp.text_styles, 'hero_cta_text')}
              >
                {lp.hero_cta_text}
              </Link>
            </div>
            <div />
          </div>
        </section>

        {/* ── VÍDEO INSTITUCIONAL ── */}
        {hasInstitutionalVideo && (
          <section className="px-6 py-8 md:py-12">
            <div className="max-w-6xl mx-auto rounded-[1.4rem] md:rounded-[2rem] overflow-hidden bg-black aspect-video">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              >
                {institutionalMobileVideo && (
                  <source media="(max-width: 767px)" src={institutionalMobileVideo} />
                )}
                {institutionalDesktopVideo && (
                  <source src={institutionalDesktopVideo} />
                )}
              </video>
            </div>
          </section>
        )}

        {/* ── QUEM SOMOS ── */}
        <section className="py-20 md:py-32 px-6 bg-[#efeff0] rounded-[2.5rem] md:rounded-[5rem]">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <span
                className="text-[11px] uppercase tracking-[0.4em] text-neutral-400 font-sans font-bold mb-6 block"
                style={getFieldStyle(lp.text_styles, 'about_badge')}
              >
                {lp.about_badge}
              </span>
              <h2
                className="text-3xl sm:text-4xl md:text-6xl leading-[0.9] tracking-tight font-display mb-6"
                style={getFieldStyle(lp.text_styles, 'about_title')}
              >
                {lp.about_title}
              </h2>
              {lp.about_paragraphs.map((p, i) => (
                <p key={i} className="text-neutral-500 font-sans font-light text-base md:text-lg leading-relaxed mb-4"
                   style={{ whiteSpace: 'pre-line', ...getFieldStyle(lp.text_styles, 'about_paragraphs') }}>
                  {p}
                </p>
              ))}
              {lp.about_cta_text && (
                <Link
                  to={lp.about_cta_url}
                  className="inline-block bg-black text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all hover:scale-105 font-sans mt-4"
                  style={getFieldStyle(lp.text_styles, 'about_cta_text')}
                >
                  {lp.about_cta_text}
                </Link>
              )}
            </div>
            <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-lg">
              <video
                src={lp.about_video_url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* ── MÉTODO ── */}
        {phases.length > 0 && (
          <section className="py-20 md:py-40 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 md:mb-24">
                <span
                  className="uppercase tracking-[0.45em] text-neutral-400 mb-6 block font-sans text-[11px] md:text-sm font-bold"
                  style={getFieldStyle(lp.text_styles, 'method_badge')}
                >
                  {lp.method_badge}
                </span>
                <h2
                  className="text-3xl sm:text-4xl md:text-7xl leading-[0.9] tracking-tight font-display mb-6"
                  style={getFieldStyle(lp.text_styles, 'method_title')}
                >
                  {lp.method_title}
                </h2>
                <p
                  className="text-neutral-500 font-sans font-light text-base md:text-xl max-w-2xl mx-auto"
                  style={getFieldStyle(lp.text_styles, 'method_subtitle')}
                >
                  {lp.method_subtitle}
                </p>
              </div>

              <div className="relative">
                {/* Progress bar */}
                <div className="hidden md:flex justify-between items-center mb-16 relative">
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-neutral-200" />
                  {phases.map((phase, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePhaseClick(idx)}
                      className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold font-sans transition-all duration-500 overflow-hidden ${
                        idx === activePhase ? 'bg-black text-white scale-110' : 'bg-neutral-200 text-neutral-500'
                      }`}
                    >
                      {idx === activePhase && (
                        <span
                          className="absolute inset-0 bg-neutral-600 origin-bottom transition-none"
                          style={{ transform: `scaleY(${progress / 100})` }}
                        />
                      )}
                      <span className="relative z-10">{phase.id}</span>
                    </button>
                  ))}
                </div>

                {/* Active phase content */}
                <div className="bg-[#efeff0] rounded-3xl p-8 md:p-16 transition-all duration-500 min-h-[280px]">
                  <div className="grid md:grid-cols-[120px_1fr] gap-6 md:gap-12 items-start">
                    <div>
                      <span className="text-4xl md:text-6xl font-display tracking-tight leading-none block"
                        style={{ ...getFieldStyle(lp.text_styles, 'method_phases'), ...getFieldStyle(lp.text_styles, 'method_phase_id') }}>
                        {phases[activePhase]?.id}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-400 font-bold font-sans mt-2 block"
                        style={{ ...getFieldStyle(lp.text_styles, 'method_phases'), ...getFieldStyle(lp.text_styles, 'method_phase_label') }}>
                        {phases[activePhase]?.label}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl md:text-5xl mb-4 md:mb-6 leading-[0.9] tracking-tighter font-display"
                        style={{ ...getFieldStyle(lp.text_styles, 'method_phases'), ...getFieldStyle(lp.text_styles, 'method_phase_title') }}>
                        {phases[activePhase]?.title}
                      </h3>
                      <p className="text-base md:text-xl text-neutral-500 font-light font-sans leading-relaxed max-w-2xl"
                        style={{ ...getFieldStyle(lp.text_styles, 'method_phases'), ...getFieldStyle(lp.text_styles, 'method_phase_desc') }}>
                        {phases[activePhase]?.desc}
                      </p>
                    </div>
                  </div>

                  {/* Mobile dots */}
                  <div className="flex md:hidden justify-center gap-2 mt-8">
                    {phases.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePhaseClick(idx)}
                        className={`relative w-2.5 h-2.5 rounded-full transition-all overflow-hidden ${
                          idx === activePhase ? 'bg-black scale-125' : 'bg-neutral-300'
                        }`}
                      >
                        {idx === activePhase && (
                          <span
                            className="absolute inset-0 bg-neutral-500 origin-left transition-none"
                            style={{ transform: `scaleX(${progress / 100})` }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {lp.method_cta_text && (
                  <div className="text-center mt-10">
                    <Link
                      to={lp.method_cta_url}
                      className="inline-block border border-black/40 text-black px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all hover:bg-black hover:text-white font-sans"
                      style={getFieldStyle(lp.text_styles, 'method_cta_text')}
                    >
                      {lp.method_cta_text}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── BENEFÍCIOS ── */}
        {lp.benefits_items.length > 0 && (
          <section className="py-20 md:py-32 px-6 bg-black text-white rounded-[2.5rem] md:rounded-[5rem]">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 md:mb-20">
                <span
                  className="uppercase tracking-[0.45em] text-white/40 mb-6 block font-sans text-[11px] md:text-sm font-bold"
                  style={getFieldStyle(lp.text_styles, 'benefits_badge')}
                >
                  {lp.benefits_badge}
                </span>
                <h2
                  className="text-3xl sm:text-4xl md:text-7xl leading-[0.9] tracking-tight font-display mb-6"
                  style={getFieldStyle(lp.text_styles, 'benefits_title')}
                >
                  {lp.benefits_title}
                </h2>
                <p
                  className="text-white/50 font-sans font-light text-base md:text-xl max-w-2xl mx-auto"
                  style={getFieldStyle(lp.text_styles, 'benefits_subtitle')}
                >
                  {lp.benefits_subtitle}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {lp.benefits_items.map((item, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-all">
                    <span className="material-symbols-outlined text-3xl mb-4 opacity-60">{item.icon}</span>
                    <h3 className="text-lg md:text-xl font-sans font-black mb-2"
                        style={{ ...getFieldStyle(lp.text_styles, 'benefits_items'), ...getFieldStyle(lp.text_styles, 'benefits_item_title') }}>{item.title}</h3>
                    <p className="text-white/50 font-sans font-light text-sm leading-relaxed"
                       style={{ ...getFieldStyle(lp.text_styles, 'benefits_items'), ...getFieldStyle(lp.text_styles, 'benefits_item_desc') }}>{item.desc}</p>
                  </div>
                ))}
              </div>

              {lp.benefits_cta_text && (
                <div className="text-center mt-12 md:mt-16">
                  <Link
                    to={lp.benefits_cta_url}
                    className="inline-block border border-white/40 text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all hover:bg-white hover:text-black font-sans"
                    style={getFieldStyle(lp.text_styles, 'benefits_cta_text')}
                  >
                    {lp.benefits_cta_text}
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── CASES ── */}
        {lp.cases_items.length > 0 && (
          <section className="py-20 md:py-32 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12 md:mb-16">
                <span
                  className="uppercase tracking-[0.45em] text-neutral-400 mb-6 block font-sans text-[11px] md:text-sm font-bold"
                  style={getFieldStyle(lp.text_styles, 'cases_badge')}
                >
                  {lp.cases_badge}
                </span>
                <h2
                  className="text-3xl sm:text-4xl md:text-7xl leading-[0.9] tracking-tight font-display mb-6"
                  style={getFieldStyle(lp.text_styles, 'cases_title')}
                >
                  {lp.cases_title}
                </h2>
                <p
                  className="text-neutral-500 font-sans font-light text-base md:text-xl max-w-2xl mx-auto"
                  style={getFieldStyle(lp.text_styles, 'cases_subtitle')}
                >
                  {lp.cases_subtitle}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-10 md:gap-12">
                {lp.cases_items.map((c, idx) => (
                  <Link key={idx} to={`/cases/${c.slug}`} className="group cursor-pointer">
                    <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-6 shadow-lg">
                      <img alt={`${c.title} — Identidade Visual`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={c.cover_url} loading="lazy" />
                    </div>
                    <h3 className="text-2xl md:text-4xl mb-2 font-display"
                        style={getFieldStyle(lp.text_styles, 'cases_item_title')}>{c.title}</h3>
                    <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans"
                       style={getFieldStyle(lp.text_styles, 'cases_item_category')}>{c.category}</p>
                  </Link>
                ))}
              </div>

              {lp.cases_cta_text && (
                <div className="text-center mt-12 md:mt-16">
                  <Link
                    to={lp.cases_cta_url}
                    className="inline-block border border-black px-10 md:px-16 py-4 md:py-6 rounded-full font-bold uppercase tracking-[0.18em] hover:bg-black hover:text-white transition-all font-sans text-xs md:text-sm"
                    style={getFieldStyle(lp.text_styles, 'cases_cta_text')}
                  >
                    {lp.cases_cta_text}
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── PARCEIROS ── */}
        {lp.partners_show && partners.length > 0 && (
          <section className="py-20 md:py-32 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12 md:mb-20">
                <span
                  className="uppercase tracking-[0.45em] text-neutral-400 mb-6 block font-sans text-[11px] md:text-sm font-bold"
                  style={getFieldStyle(lp.text_styles, 'partners_badge')}
                >
                  {lp.partners_badge}
                </span>
                <h2
                  className="text-3xl sm:text-4xl md:text-7xl leading-[0.9] tracking-tight font-display mb-6"
                  style={getFieldStyle(lp.text_styles, 'partners_title')}
                >
                  {lp.partners_title}
                </h2>
                <p className="text-neutral-500 font-sans font-light text-base md:text-xl max-w-xl mx-auto"
                   style={getFieldStyle(lp.text_styles, 'partners_subtitle')}>
                  {lp.partners_subtitle}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-16 items-center md:opacity-30 md:grayscale hover:opacity-100 transition-all duration-1000">
                {partners.map((p) => (
                  <a key={p.logo_url} href={p.link_url} target="_blank" rel="noreferrer" className="flex justify-center">
                    <img src={p.logo_url} alt={p.name} loading="lazy" className="h-16 md:h-32 object-contain" />
                  </a>
                ))}
              </div>
              {lp.partners_cta_text && (
                <div className="text-center mt-12">
                  <Link
                    to={lp.partners_cta_url}
                    className="inline-block border border-black/40 text-black px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all hover:bg-black hover:text-white font-sans"
                    style={getFieldStyle(lp.text_styles, 'partners_cta_text')}
                  >
                    {lp.partners_cta_text}
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── FORMULÁRIO DE CONTATO ── */}
        <ContactSection />
      </div>
    </>
  );
};

export default LandingPage;
