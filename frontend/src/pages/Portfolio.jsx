import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { LiquidButton } from "../components/LiquidButton";
import { PORTFOLIO } from "../lib/data";
import { cn } from "../lib/utils";

export default function Portfolio() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Websites", "Apps", "AI", "Ecommerce", "Dashboards"];
  const filtered = filter === "All" ? PORTFOLIO : PORTFOLIO.filter((p) => p.category === filter);

  return (
    <div className="overflow-x-hidden">
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 grid-pattern" data-testid="portfolio-hero">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-4">Portfolio</div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-[-0.04em] leading-[1.02] max-w-4xl">
            Selected work.<br /><span className="text-nvp-red">Made to last.</span>
          </motion.h1>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                data-testid={`pf-filter-${c.toLowerCase()}`}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-medium font-mono uppercase tracking-wider transition-all",
                  filter === c ? "bg-nvp-red text-white" : "bg-foreground/5 border border-foreground/10 hover:bg-foreground/10"
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="glass-card !p-0 overflow-hidden group cursor-pointer"
                  data-testid={`pf-card-${p.id}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="rounded-full bg-white/15 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-mono px-2.5 py-1 border border-white/20">{p.category}</span>
                      <div className="h-9 w-9 rounded-full bg-white/15 backdrop-blur-md border border-white/20 inline-flex items-center justify-center text-white group-hover:bg-nvp-red transition-colors">
                        <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                      </div>
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <h3 className="font-display font-bold text-xl md:text-2xl tracking-tight">{p.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {p.tech.map((t) => (
                          <span key={t} className="text-[10px] font-mono uppercase tracking-wider text-white/80 border border-white/20 rounded-full px-2 py-0.5">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-foreground/65 leading-relaxed">{p.desc}</p>
                    <div className="mt-4 flex gap-3">
                      <button className="inline-flex items-center gap-1.5 text-xs font-medium underline-link" data-testid={`pf-demo-${p.id}`}>
                        <Play className="h-3 w-3" strokeWidth={2} /> Live Demo
                      </button>
                      <button className="inline-flex items-center gap-1.5 text-xs font-medium underline-link" data-testid={`pf-study-${p.id}`}>
                        Case Study <ArrowUpRight className="h-3 w-3" strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center px-5">
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight">Be our next case study.</h2>
          <Link to="/contact" className="mt-8 inline-block" data-testid="portfolio-cta">
            <LiquidButton variant="primary" size="lg">Start your project <ArrowRight className="h-4 w-4" strokeWidth={2} /></LiquidButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
