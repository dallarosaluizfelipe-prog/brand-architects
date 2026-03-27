import React, { useState } from 'react';
import { useSiteTexts } from '@/src/hooks/useSiteTexts';
import { trackFormSubmission } from '@/src/hooks/useAnalytics';
import { supabase } from '@/src/integrations/supabase/client';

const ContactSection: React.FC = () => {
  const t = useSiteTexts({
    cta_section_title: 'Pronto para transformar sua marca?',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;
    setSending(true);
    try {
      trackFormSubmission({ name: form.name, email: form.email, phone: form.phone, company: form.company, challenge: form.service });
      await supabase.functions.invoke('send-contact', { body: form });
    } catch { /* silent */ }
    setSending(false);
    setSubmitted(true);
    setForm({ name: '', phone: '', email: '', company: '', service: '' });
  };

  return (
    <section className="py-20 md:py-32 px-6 bg-black text-white rounded-t-[2.5rem] md:rounded-t-[5rem]" id="contact">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-20">
        <div>
          <div className="text-4xl sm:text-5xl md:text-8xl leading-[0.95] mb-8 md:mb-10 font-display" dangerouslySetInnerHTML={{ __html: t.cta_section_title }} />
          <div className="flex gap-4 md:gap-6 mt-10 md:mt-12">
            <div className="w-11 h-11 border border-white/20 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
              <span className="material-symbols-outlined text-sm">share</span>
            </div>
            <div className="w-11 h-11 border border-white/20 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
              <span className="material-symbols-outlined text-sm">link</span>
            </div>
            <div className="w-11 h-11 border border-white/20 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
              <span className="material-symbols-outlined text-sm">campaign</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 md:p-12 rounded-3xl text-black shadow-2xl">
          {submitted ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-white text-2xl">check</span>
              </div>
              <h3 className="text-2xl font-display mb-3">Mensagem enviada!</h3>
              <p className="text-neutral-500 font-sans text-sm mb-6">Entraremos em contato em breve.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm font-sans underline text-neutral-500 hover:text-black transition-colors"
              >
                Enviar outra mensagem
              </button>
            </div>
          ) : (
          <form className="space-y-5 md:space-y-6 font-sans" onSubmit={handleSubmit}>
            <input name="name" value={form.name} onChange={handleChange} className="border-b border-neutral-200 border-x-0 border-t-0 focus:ring-0 focus:border-black w-full px-0 py-4 placeholder:text-neutral-400 font-light" type="text" required placeholder="Nome *" />
            <input name="phone" value={form.phone} onChange={handleChange} className="border-b border-neutral-200 border-x-0 border-t-0 focus:ring-0 focus:border-black w-full px-0 py-4 placeholder:text-neutral-400 font-light" type="tel" required placeholder="Telefone *" />
            <input name="email" value={form.email} onChange={handleChange} className="border-b border-neutral-200 border-x-0 border-t-0 focus:ring-0 focus:border-black w-full px-0 py-4 placeholder:text-neutral-400 font-light" placeholder="Email *" type="email" required />
            <input name="company" value={form.company} onChange={handleChange} className="border-b border-neutral-200 border-x-0 border-t-0 focus:ring-0 focus:border-black w-full px-0 py-4 placeholder:text-neutral-400 font-light" type="text" required placeholder="Nome da empresa *" />
            <select name="service" value={form.service} onChange={handleChange} className="border-b border-neutral-200 border-x-0 border-t-0 focus:ring-0 focus:border-black w-full px-0 py-4 text-neutral-400 font-light appearance-none bg-transparent" required>
              <option value="">Estou buscando... *</option>
              <option value="estrategia">Estratégia de marca (posicionamento e conceito)</option>
              <option value="identidade_visual">Identidade visual (logo, cores, tipografia)</option>
              <option value="sistema_identidade">Sistema de identidade (aplicações e consistência)</option>
              <option value="branding_lancamento">Branding, lançamentos e reposicionamento</option>
              <option value="consultoria">Consultoria de marca</option>
            </select>
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-black text-white py-5 md:py-6 rounded-full font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all hover:scale-[1.02] text-xs md:text-sm disabled:opacity-50"
            >
              {sending ? 'Enviando...' : 'Enviar'}
            </button>
            <p className="text-[10px] text-neutral-400 leading-tight uppercase tracking-widest text-center">
              Seus dados são tratados conforme nossos padrões de privacidade.
            </p>
          </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
