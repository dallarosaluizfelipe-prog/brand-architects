import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppFloatingButton from "./components/WhatsAppFloatingButton";
import TrackingScripts from "./components/TrackingScripts";
import { useAnalytics } from "./src/hooks/useAnalytics";

const Home = lazy(() => import("./pages/Home"));
const Methodology = lazy(() => import("./pages/Methodology"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Admin = lazy(() => import("./pages/Admin"));
const CaseDetails = lazy(() => import("./pages/CaseDetails"));
const ProposalDetails = lazy(() => import("./pages/ProposalDetails"));
const IdentidadeVisual = lazy(() => import("./pages/IdentidadeVisual"));

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <main>{children}</main>
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
        path="/identidadevisual"
        element={
          <PublicLayout>
            <IdentidadeVisual />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isAdminRoute && <WhatsAppFloatingButton />}
    </>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <TrackingScripts />
    <AppRoutes />
  </BrowserRouter>
);

export default App;
