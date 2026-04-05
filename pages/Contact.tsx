import React, { useState } from 'react';
import ContactSection from '../components/ContactSection';
import { Seo } from '../components/Seo';
import { useSiteTexts } from '@/src/hooks/useSiteTexts';
import { CONTACT_PHONE_DISPLAY, getWhatsAppUrl } from '@/src/utils/contact';
import { trackFormSubmission, pushToDataLayer } from '@/src/hooks/useAnalytics';
import { supabase } from '@/src/integrations/supabase/client';

const Contact: React.FC = () => {
  const t = useSiteTexts({
    contact_header_title: "Let's talk.",
    contact_info: `CURITIBA / BR / PR<br />TEL <a href="${getWhatsAppUrl()}" target="_blank" rel="noopener noreferrer" class="hover:opacity-60 transition-opacity">${CONTACT_PHONE_DISPLAY}</a>`,
    contact_emails: '<a class="hover:opacity-60 transition-opacity" href="mailto:contato@estudiodalla.com">contato@estudiodalla.com</a>',
    contact_seo_title: 'Contato - Estudio Dalla',
    contact_seo_description: 'Fale com o Estudio Dalla. Estamos prontos para transformar sua marca de luxo com design estrategico.',
    contact_seo_keywords: 'contato agencia branding, contato branding SP',
    social_instagram: 'https://www.instagram.com/estudiodalla/',
    social_linkedin: '',
    social_behance: 'https://www.behance.net/luizfedalla-r/projects',
  });

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    service: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;
    setSending(true);
    try {
      trackFormSubmission({ name: form.name, email: form.email, phone: form.phone, company: form.company, challenge: form.service });
      await supabase.functions.invoke('send-contact', { body: form });
      pushToDataLayer('dalla_lead_form_submit', {
        page_path: window.location.pathname,
        form_name: 'Contact Page Form',
        email: form.email,
        phone: form.phone,
        company: form.company,
        service: form.service
      });
    } catch { /* silent */ }
    setSending(false);
    setSubmitted(true);
    setForm({ name: '', phone: '', email: '', company: '', service: '' });
  };

  return (
    <>
      <Seo
        title={t.contact_seo_title}
        description={t.contact_seo_description}
        keywords={t.contact_seo_keywords}
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
                  {t.social_instagram && <li><a className="hover:underline" href={t.social_instagram} target="_blank" rel="noreferrer">Instagram</a></li>}
                  {t.social_linkedin && <li><a className="hover:underline" href={t.social_linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>}
                  {t.social_behance && <li><a className="hover:underline" href={t.social_behance} target="_blank" rel="noreferrer">Behance</a></li>}
                </ul>
              </section>
            </div>
            <div className="md:col-span-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-white text-2xl">check</span>
                  </div>
                  <h3 className="text-2xl font-display mb-3">Mensagem enviada!</h3>
                  <p className="text-neutral-500 font-sans text-sm mb-6">Entraremos em contato em breve.</p>
                  <button onClick={() => setSubmitted(false)} className="text-sm font-sans underline text-neutral-500 hover:text-black transition-colors">
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
              <form className="space-y-9 md:space-y-12 font-sans" onSubmit={handleSubmit}>
                <input name="name" value={form.name} onChange={handleChange} className="block w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-5 md:py-6 focus:ring-0 focus:border-black text-lg md:text-2xl font-light placeholder:text-neutral-300" placeholder="Nome *" type="text" required />
                <input name="phone" value={form.phone} onChange={handleChange} className="block w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-5 md:py-6 focus:ring-0 focus:border-black text-lg md:text-2xl font-light placeholder:text-neutral-300" placeholder="Telefone *" type="tel" required />
                <input name="email" value={form.email} onChange={handleChange} className="block w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-5 md:py-6 focus:ring-0 focus:border-black text-lg md:text-2xl font-light placeholder:text-neutral-300" placeholder="Email *" type="email" required />
                <input name="company" value={form.company} onChange={handleChange} className="block w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-5 md:py-6 focus:ring-0 focus:border-black text-lg md:text-2xl font-light placeholder:text-neutral-300" placeholder="Nome da empresa" type="text" />
                <select name="service" value={form.service} onChange={handleChange} className="block w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-5 md:py-6 focus:ring-0 focus:border-black text-lg md:text-2xl font-light text-neutral-300 appearance-none">
                  <option value="">Estou buscando...</option>
                  <option value="estrategia" className="text-black">Estratégia de marca (posicionamento e conceito)</option>
                  <option value="identidade_visual" className="text-black">Identidade visual (logo, cores, tipografia)</option>
                  <option value="sistema_identidade" className="text-black">Sistema de identidade (aplicações e consistência)</option>
                  <option value="branding_lancamento" className="text-black">Branding, lançamentos e reposicionamento</option>
                  <option value="consultoria" className="text-black">Consultoria de marca</option>
                </select>
                <div className="pt-3 md:pt-8">
                  <button type="submit" disabled={sending} className="bg-black text-white px-10 md:px-16 py-5 md:py-7 rounded-full text-[11px] font-bold uppercase tracking-[0.22em] hover:scale-105 transition-all shadow-xl disabled:opacity-50">
                    {sending ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </form>
              )}
            </div>
          </div>
        </main>

        <ContactSection />
      </div>
    </>
  );
};

export default Contact;
