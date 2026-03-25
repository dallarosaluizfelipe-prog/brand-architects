import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { getProposalBySlug, SiteProposal } from '../src/data/siteProposals';

const ProposalDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [proposal, setProposal] = useState<SiteProposal | null>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const data = await getProposalBySlug(slug);
      setProposal(data);
      setLoading(false);
    })();
  }, [slug]);

  const handleDownloadPDF = async () => {
    const el = printRef.current;
    if (!el) return;

    const html2canvas = (await import('html2canvas-pro')).default;
    const jsPDF = (await import('jspdf')).default;

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297; // A4 height in mm

    while (heightLeft > 0) {
      position -= 297;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    pdf.save(`${slug}.pdf`);
  };

  const handleShareWhatsApp = () => {
    const url = window.location.href;
    const text = `Confira essa proposta: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-400 font-sans text-sm">Carregando proposta...</p>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <h1 className="font-display text-2xl md:text-4xl text-black">Proposta nao encontrada</h1>
        <p className="text-neutral-500 font-sans text-sm">O link pode ter expirado ou estar incorreto.</p>
        <Link to="/" className="font-sans text-sm underline text-neutral-600 hover:text-black">
          Voltar ao inicio
        </Link>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={proposal.meta_title || `Proposta \u2014 ${proposal.client_name}`}
        description={proposal.meta_description || `Proposta comercial para ${proposal.client_name}.`}
        keywords={proposal.meta_keywords || undefined}
        robots={proposal.meta_robots || 'noindex, nofollow'}
      />

      <div ref={printRef}>
        {/* Hero */}
        <section className="relative w-full">
          {proposal.banner_url ? (
            <div className="w-full aspect-[16/7] md:aspect-[21/7] overflow-hidden bg-neutral-100">
              <img
                src={proposal.banner_url}
                alt={proposal.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full aspect-[16/7] md:aspect-[21/7] bg-neutral-900" />
          )}
          <div className="px-6 md:px-16 lg:px-24 py-10 md:py-16">
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-black leading-tight">
              {proposal.title}
            </h1>
            {proposal.subtitle && (
              <p className="font-sans text-base md:text-lg text-neutral-600 mt-3 md:mt-4 max-w-2xl">
                {proposal.subtitle}
              </p>
            )}
          </div>
        </section>

        {/* Cliente */}
        {(proposal.client_name || proposal.client_contact) && (
          <section className="px-6 md:px-16 lg:px-24 py-8 md:py-12 border-t border-neutral-100">
            <h2 className="font-display text-xl md:text-2xl text-black mb-4">Cliente</h2>
            <div className="space-y-1">
              {proposal.client_name && (
                <p className="font-sans text-base md:text-lg text-neutral-800">{proposal.client_name}</p>
              )}
              {proposal.client_contact && (
                <p className="font-sans text-sm text-neutral-500">{proposal.client_contact}</p>
              )}
            </div>
          </section>
        )}

        {/* Escopo */}
        {proposal.scope && (
          <section className="px-6 md:px-16 lg:px-24 py-8 md:py-12 border-t border-neutral-100">
            <h2 className="font-display text-xl md:text-2xl text-black mb-4">Escopo</h2>
            <p className="font-sans text-sm md:text-base text-neutral-700 leading-relaxed whitespace-pre-line max-w-3xl">
              {proposal.scope}
            </p>
          </section>
        )}

        {/* Cronograma */}
        {proposal.timeline && (
          <section className="px-6 md:px-16 lg:px-24 py-8 md:py-12 border-t border-neutral-100">
            <h2 className="font-display text-xl md:text-2xl text-black mb-4">Cronograma</h2>
            <p className="font-sans text-sm md:text-base text-neutral-700 leading-relaxed whitespace-pre-line max-w-3xl">
              {proposal.timeline}
            </p>
          </section>
        )}

        {/* Sobre */}
        {proposal.about && (
          <section className="px-6 md:px-16 lg:px-24 py-8 md:py-12 border-t border-neutral-100">
            <h2 className="font-display text-xl md:text-2xl text-black mb-4">Sobre</h2>
            <p className="font-sans text-sm md:text-base text-neutral-700 leading-relaxed whitespace-pre-line max-w-3xl">
              {proposal.about}
            </p>
          </section>
        )}

        {/* Footer links */}
        {proposal.footer_links.length > 0 && (
          <section className="px-6 md:px-16 lg:px-24 py-8 md:py-12 border-t border-neutral-100">
            <h2 className="font-display text-xl md:text-2xl text-black mb-4">Links</h2>
            <ul className="space-y-2">
              {proposal.footer_links.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm md:text-base text-neutral-700 underline hover:text-black transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Action buttons — outside printRef to exclude from PDF */}
      <section className="px-6 md:px-16 lg:px-24 py-10 md:py-14 border-t border-neutral-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownloadPDF}
            className="bg-black text-white px-8 py-3.5 rounded-full font-sans text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors text-center"
          >
            Baixar PDF
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="border border-neutral-200 text-black px-8 py-3.5 rounded-full font-sans text-sm font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors text-center"
          >
            Compartilhar
          </button>
        </div>
      </section>
    </>
  );
};

export default ProposalDetails;
