import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ContactSection from '../components/ContactSection';
import { getSiteCases, type SiteCase } from '@/src/data/siteCases';
import { Seo } from '../components/Seo';
import { useSiteTexts } from '@/src/hooks/useSiteTexts';
import { useSiteTextStyles } from '@/src/hooks/useSiteTextStyles';
import { getFieldStyle } from '@/src/utils/textStyles';
import { useLocale } from '@/src/contexts/LocaleContext';

const Portfolio: React.FC = () => {
  const { locale } = useLocale();
  const [projects, setProjects] = useState<SiteCase[]>([]);

  const t = useSiteTexts({
    portfolio_header_title: 'Nossos Cases',
    portfolio_header_subtitle: 'Identidades visuais que transformam proposito em desempenho. Design puro, executado com rigor.',
    portfolio_seo_title: 'Portfolio de Cases - Estudio Dalla',
    portfolio_seo_description: 'Explore os estudos de caso do Estudio Dalla e veja como nossas identidades visuais geram resultados para marcas de luxo.',
    portfolio_seo_keywords: 'portfolio branding luxo, estudos de caso branding',
    portfolio_og_image: '',
  }, locale);

  const s = useSiteTextStyles(['portfolio_header_title','portfolio_header_subtitle'], locale);

  useEffect(() => {
    const loadProjects = async () => {
      const data = await getSiteCases(undefined, locale);
      setProjects(data);
    };

    loadProjects();
  }, []);

  return (
    <>
      <Seo
        title={t.portfolio_seo_title}
        description={t.portfolio_seo_description}
        keywords={t.portfolio_seo_keywords}
        image={t.portfolio_og_image || undefined}
      />
      <div className="animate-in fade-in duration-700">
        <header className="pt-24 md:pt-48 pb-14 md:pb-20 px-6 max-w-7xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-8xl leading-[0.82] tracking-tighter font-display mb-7 md:mb-10" style={s.portfolio_header_title}>{t.portfolio_header_title}</h1>
          <div className="text-base md:text-xl text-neutral-400 max-w-2xl font-light leading-relaxed" style={s.portfolio_header_subtitle} dangerouslySetInnerHTML={{ __html: t.portfolio_header_subtitle }} />
        </header>

        <section className="pb-24 md:pb-40 px-6 max-w-7xl mx-auto">
          <h2 className="sr-only">Portfólio de cases de branding</h2>
          <div className="grid md:grid-cols-2 gap-10 md:gap-12">
            {projects.map((project) => (
              <Link key={project.slug || project.title} className="group cursor-pointer" to={`/cases/${project.slug}`}>
                <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-6 md:mb-8 shadow-lg">
                  <img
                    alt={`Case ${project.title} — ${project.category}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    src={project.cover_url}
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 style={getFieldStyle(project.text_styles, 'title')} className="text-3xl md:text-5xl mb-3 md:mb-4">{project.title}</h3>
                  <p style={getFieldStyle(project.text_styles, 'category')} className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">{project.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: t.portfolio_seo_title,
              description: t.portfolio_seo_description,
              url: typeof window !== 'undefined' ? window.location.href : 'https://estudiodalla.com/cases',
              hasPart: projects.map((p) => ({
                '@type': 'CreativeWork',
                name: p.title,
                url: `https://estudiodalla.com/cases/${p.slug}`,
                image: p.cover_url,
                genre: p.category,
              })),
            }),
          }}
        />

        <ContactSection />
      </div>
    </>
  );
};

export default Portfolio;
