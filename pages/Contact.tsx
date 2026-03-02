
import React from 'react';
import ContactSection from '../components/ContactSection';

const Contact: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700">
      <header className="pt-48 pb-20 px-6 max-w-7xl mx-auto">
        <h1 className="text-8xl md:text-[12rem] leading-[0.8] tracking-tighter mb-24 font-display">
          Let's talk.
        </h1>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-40">
        <div className="grid md:grid-cols-12 gap-20 md:gap-32">
          <div className="md:col-span-4 space-y-20 font-sans">
            <section>
              <h5 className="text-[10px] font-bold mb-8 uppercase tracking-[0.4em] opacity-40">CONTATOS</h5>
              <p className="font-light leading-relaxed uppercase tracking-widest text-neutral-800 text-lg">CURITIBA / BR / PR
TEL +55 42 9 9915 3014
                <br />
                Central Office<br />
                TEL +44 20 7946 0000
              </p>
            </section>
            <section>
              <h5 className="text-[10px] font-bold mb-8 uppercase tracking-[0.4em] opacity-40">Email</h5>
              <p className="font-light uppercase tracking-widest text-neutral-800 text-lg">
                <a className="hover:opacity-60 transition-opacity" href="mailto:hello@brandingstudio.com">hello@brandingstudio.com</a><br />
                <a className="hover:opacity-60 transition-opacity" href="mailto:press@brandingstudio.com">press@brandingstudio.com</a>
              </p>
            </section>
            <section>
              <h5 className="text-[10px] font-bold mb-8 uppercase tracking-[0.4em] opacity-40">Social Network</h5>
              <ul className="font-light space-y-4 uppercase tracking-widest text-neutral-800 text-lg">
                <li className="text-lg"><a className="hover:underline" href="#">Instagram</a></li>
                <li className="text-lg"><a className="hover:underline" href="#">LinkedIn</a></li>
                <li><a className="hover:underline" href="#">Behance</a></li>
                <li><a className="hover:underline" href="#">Vimeo</a></li>
              </ul>
            </section>
          </div>
          <div className="md:col-span-8">
            <form className="space-y-16 font-sans">
              <div className="grid md:grid-cols-2 gap-12">
                <input className="block w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-6 focus:ring-0 focus:border-black text-2xl font-light placeholder:text-neutral-300"
                placeholder="Name *"
                type="text"
                required />
                
                <input
                  className="block w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-6 focus:ring-0 focus:border-black text-2xl font-light placeholder:text-neutral-300"
                  placeholder="Email *"
                  type="email"
                  required />
                
              </div>
              <div className="grid md:grid-cols-2 gap-12">
                <input
                  className="block w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-6 focus:ring-0 focus:border-black text-2xl font-light placeholder:text-neutral-300"
                  placeholder="Company"
                  type="text" />
                
                <input
                  className="block w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-6 focus:ring-0 focus:border-black text-2xl font-light placeholder:text-neutral-300"
                  placeholder="Subject *"
                  type="text"
                  required />
                
              </div>
              <textarea
                className="block w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-6 focus:ring-0 focus:border-black text-2xl font-light placeholder:text-neutral-300 min-h-[200px]"
                placeholder="Message *"
                required>
              </textarea>
              <div className="pt-8">
                <button className="bg-black text-white px-16 py-7 rounded-full text-xs font-bold uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl">
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <ContactSection />
    </div>);

};

export default Contact;