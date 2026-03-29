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
    icon: Instagram,
  },
  {
    label: 'Behance',
    href: 'https://www.behance.net/luizfedalla-r/projects',
    icon: Palette,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/estudiodalla',
    icon: Facebook,
  },
];

const Links: React.FC = () => (
  <div className="min-h-screen bg-black flex flex-col">
    <Seo
      title="Links — Studio Dalla"
      description="Conecte-se com o Studio Dalla. WhatsApp, e-mail, Instagram, Behance e Facebook."
      path="/links"
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
