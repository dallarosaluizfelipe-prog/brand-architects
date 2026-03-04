import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ContactSection from '../components/ContactSection';
import { getSiteCases, type SiteCase } from '@/src/data/siteCases';
import { Seo } from '../components/Seo';

const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<SiteCase[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      const data = await getSiteCases();
      setProjects(data);
    };

    loadProjects();
  }, []);

  return (
    <>
      <Seo
        title="Portfolio de Cases - Estudio Dalla"
        description="Explore os estudos de caso do Estudio Dalla e veja como nossas identidades visuais geram resultados para marcas de luxo."
        keywords="portfolio branding luxo, estudos de caso branding"
      />
      <div className="animate-in fade-in duration-700">
        <header className="pt-36 md:pt-48 pb-14 md:pb-20 px-6 max-w-7xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-8xl leading-[0.82] tracking-tighter font-display mb-7 md:mb-10">Nossos Cases</h1>
          <p className="text-base md:text-xl text-neutral-400 max-w-2xl font-light leading-relaxed">
            Identidades visuais que transformam proposito em desempenho. Design puro, executado com rigor.
          </p>
        </header>

        <section className="pb-24 md:pb-40 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-12">
            {projects.map((project) => (
              <Link key={project.slug || project.title} className="group cursor-pointer" to={`/cases/${project.slug}`}>
                <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-6 md:mb-8 shadow-lg">
                  <img
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    src={project.cover_url}
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="text-2xl md:text-5xl mb-3 md:mb-4">{project.title}</h3>
                  <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">{project.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <ContactSection />
      </div>
    </>
  );
};

export default Portfolio;
