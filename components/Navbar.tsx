
import React, { useState } from 'react';
import dallaLogo from '@/assets/dalla-logo.svg';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { label: 'ESTUDIO', path: 'about' },
    { label: 'METODOLOGÍA', path: 'methodology' },
    { label: 'CASES', path: 'portfolio' },
    { label: 'CONTATOS', path: 'contact' },
  ];

  const handleNavigate = (path: string) => {
    onNavigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Desktop & Mobile Navbar Container */}
      <nav className="fixed top-0 md:top-8 left-0 md:left-1/2 md:-translate-x-1/2 z-50 w-full md:w-fit px-6 py-4 md:p-0">
        {/* Desktop Version (Pill) - Hidden on mobile */}
        <div className="hidden md:flex nav-blur px-8 py-3 rounded-full items-center shadow-lg gap-8">
          <button 
            onClick={() => handleNavigate('home')}
            className="text-[13px] font-black tracking-tighter border-r border-neutral-300 pr-8 font-sans hover:opacity-70 transition-opacity"
          >
            <img src={dallaLogo} alt="DALLA" className="h-6 w-auto object-contain" />
          </button>
          <div className="flex gap-8 text-[11px] font-bold uppercase tracking-[0.15em] font-sans text-neutral-800">
            {links.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigate(link.path)}
                className={`hover:text-black transition-colors ${currentPage === link.path ? 'text-black' : 'text-neutral-500'}`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Version - Header Bar */}
        <div className="md:hidden flex justify-between items-center w-full nav-blur px-8 py-3 rounded-full shadow-lg border border-neutral-100">
          <button 
            onClick={() => handleNavigate('home')}
            className="text-[14px] font-black tracking-tighter font-sans"
          >
            <img src={dallaLogo} alt="DALLA" className="h-5" />
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col gap-1.5 p-1"
          >
            <span className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-black transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Overlay */}
      <div className={`fixed inset-0 z-[60] bg-white transition-transform duration-500 ease-in-out md:hidden ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center px-12 py-8">
            <img src={dallaLogo} alt="DALLA" className="h-6" />
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-100"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div className="flex-grow flex flex-col justify-center px-12 space-y-8">
            {links.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigate(link.path)}
                className="text-left"
              >
                <span className={`block text-[10px] uppercase tracking-widest font-bold font-sans mb-2 ${currentPage === link.path ? 'text-black' : 'text-neutral-300'}`}>
                  0{links.indexOf(link) + 1}
                </span>
                <span className={`text-6xl font-display tracking-tighter ${currentPage === link.path ? 'text-black' : 'text-neutral-400 hover:text-black'} transition-colors`}>
                  {link.label}
                </span>
              </button>
            ))}
          </div>

          <div className="px-12 py-12 border-t border-neutral-100">
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              <a href="#">Instagram</a>
              <a href="#">LinkedIn</a>
              <a href="#">Behance</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
