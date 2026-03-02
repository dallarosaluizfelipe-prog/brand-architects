
import React from 'react';
import ContactSection from '../components/ContactSection';

const Portfolio: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const projects = [
    { id: '1', title: 'Yerbal', category: 'Branding  -   Identidade Visual   -   Embalagem', image: '/lovable-uploads/yerbal-cover.gif' },
    { id: '2', title: 'Clave', category: 'Identidade  -   Tipografia', image: '/lovable-uploads/7eb64c92-69f8-4c75-8d27-c09dcc336dfb.png' },
    { id: '3', title: "Nuts O'Clock", category: 'Branding  -   Identidade Visual   -   Embalagem', image: '/lovable-uploads/nuts-oclock-cover.gif' },
    { id: '4', title: 'Lummina', category: 'Branding  -   Identidade Visual   -   Embalagem', image: '/lovable-uploads/lummina-cover.png' },
    { id: '5', title: 'Dalla', category: 'Branding  -   Identidade Visual', image: '/lovable-uploads/dalla-cover.gif' },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      <header className="pt-48 pb-20 px-6 max-w-7xl mx-auto">
        <h1 className="text-8xl md:text-[12rem] leading-[0.8] tracking-tighter font-display mb-10">Portfolio</h1>
        <p className="text-xl md:text-3xl text-neutral-400 max-w-2xl font-light leading-relaxed">
          Visual identities that transform purpose into performance. Pure design, strictly executed.
        </p>
      </header>

      <section className="pb-40 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="group cursor-pointer"
              onClick={() => onNavigate('casestudy')}
            >
              <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-8 shadow-lg">
                <img 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                  src={project.image} 
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
