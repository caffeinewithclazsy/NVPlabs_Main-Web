import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Sparkles, Globe, Smartphone, Palette, Layers, LayoutDashboard, Users, Boxes, Code, ShoppingBag, Rocket, Plug, Cloud, ShieldCheck, Check } from "lucide-react";
import { LiquidButton } from "../components/LiquidButton";
import { SERVICES, WEBSITE_CATEGORIES, ECOMMERCE_NICHES, ECOMMERCE_FEATURES, DASHBOARD_FEATURES } from "../lib/data";

const ICONS = { globe: Globe, smartphone: Smartphone, palette: Palette, sparkles: Sparkles, layers: Layers, layoutDashboard: LayoutDashboard, users: Users, boxes: Boxes, code: Code, shoppingBag: ShoppingBag, rocket: Rocket, plug: Plug, cloud: Cloud, shieldCheck: ShieldCheck };

export default function Services() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 grid-pattern" data-testid="services-hero">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-4">Services</div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-[-0.04em] leading-[1.02] max-w-4xl">
            Premium services<br />for ambitious teams.
          </motion.h1>
          <p className="mt-6 text-base md:text-lg text-foreground/65 max-w-2xl">
            Fourteen disciplines under one roof. Web, mobile, AI, cloud — and the design taste to tie it all together.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon] || Sparkles;
            return (
              <motion.div key={s.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.04 }} className="glass-card !p-7" data-testid={`services-card-${i}`}>
                <div className="h-11 w-11 rounded-xl bg-nvp-red/10 border border-nvp-red/20 inline-flex items-center justify-center">
                  <Icon className="h-5 w-5 text-nvp-red" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 font-display font-semibold text-xl tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm text-foreground/60 leading-relaxed">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-10">
            <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-3">Website categories</div>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">Industries we know.</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {WEBSITE_CATEGORIES.map((c) => (
              <span key={c} className="rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2 text-sm font-medium">{c}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-10">
            <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-3">E-Commerce</div>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">Stores we build.</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
            {ECOMMERCE_NICHES.map((n) => (
              <div key={n} className="glass-card !rounded-xl !p-4 text-center text-sm font-medium">{n}</div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {ECOMMERCE_FEATURES.map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 border border-foreground/10 px-3.5 py-1.5 text-sm">
                <Check className="h-3 w-3 text-nvp-red" strokeWidth={2.5} /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-10">
            <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-3">Dashboards</div>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">Admin features built-in.</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {DASHBOARD_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2 rounded-xl bg-foreground/5 border border-foreground/10 px-3.5 py-2.5 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-nvp-red" /> {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight">Ready to start?</h2>
          <p className="mt-4 text-foreground/65">Tell us what you're building. We'll come back with a clear plan and quote.</p>
          <Link to="/contact" className="mt-8 inline-block" data-testid="services-cta">
            <LiquidButton variant="primary" size="lg">Start a project <ArrowRight className="h-4 w-4" strokeWidth={2} /></LiquidButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
