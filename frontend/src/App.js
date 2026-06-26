import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./lib/theme";
import { AuthProvider } from "./lib/auth";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { WhatsAppButton, CookieConsent, LoadingScreen } from "./components/FloatingElements";
import { CursorFollower } from "./components/CursorFollower";
import "./App.css";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Products from "./pages/Products";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Careers from "./pages/Careers";
import { Blog, BlogPost } from "./pages/Blog";
import Contact from "./pages/Contact";
import { Login, Register } from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="min-h-[60vh] pt-44 pb-20 text-center px-5">
      <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-3">404</div>
      <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight">Page not found.</h1>
      <p className="mt-4 text-foreground/60">The page you're looking for doesn't exist.</p>
    </div>
  );
}

function AppShell() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 700); return () => clearTimeout(t); }, []);
  return (
    <>
      <LoadingScreen done={loaded} />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/products" element={<Products />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
      <CookieConsent />
      <CursorFollower />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppShell />
          <Toaster
            position="top-right"
            toastOptions={{
              className: "!font-display !rounded-2xl",
              style: { background: "hsl(var(--background))", color: "hsl(var(--foreground))", border: "1px solid hsl(var(--border))" }
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
