import React from 'react';
import { getWhatsAppUrl } from '@/src/utils/contact';

const WhatsAppFloatingButton: React.FC = () => {
  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir conversa no WhatsApp"
      title="Falar no WhatsApp"
      className="fixed right-5 bottom-5 md:right-8 md:bottom-8 z-40 h-14 w-14 md:h-16 md:w-16 rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] flex items-center justify-center"
    >
      <svg viewBox="0 0 32 32" className="h-8 w-8" fill="currentColor" aria-hidden="true">
        <path d="M19.11 17.21c-.27-.13-1.57-.77-1.81-.86-.24-.09-.42-.13-.6.14-.17.26-.68.86-.83 1.03-.15.18-.3.2-.56.07-.27-.13-1.11-.41-2.11-1.29-.78-.7-1.31-1.55-1.46-1.81-.15-.27-.02-.41.11-.55.12-.11.27-.29.41-.43.14-.15.18-.26.28-.44.09-.18.05-.33-.02-.46-.07-.13-.6-1.45-.83-1.99-.22-.52-.44-.45-.61-.46-.16-.01-.33-.01-.51-.01-.18 0-.46.07-.7.33-.24.26-.92.9-.92 2.24 0 1.33.96 2.61 1.1 2.79.13.18 1.86 2.84 4.5 3.98.62.27 1.12.43 1.49.55.63.2 1.2.17 1.66.11.5-.08 1.56-.64 1.78-1.27.22-.63.22-1.14.16-1.26-.07-.12-.24-.19-.51-.32z" />
        <path d="M27.02 4.98A14.9 14.9 0 0 0 16.43.5C7.94.5 1.03 7.4 1.03 15.89c0 2.72.71 5.38 2.06 7.73L.5 31.5l8.06-2.54a15.35 15.35 0 0 0 7.87 2.15h.01c8.49 0 15.4-6.91 15.4-15.4 0-4.11-1.6-7.97-4.82-10.73zm-10.58 23.5h-.01a12.7 12.7 0 0 1-6.48-1.78l-.47-.28-4.78 1.5 1.56-4.66-.3-.48a12.76 12.76 0 0 1-1.97-6.87c0-7.04 5.72-12.76 12.76-12.76 3.41 0 6.63 1.33 9.04 3.74a12.68 12.68 0 0 1 3.73 9.03c0 7.05-5.72 12.76-12.76 12.76z" />
      </svg>
    </a>
  );
};

export default WhatsAppFloatingButton;
