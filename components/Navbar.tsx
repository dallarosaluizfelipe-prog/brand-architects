import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const DallaLogo = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 1278 294.92" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,294.79V.04h144.37c89.92,4.49,149.73,54.5,138.29,149.53s-101.1,135.61-187.03,143.72c-31.72,2.99-63.78.85-95.62,1.5ZM99,212.29c36.12,7.13,74.47-10.69,85.12-47.25,8.99-30.88-1.15-68.57-33.19-80.81-2.99-1.14-11.29-3.94-14.06-3.94h-37.88v132Z" fill="currentColor" />
    <path d="M1278,.04v294.75h-97.5v-73.5h-63l-19.5,73.5h-101.25l70.49-232.14c14.91-40.21,33.41-60.47,78.35-62.65l132.41.04ZM1181.25,72.04h-10.88c-6.7,0-12.25,6.91-14.24,12.76l-18.39,65.24h42.38l1.12-1.12v-76.88Z" fill="currentColor" />
    <path d="M546,.04v294.75h-96.75v-72.38l-1.12-1.12h-62.62l-19.5,73.5h-101.25l70.3-231.58C349.99,22.74,368.26,2.2,413.59,0l132.41.04ZM449.25,72.04h-10.88c-6.7,0-12.25,6.91-14.24,12.76l-18.39,65.24h42.38l1.12-1.12v-76.88Z" fill="currentColor" />
    <path d="M887.25.04v214.12l1.12,1.12h97.88v79.5h-154.88c-3.21,0-13.28-3-16.64-4.36-21.05-8.53-25.23-29.39-26.53-49.97l.04-240.41h99Z" fill="currentColor" />
    <path d="M670.5.04v215.25h98.25v79.5h-154.12c-3.21,0-13.28-3-16.64-4.36-20.92-8.48-25.08-28.76-26.53-49.22l.04-241.16h99Z" fill="currentColor" />
  </svg>
);

const NavLinks: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const { pathname } = useLocation();
  const links = [
    { label: "Estudio", path: "/estudio" },
    { label: "Metodologia", path: "/metodologia" },
    { label: "Cases", path: "/cases" },
    { label: "Contatos", path: "/contato" },
  ];
  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <>
      {links.map((link) => (
        <Link key={link.path} to={link.path} className={`transition-opacity ${isActive(link.path) ? "opacity-100" : "opacity-70 hover:opacity-100"}`} onClick={onClick}>
          {link.label}
        </Link>
      ))}
    </>
  );
};

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const links = [
    { label: "Estudio", path: "/estudio" },
    { label: "Metodologia", path: "/metodologia" },
    { label: "Cases", path: "/cases" },
    { label: "Contatos", path: "/contato" },
  ];

  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 md:top-8 left-0 md:left-1/2 md:-translate-x-1/2 z-50 w-full md:w-fit px-6 py-4 md:p-0">
        {/* Mobile and base navigation bar */}
        <div className="flex justify-between items-center w-full nav-blur px-8 py-3 rounded-full shadow-lg border border-neutral-100 md:hidden">
          <Link to="/" className="text-[14px] font-black tracking-tighter font-sans" onClick={closeMenu}>
            <DallaLogo className="h-5 w-auto" />
          </Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex flex-col gap-1.5 p-1" aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}>
            <span className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`block w-6 h-0.5 bg-black transition-opacity duration-300 ${isMenuOpen ? "opacity-0" : ""}`}></span>
            <span className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>
        </div>

        {/* Desktop navigation bar */}
        <div className="hidden md:flex nav-blur px-10 py-4 rounded-full items-center shadow-lg gap-10">
          <Link to="/" className="text-[13px] font-black tracking-tighter border-r border-neutral-300 pr-8 font-sans hover:opacity-70 transition-opacity">
            <DallaLogo className="h-5 w-auto" />
          </Link>
          <div className="flex gap-10 text-[16px] font-normal font-sans text-black">
            <NavLinks />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[60] bg-white transition-transform duration-500 ease-in-out md:hidden ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center px-12 py-8">
            <DallaLogo className="h-6 w-auto" />
            <button onClick={closeMenu} className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-100" aria-label="Fechar menu">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-grow flex flex-col justify-center px-12 space-y-8">
            {links.map((link, index) => (
              <Link key={link.path} to={link.path} onClick={closeMenu} className="text-left">
                <span className={`block text-[10px] uppercase tracking-widest font-bold font-sans mb-2 ${isActive(link.path) ? "text-black" : "text-neutral-300"}`}>
                  0{index + 1}
                </span>
                <span className={`text-6xl font-display tracking-tighter ${isActive(link.path) ? "text-black" : "text-neutral-400 hover:text-black"} transition-colors`}>
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="px-12 py-12 border-t border-neutral-100">
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              <a href="https://www.instagram.com/estudiodalla/" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://www.behance.net/luizfedalla-r/projects" target="_blank" rel="noreferrer">Behance</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
