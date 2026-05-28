import React from 'react';
import { useSiteTexts } from '@/src/hooks/useSiteTexts';
import { useLocale } from '@/src/contexts/LocaleContext';
import { CONTACT_PHONE_DISPLAY, getWhatsAppUrl } from '@/src/utils/contact';

const Footer: React.FC = () => {
  const { locale } = useLocale();
  const t = useSiteTexts({
    footer_contacts: `CURITIBA / PARANA / BR<br />TEL <a href="${getWhatsAppUrl()}" target="_blank" rel="noopener noreferrer" class="hover:opacity-60 transition-opacity">${CONTACT_PHONE_DISPLAY}</a>`,
    footer_copyright: '© 2026 Studio Dalla. All rights reserved.',
    footer_logo_url: '/lovable-uploads/dalla-logo-footer.png',
    social_instagram: 'https://www.instagram.com/estudiodalla/',
    social_linkedin: '',
    social_behance: 'https://www.behance.net/luizfedalla-r/projects',
  }, locale);

  return (
    <footer className="bg-black pt-10 md:pt-32 pb-28 md:pb-16 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-14 md:mb-20 font-sans">
          <div>
            <h5 className="text-[10px] font-bold mb-5 md:mb-6 uppercase tracking-widest opacity-40">Contatos</h5>
            <div className="text-xs md:text-sm font-light opacity-80 leading-relaxed uppercase tracking-[0.2em]" dangerouslySetInnerHTML={{ __html: t.footer_contacts }} />
          </div>
          <div>
            <h5 className="text-[10px] font-bold mb-5 md:mb-6 uppercase tracking-widest opacity-40">Redes</h5>
            <ul className="text-xs md:text-sm font-light opacity-80 space-y-2 uppercase tracking-[0.2em]">
              {t.social_instagram && <li><a className="hover:underline" href={t.social_instagram} target="_blank" rel="noreferrer">Instagram</a></li>}
              {t.social_linkedin && <li><a className="hover:underline" href={t.social_linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>}
              {t.social_behance && <li><a className="hover:underline" href={t.social_behance} target="_blank" rel="noreferrer">Behance</a></li>}
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-bold mb-5 md:mb-6 uppercase tracking-widest opacity-40">Legal</h5>
            <ul className="text-xs md:text-sm font-light opacity-80 space-y-2 uppercase tracking-[0.2em]">
              <li><a className="hover:underline" href="#">Privacy Policy</a></li>
              <li><a className="hover:underline" href="#">Compliance</a></li>
            </ul>
          </div>
          <div className="md:text-right flex flex-col justify-between">
            <span className="text-[10px] opacity-40 uppercase tracking-[0.2em]">{t.footer_copyright}</span>
            <a
              href="https://iasin.dev.br"
              target="_blank"
              rel="noreferrer"
              aria-label="Powered by Iasin"
              className="group mt-6 md:mt-0 md:self-end inline-flex items-center gap-2 text-[10px] md:text-xs opacity-70 hover:opacity-100 transition-opacity animate-in fade-in-0 slide-in-from-bottom-2 duration-700 ease-out motion-reduce:animate-none"
            >
              <span className="uppercase tracking-[0.2em]">Powered by</span>
              <span className="relative inline-block font-semibold normal-case tracking-[0.14em]">
                <span className="relative z-10">iasin.</span>
                <span className="absolute left-0 right-0 -bottom-[2px] h-px bg-white/60 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none" />
              </span>
            </a>
          </div>
        </div>
        <div className="select-none">
          <img src={t.footer_logo_url} alt="Dalla" className="w-full" loading="lazy" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
