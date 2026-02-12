
import React from 'react';
import ContactSection from '../components/ContactSection';

const Portfolio: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const projects = [
    { id: '1', title: 'Artisanal Spirits', category: 'Branding, Identity', image: 'https://picsum.photos/id/70/1200/800?grayscale', span: 'col-span-12', impact: '+700% Impact' },
    { id: '2', title: 'Conceptual Living', category: 'Digital & Strategy', image: 'https://picsum.photos/id/71/800/1000?grayscale', span: 'col-span-12 md:col-span-5' },
    { id: '3', title: 'Modernism Hub', category: 'Brand System', image: 'https://picsum.photos/id/72/1000/1000?grayscale', span: 'col-span-12 md:col-span-7' },
    { id: '4', title: 'The New Standard', category: 'Corporate Identity', image: 'https://picsum.photos/id/73/1200/700?grayscale', span: 'col-span-12 md:col-span-8' },
    { id: '5', title: 'Visual Legacies', category: 'Creative Direction', image: 'https://picsum.photos/id/74/800/800?grayscale', span: 'col-span-12 md:col-span-4' },
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24 md:gap-x-12">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className={`${project.span} group cursor-pointer flex flex-col`}
              onClick={() => onNavigate('casestudy')}
            >
              <div className="rounded-[2.5rem] overflow-hidden mb-10 border border-neutral-100 shadow-sm relative flex-grow bg-neutral-50">
                <img 
                  alt={project.title} 
                  className="w-full h-full object-cover image-bw group-hover:scale-105 transition-transform duration-1000" 
                  src={project.image} 
                />
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <h3 className="text-4xl md:text-5xl mb-4 font-display leading-none">{project.title}</h3>
                  <p className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold font-sans">{project.category}</p>
                </div>
                {project.impact && (
                  <div className="text-black font-bold text-4xl tabular-nums">{project.impact}</div>
                )}
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
