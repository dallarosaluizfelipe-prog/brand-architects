import React from 'react';
import { MessageCircle, Mail, Palette } from 'lucide-react';
import Footer from '../components/Footer';
import { Seo } from '../components/Seo';
import { getWhatsAppUrl } from '@/src/utils/contact';

const links = [
  {
    label: 'WhatsApp',
    href: getWhatsAppUrl(),
    icon: MessageCircle,
  },
  {
    label: 'E-mail',
    href: 'mailto:contato@estudiodalla.com',
    icon: Mail,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/estudiodalla/',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
    ),
  },
  {
    label: 'Behance',
    href: 'https://www.behance.net/luizfedalla-r/projects',
    icon: Palette,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/estudiodalla',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
    ),
  },
];

const Links: React.FC = () => (
  <div className="min-h-screen bg-black flex flex-col">
    <Seo
      title="Links — Studio Dalla"
      description="Conecte-se com o Studio Dalla. WhatsApp, e-mail, Instagram, Behance e Facebook."
      url="https://estudiodalla.com/links"
    />

    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
      {/* Logo */}
      <img
        src="/lovable-uploads/dalla-logo-footer.png"
        alt="Dalla"
        className="w-48 md:w-56 mb-4"
      />
      <p
        className="text-white/60 text-sm tracking-[0.3em] uppercase mb-12"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Studio Dalla
      </p>

      {/* Links */}
      <div className="w-full max-w-md space-y-4">
        {links.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 border border-white/30 text-white font-sans text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
          >
            <Icon size={18} strokeWidth={1.5} />
            {label}
          </a>
        ))}
      </div>
    </div>

    <Footer />
  </div>
);

export default Links;
