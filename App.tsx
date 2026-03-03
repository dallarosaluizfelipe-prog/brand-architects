
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Methodology from './pages/Methodology';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import CaseStudy from './pages/CaseStudy';
import About from './pages/About';
import Admin from './pages/Admin';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');

  // Check if URL has /admin hash
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'admin') {
      setCurrentPage('admin');
    }
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Admin page renders without navbar/footer
  if (currentPage === 'admin') {
    return <Admin />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'about':
        return <About />;
      case 'methodology':
        return <Methodology />;
      case 'portfolio':
        return <Portfolio onNavigate={setCurrentPage} />;
      case 'contact':
        return <Contact />;
      case 'casestudy':
        return <CaseStudy />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      <main>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
