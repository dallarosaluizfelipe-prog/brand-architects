import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppFloatingButton from "./components/WhatsAppFloatingButton";
import Home from "./pages/Home";
import TrackingScripts from "./components/TrackingScripts";
import { useAnalytics } from "./src/hooks/useAnalytics";
import { LocaleProvider } from "./src/contexts/LocaleContext";

// Lazy-loaded pages — carregam apenas quando a rota é acessada
const About = lazy(() => import("./pages/About"));
const Methodology = lazy(() => import("./pages/Methodology"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const CaseDetails = lazy(() => import("./pages/CaseDetails"));
const ProposalDetails = lazy(() => import("./pages/ProposalDetails"));
const IdentidadeVisual = lazy(() => import("./pages/IdentidadeVisual"));
const LandingPage = lazy(() => import("./pages/LandingPage"));

const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
  </div>
);


const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <main>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </main>
    <Footer />
  </div>
);

const AppRoutes: React.FC = () => {
  useAnalytics();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (window.location.hash === "#admin" && window.location.pathname === "/") {
      window.history.replaceState(null, "", "/admin");
    }
  }, []);

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/admin" element={<Admin />} />

      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />
      <Route
        path="/estudio"
        element={
          <PublicLayout>
            <About />
          </PublicLayout>
        }
      />
      <Route
        path="/metodologia"
        element={
          <PublicLayout>
            <Methodology />
          </PublicLayout>
        }
      />
      <Route
        path="/cases"
        element={
          <PublicLayout>
            <Portfolio />
          </PublicLayout>
        }
      />
      <Route
        path="/cases/:slug"
        element={
          <PublicLayout>
            <CaseDetails />
          </PublicLayout>
        }
      />
      <Route
        path="/proposta/:slug"
        element={
          <PublicLayout>
            <ProposalDetails />
          </PublicLayout>
        }
      />
      <Route
        path="/identidade-visual"
        element={<Navigate to="/lp/identidade-visual" replace />}
      />
      <Route
        path="/identidadevisual"
        element={<Navigate to="/identidade-visual" replace />}
      />
      <Route
        path="/lp/:slug"
        element={
          <PublicLayout>
            <LandingPage />
          </PublicLayout>
        }
      />
      <Route
        path="/contato"
        element={
          <PublicLayout>
            <Contact />
          </PublicLayout>
        }
      />

      <Route path="/about" element={<Navigate to="/estudio" replace />} />
      <Route path="/methodology" element={<Navigate to="/metodologia" replace />} />
      <Route path="/portfolio" element={<Navigate to="/cases" replace />} />
      <Route path="/contact" element={<Navigate to="/contato" replace />} />

      {/* === English routes === */}
      <Route
        path="/en"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />
      <Route
        path="/en/studio"
        element={
          <PublicLayout>
            <About />
          </PublicLayout>
        }
      />
      <Route
        path="/en/methodology"
        element={
          <PublicLayout>
            <Methodology />
          </PublicLayout>
        }
      />
      <Route
        path="/en/cases"
        element={
          <PublicLayout>
            <Portfolio />
          </PublicLayout>
        }
      />
      <Route
        path="/en/cases/:slug"
        element={
          <PublicLayout>
            <CaseDetails />
          </PublicLayout>
        }
      />
      <Route
        path="/en/proposal/:slug"
        element={
          <PublicLayout>
            <ProposalDetails />
          </PublicLayout>
        }
      />
      <Route
        path="/en/lp/:slug"
        element={
          <PublicLayout>
            <LandingPage />
          </PublicLayout>
        }
      />
      <Route
        path="/en/contact"
        element={
          <PublicLayout>
            <Contact />
          </PublicLayout>
        }
      />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
      {!isAdminRoute && <WhatsAppFloatingButton />}
    </>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <TrackingScripts />
    <LocaleProvider>
      <AppRoutes />
    </LocaleProvider>
  </BrowserRouter>
);

export default App;
