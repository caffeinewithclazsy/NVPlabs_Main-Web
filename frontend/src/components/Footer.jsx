import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin, Twitter, Mail, Phone, ArrowRight } from "lucide-react";
import { LiquidButton } from "./LiquidButton";
import { Logo } from "./Logo";
import { api, formatApiError } from "../lib/api";
import { COMPANY } from "../lib/data";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post("/newsletter", { email });
      toast.success("You're subscribed. Welcome to NVP Labs.");
      setEmail("");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative mt-32 border-t border-foreground/10" data-testid="footer">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">
          <div className="col-span-2 md:col-span-2">
            <Logo size="md" />
            <p className="mt-5 text-sm text-foreground/60 leading-relaxed max-w-xs">
              Building premium digital products that scale. Web, mobile, AI, SaaS, and enterprise software, crafted with restraint.
            </p>
            <div className="mt-6 flex flex-col gap-2.5 text-sm">
              <a href={`tel:${COMPANY.phone}`} className="inline-flex items-center gap-2 text-foreground/70 hover:text-nvp-red transition" data-testid="footer-phone">
                <Phone className="h-3.5 w-3.5" strokeWidth={1.75} /> {COMPANY.phone}
              </a>
              <a href={`mailto:${COMPANY.email}`} className="inline-flex items-center gap-2 text-foreground/70 hover:text-nvp-red transition" data-testid="footer-email">
                <Mail className="h-3.5 w-3.5" strokeWidth={1.75} /> {COMPANY.email}
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground/60 mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-foreground/70 hover:text-foreground">About</Link></li>
              <li><Link to="/careers" className="text-foreground/70 hover:text-foreground">Careers</Link></li>
              <li><Link to="/blog" className="text-foreground/70 hover:text-foreground">Blog</Link></li>
              <li><Link to="/contact" className="text-foreground/70 hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground/60 mb-4">Services</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/services" className="text-foreground/70 hover:text-foreground">Web Development</Link></li>
              <li><Link to="/services" className="text-foreground/70 hover:text-foreground">Mobile Apps</Link></li>
              <li><Link to="/services" className="text-foreground/70 hover:text-foreground">AI Solutions</Link></li>
              <li><Link to="/services" className="text-foreground/70 hover:text-foreground">SaaS</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground/60 mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/portfolio" className="text-foreground/70 hover:text-foreground">Portfolio</Link></li>
              <li><Link to="/pricing" className="text-foreground/70 hover:text-foreground">Pricing</Link></li>
              <li><Link to="/products" className="text-foreground/70 hover:text-foreground">Products</Link></li>
              <li><Link to="/login" className="text-foreground/70 hover:text-foreground">Client Login</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground/60 mb-4">Newsletter</h4>
            <form onSubmit={subscribe} className="flex flex-col gap-3" data-testid="footer-newsletter-form">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                data-testid="footer-newsletter-email"
                className="w-full px-4 py-2.5 rounded-full text-sm bg-foreground/5 border border-foreground/10 focus:outline-none focus:border-nvp-red transition"
              />
              <LiquidButton type="submit" variant="primary" size="sm" data-testid="footer-newsletter-submit" disabled={loading}>
                {loading ? "Subscribing..." : (<>Subscribe <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} /></>)}
              </LiquidButton>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-foreground/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-foreground/50">© {new Date().getFullYear()} NVP Labs. All rights reserved. Crafted with restraint.</p>
          <div className="flex items-center gap-3">
            <a href={COMPANY.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-foreground/50 hover:text-nvp-red transition" data-testid="social-instagram">
              <Instagram className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <a href={COMPANY.facebook} aria-label="Facebook" className="text-foreground/50 hover:text-nvp-red transition" data-testid="social-facebook">
              <Facebook className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <a href={COMPANY.linkedin} aria-label="LinkedIn" className="text-foreground/50 hover:text-nvp-red transition" data-testid="social-linkedin">
              <Linkedin className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <a href={COMPANY.twitter} aria-label="Twitter" className="text-foreground/50 hover:text-nvp-red transition" data-testid="social-twitter">
              <Twitter className="h-4 w-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
