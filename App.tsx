import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Methodology from "./pages/Methodology";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Admin from "./pages/Admin";
import CaseDetails from "./pages/CaseDetails";

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <main className="pb-28 md:pb-0">{children}</main>
    <Footer />
  </div>
);

const AppRoutes: React.FC = () => {
  useEffect(() => {
    if (window.location.hash === "#admin" && window.location.pathname === "/") {
      window.history.replaceState(null, "", "/admin");
    }
  }, []);

  return (
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
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
