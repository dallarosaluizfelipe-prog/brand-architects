
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black pt-32 pb-16 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 font-sans">
          <div>
            <h5 className="text-[10px] font-bold mb-6 uppercase tracking-widest opacity-40">CONTATOS</h5>
            <p className="text-sm font-light opacity-80 leading-relaxed uppercase tracking-widest">CURITIBA / PARANA / BR TEL +55 42 9 99153814

              <br />
              Central Office<br />
              TEL +44 20 7946 0000
            </p>
          </div>
          <div>
            <h5 className="text-[10px] font-bold mb-6 uppercase tracking-widest opacity-40">REDES</h5>
            <ul className="text-sm font-light opacity-80 space-y-2 uppercase tracking-widest">
              <li><a className="hover:underline" href="#">Instagram</a></li>
              <li><a className="hover:underline" href="#">LinkedIn</a></li>
              <li><a className="hover:underline" href="#">Behance</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-bold mb-6 uppercase tracking-widest opacity-40">Legal</h5>
            <ul className="text-sm font-light opacity-80 space-y-2 uppercase tracking-widest">
              <li><a className="hover:underline" href="#">Privacy Policy</a></li>
              <li><a className="hover:underline" href="#">Compliance</a></li>
            </ul>
          </div>
          <div className="md:text-right flex flex-col justify-between">
            <span className="text-[10px] opacity-40 uppercase tracking-widest">© 2023 ESTÚDIO DALLA</span>
          </div>
        </div>
        <div className="select-none">
          <img src="/lovable-uploads/dalla-logo-footer.png" alt="Dalla" className="w-full" />
        </div>
      </div>
    </footer>);
};

export default Footer;