import React, { useEffect, useState } from 'react';
import ContactSection from '../components/ContactSection';
import { getSiteCases, type SiteCase } from '@/src/data/siteCases';

const Portfolio: React.FC<{ onNavigate: (page: string) => void; }> = ({ onNavigate }) => {
  const [projects, setProjects] = useState<SiteCase[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      const data = await getSiteCases();
      setProjects(data);
    };

    loadProjects();
  }, []);

  return (
    <div className="animate-in fade-in duration-700">
      <header className="pt-48 pb-20 px-6 max-w-7xl mx-auto">
        <h1 className="text-8xl leading-[0.8] tracking-tighter font-display mb-10 md:text-8xl">Nossos Cases</h1>
        <p className="text-xl text-neutral-400 max-w-2xl font-light leading-relaxed md:text-xl">
          Identidades visuais que transformam proposito em desempenho. Design puro, executado com rigor.
        </p>
      </header>

      <section className="pb-40 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group cursor-pointer"
              onClick={() => onNavigate('casestudy')}
            >
              <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-8 shadow-lg">
                <img
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  src={project.cover_url}
                />
              </div>
              <div>
                <h3 className="text-3xl md:text-5xl mb-4">{project.title}</h3>
                <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">{project.category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ContactSection />
    </div>
  );
};

export default Portfolio;
