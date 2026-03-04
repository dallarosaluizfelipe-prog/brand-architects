import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ContactSection from "../components/ContactSection";
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
    <div className="animate-in fade-in duration-700">
      <header className="pt-40 pb-16 px-6 max-w-7xl mx-auto">
        <p className="text-[10px] uppercase tracking-[0.4em] font-bold font-sans mb-6 opacity-50">{project.category}</p>
        <h1 className="text-6xl md:text-8xl tracking-tighter leading-[0.9] mb-8">{project.title}</h1>
        <div className="flex flex-wrap gap-6 text-sm text-neutral-500 font-sans">
          {project.author && <span>Autor: {project.author}</span>}
          {project.case_date && <span>Data: {formatDate(project.case_date)}</span>}
          {project.external_url && (
            <a href={project.external_url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
              Ver referencia externa
            </a>
          )}
        </div>
      </header>

      <section className="px-6 pb-20 max-w-7xl mx-auto">
        <div className="rounded-3xl overflow-hidden aspect-[16/9] bg-neutral-100 shadow-lg mb-12">
          <img src={project.cover_url} alt={project.title} className="w-full h-full object-cover" />
        </div>

        {project.description && (
          <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed max-w-4xl mb-16">{project.description}</p>
        )}
      </section>

      {project.gallery_urls.length > 0 && (
        <section className="space-y-0">
          {project.gallery_urls.map((url, index) => (
            <div key={`${url}-${index}`} className="w-full">
              <img src={url} alt={`${project.title} ${index + 1}`} className="w-full h-auto block" />
            </div>
          ))}
        </section>
      )}

      <section className="py-20 px-6 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl tracking-tight mb-8">Vamos criar o proximo case da sua marca?</h2>
          <a
            href={project.cta_url || "https://estudiodalla.com/contatos"}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-black text-white px-10 py-4 rounded-full font-sans text-sm uppercase tracking-wider"
          >
            {project.cta_text || "Falar com o Studio Dalla"}
          </a>
        </div>
      </section>

      <ContactSection />
    </div>
  );
};

export default CaseDetails;
