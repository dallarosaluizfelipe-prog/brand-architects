import React from 'react';
import { useSiteTexts } from '@/src/hooks/useSiteTexts';

const Footer: React.FC = () => {
  const t = useSiteTexts({
    footer_contacts: 'CURITIBA / PARANA / BR<br />TEL +55 42 9 99153814<br />CENTRAL OFFICE<br />TEL +44 20 7946 0000',
    footer_copyright: '© 2026 Studio Dalla. All rights reserved.',
  });

  return (
    <footer className="bg-black pt-20 md:pt-32 pb-28 md:pb-16 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-14 md:mb-20 font-sans">
          <div>
            <h5 className="text-[10px] font-bold mb-5 md:mb-6 uppercase tracking-widest opacity-40">Contatos</h5>
            <div className="text-xs md:text-sm font-light opacity-80 leading-relaxed uppercase tracking-[0.2em]" dangerouslySetInnerHTML={{ __html: t.footer_contacts }} />
          </div>
          <div>
            <h5 className="text-[10px] font-bold mb-5 md:mb-6 uppercase tracking-widest opacity-40">Redes</h5>
            <ul className="text-xs md:text-sm font-light opacity-80 space-y-2 uppercase tracking-[0.2em]">
              <li><a className="hover:underline" href="https://www.instagram.com/estudiodalla/" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a className="hover:underline" href="#">LinkedIn</a></li>
              <li><a className="hover:underline" href="https://www.behance.net/luizfedalla-r/projects" target="_blank" rel="noreferrer">Behance</a></li>
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
          </div>
        </div>
        <div className="select-none">
          <img src="/lovable-uploads/dalla-logo-footer.png" alt="Dalla" className="w-full" loading="lazy" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
