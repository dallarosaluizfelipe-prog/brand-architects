import React from 'react';
import ContactSection from '../components/ContactSection';
import { Seo } from '../components/Seo';
import { useSiteTexts } from '@/src/hooks/useSiteTexts';

const Contact: React.FC = () => {
  const t = useSiteTexts({
    contact_header_title: "Let's talk.",
    contact_info: 'CURITIBA / BR / PR<br />TEL +55 42 9 9915 3014',
    contact_emails: '<a class="hover:opacity-60 transition-opacity" href="mailto:dallarosaluizfelipe@gmail.com">dallarosaluizfelipe@gmail.com</a><br /><a class="hover:opacity-60 transition-opacity" href="mailto:press@brandingstudio.com">press@brandingstudio.com</a>',
  });

  return (
    <>
      <Seo
        title="Contato - Estudio Dalla"
        description="Fale com o Estudio Dalla. Estamos prontos para transformar sua marca de luxo com design estrategico."
        keywords="contato agencia branding, contato branding SP"
      />
      <div className="animate-in fade-in duration-700">
        <header className="pt-36 md:pt-48 pb-12 md:pb-20 px-6 max-w-7xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-[12rem] leading-[0.82] tracking-tighter mb-8 md:mb-24 font-display">{t.contact_header_title}</h1>
        </header>

        <main className="max-w-7xl mx-auto px-6 pb-24 md:pb-40">
          <div className="grid md:grid-cols-12 gap-12 md:gap-32">
            <div className="md:col-span-4 space-y-12 md:space-y-20 font-sans">
              <section>
                <h5 className="text-[10px] font-bold mb-6 md:mb-8 uppercase tracking-[0.4em] opacity-40">Contatos</h5>
                <div className="font-light leading-relaxed uppercase tracking-[0.22em] text-neutral-800 text-sm md:text-lg" dangerouslySetInnerHTML={{ __html: t.contact_info }} />
              </section>
              <section>
                <h5 className="text-[10px] font-bold mb-6 md:mb-8 uppercase tracking-[0.4em] opacity-40">Email</h5>
                <div className="font-light tracking-[0.15em] text-neutral-800 text-xs md:text-lg break-words" dangerouslySetInnerHTML={{ __html: t.contact_emails }} />
              </section>
              <section>
                <h5 className="text-[10px] font-bold mb-6 md:mb-8 uppercase tracking-[0.4em] opacity-40">Redes</h5>
                <ul className="font-light space-y-3 md:space-y-4 uppercase tracking-[0.2em] text-neutral-800 text-sm md:text-lg">
                  <li><a className="hover:underline" href="https://www.instagram.com/estudiodalla/" target="_blank" rel="noreferrer">Instagram</a></li>
                  <li><a className="hover:underline" href="#">LinkedIn</a></li>
                  <li><a className="hover:underline" href="https://www.behance.net/luizfedalla-r/projects" target="_blank" rel="noreferrer">Behance</a></li>
                </ul>
              </section>
            </div>
            <div className="md:col-span-8">
              <form className="space-y-9 md:space-y-16 font-sans">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                  <input className="block w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-5 md:py-6 focus:ring-0 focus:border-black text-lg md:text-2xl font-light placeholder:text-neutral-300" placeholder="Name *" type="text" required />
                  <input className="block w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-5 md:py-6 focus:ring-0 focus:border-black text-lg md:text-2xl font-light placeholder:text-neutral-300" placeholder="Email *" type="email" required />
                </div>
                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                  <input className="block w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-5 md:py-6 focus:ring-0 focus:border-black text-lg md:text-2xl font-light placeholder:text-neutral-300" placeholder="Company" type="text" />
                  <input className="block w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-5 md:py-6 focus:ring-0 focus:border-black text-lg md:text-2xl font-light placeholder:text-neutral-300" placeholder="Subject *" type="text" required />
                </div>
                <textarea className="block w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-5 md:py-6 focus:ring-0 focus:border-black text-lg md:text-2xl font-light placeholder:text-neutral-300 min-h-[160px] md:min-h-[200px]" placeholder="Message *" required></textarea>
                <div className="pt-3 md:pt-8">
                  <button className="bg-black text-white px-10 md:px-16 py-5 md:py-7 rounded-full text-[11px] font-bold uppercase tracking-[0.22em] hover:scale-105 transition-all shadow-xl">
                    Send Inquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>

        <ContactSection />
      </div>
    </>
  );
};

export default Contact;
