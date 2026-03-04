import React from 'react';

const ContactSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 px-6 bg-black text-white rounded-t-[2.5rem] md:rounded-t-[5rem]" id="contact">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-20">
        <div>
          <h2 className="text-4xl sm:text-5xl md:text-8xl leading-[0.95] mb-8 md:mb-10 font-display">Pronto para transformar sua marca?</h2>
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
          <form className="space-y-5 md:space-y-6 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input className="border-b border-neutral-200 border-x-0 border-t-0 focus:ring-0 focus:border-black w-full px-0 py-4 placeholder:text-neutral-400 font-light" type="text" required placeholder="Nome *" />
              <input className="border-b border-neutral-200 border-x-0 border-t-0 focus:ring-0 focus:border-black w-full px-0 py-4 placeholder:text-neutral-400 font-light" placeholder="Email *" type="email" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input className="border-b border-neutral-200 border-x-0 border-t-0 focus:ring-0 focus:border-black w-full px-0 py-4 placeholder:text-neutral-400 font-light" type="tel" placeholder="Telefone *" />
              <input className="border-b border-neutral-200 border-x-0 border-t-0 focus:ring-0 focus:border-black w-full px-0 py-4 placeholder:text-neutral-400 font-light" type="text" required placeholder="Empresa *" />
            </div>
            <select className="border-b border-neutral-200 border-x-0 border-t-0 focus:ring-0 focus:border-black w-full px-0 py-4 text-neutral-400 font-light appearance-none bg-transparent">
              <option value="">Main Challenge?</option>
              <option>Visual Identity</option>
              <option>Integrated Strategy</option>
              <option>Performance Design</option>
            </select>
            <textarea className="border-b border-neutral-200 border-x-0 border-t-0 focus:ring-0 focus:border-black w-full px-0 py-4 placeholder:text-neutral-400 font-light min-h-[100px]" rows={3} placeholder="Descreva o seu projeto..."></textarea>
            <button className="w-full bg-black text-white py-5 md:py-6 rounded-full font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all hover:scale-[1.02] text-xs md:text-sm">
              Enviar
            </button>
            <p className="text-[10px] text-neutral-400 leading-tight uppercase tracking-widest text-center">
              Your data is processed in accordance with our high-end privacy standards.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
