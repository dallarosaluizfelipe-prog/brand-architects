import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ContactSection from "../components/ContactSection";
import { Seo } from '../components/Seo';
import { getSiteCaseBySlug, type SiteCase } from "@/src/data/siteCases";

const formatDate = (value: string): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(date);
};

const CaseDetails: React.FC = () => {
  const { slug = "" } = useParams();
  const [project, setProject] = useState<SiteCase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCase = async () => {
      setLoading(true);
      const item = await getSiteCaseBySlug(slug);
      setProject(item);
      setLoading(false);
    };

    loadCase();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <p className="text-neutral-400 font-sans">Carregando case...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6">
        <h1 className="text-4xl font-display">Case nao encontrado</h1>
        <Link to="/cases" className="border border-black px-8 py-3 rounded-full font-sans text-sm uppercase tracking-wider">
          Voltar para cases
        </Link>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={project?.meta_title || project?.title}
        description={project?.meta_description || project?.description || undefined}
        keywords={project?.meta_keywords || project?.category}
        url={window.location.href}
        image={project?.cover_url}
      />
      <div className="animate-in fade-in duration-700">
        <header className="pt-32 md:pt-40 pb-12 md:pb-16 px-6 max-w-7xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold font-sans mb-5 md:mb-6 opacity-50">{project.category}</p>
          <h1 className="text-4xl sm:text-5xl md:text-8xl tracking-tighter leading-[0.9] mb-7 md:mb-8">{project.title}</h1>
          <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-neutral-500 font-sans">
            {project.author && <span>Autor: {project.author}</span>}
            {project.case_date && <span>Data: {formatDate(project.case_date)}</span>}
            {project.external_url && (
              <a href={project.external_url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                Ver referencia externa
              </a>
            )}
          </div>
        </header>

        <section className="px-6 pb-16 md:pb-20 max-w-7xl mx-auto">
          <div className="rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[16/9] bg-neutral-100 shadow-lg mb-10 md:mb-12">
            <img src={project.cover_url} alt={project.title} className="w-full h-full object-cover" />
          </div>

          {project.description && (
            <p className="text-base md:text-2xl text-neutral-600 leading-relaxed max-w-4xl mb-12 md:mb-16">{project.description}</p>
          )}

          {project.gallery_urls.length > 0 && (
            <div className="flex flex-col gap-5 md:gap-8">
              {project.gallery_urls.map((url, index) => (
                <div key={`${url}-${index}`} className="rounded-3xl overflow-hidden bg-neutral-100 shadow-sm">
                  <img src={url} alt={`${project.title} ${index + 1}`} className="w-full object-contain" loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="py-14 md:py-20 px-6 bg-neutral-50 border-y border-neutral-200">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-6xl tracking-tight mb-7 md:mb-8">Vamos criar o proximo case da sua marca?</h2>
            <a
              href={project.cta_url || "https://estudiodalla.com/contatos"}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-black text-white px-8 md:px-10 py-3.5 md:py-4 rounded-full font-sans text-xs md:text-sm uppercase tracking-[0.16em]"
            >
              {project.cta_text || "Falar com o Studio Dalla"}
            </a>
          </div>
        </section>

        <ContactSection />
      </div>
    </>
  );
};

export default CaseDetails;
