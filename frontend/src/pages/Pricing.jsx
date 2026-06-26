import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { LiquidButton } from "../components/LiquidButton";
import { PRICING_PLANS, FAQ_ITEMS } from "../lib/data";
import { cn } from "../lib/utils";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState(0);
  return (
    <div className="overflow-x-hidden">
      <section className="relative pt-36 pb-12 md:pt-44 md:pb-16 grid-pattern" data-testid="pricing-hero">
        <div className="max-w-7xl mx-auto px-5 md:px-8 text-center">
          <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-4">Pricing</div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-[-0.04em] leading-[1.02]">
            Plans for every <span className="text-nvp-red">ambition.</span>
          </motion.h1>
          <p className="mt-5 text-base text-foreground/65 max-w-2xl mx-auto">Transparent pricing. Fixed scope. No surprises.</p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl">
          {PRICING_PLANS.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }} className={cn("glass-card !p-8 relative flex flex-col", p.popular && "ring-1 ring-nvp-red/40 md:scale-[1.03]")} data-testid={`p-pricing-${p.name.toLowerCase()}`}>
              {p.popular && (<div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="rounded-full bg-nvp-red text-white text-[10px] uppercase tracking-[0.2em] font-mono font-semibold px-3 py-1">Most Popular</span></div>)}
              <div className="text-[10px] uppercase tracking-[0.3em] font-mono font-semibold text-foreground/50">{p.name}</div>
              <div className="mt-4 flex items-baseline gap-1"><span className="font-display font-bold text-4xl tracking-tight">{p.price}</span><span className="text-sm text-foreground/50">{p.period}</span></div>
              <p className="mt-2 text-sm text-foreground/60">{p.desc}</p>
              <ul className="mt-7 space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm"><Check className="h-4 w-4 text-nvp-red shrink-0 mt-0.5" strokeWidth={2.5} /><span className="text-foreground/75">{f}</span></li>
                ))}
              </ul>
              <Link to="/contact" className="mt-8 w-full"><LiquidButton variant={p.popular ? "primary" : "glass"} size="md" className="w-full">{p.cta} <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} /></LiquidButton></Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12">
            <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-3">FAQ</div>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">Common questions.</h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={item.q} className={cn("glass-card !rounded-2xl !p-0 overflow-hidden", openFaq === i && "ring-1 ring-nvp-red/30")} data-testid={`p-faq-${i}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
                  <span className="font-display font-medium text-sm md:text-base">{item.q}</span>
                  <div className="h-7 w-7 rounded-full border border-foreground/10 inline-flex items-center justify-center shrink-0">
                    {openFaq === i ? <Minus className="h-3.5 w-3.5 text-nvp-red" /> : <Plus className="h-3.5 w-3.5" />}
                  </div>
                </button>
                <AnimatePresence>{openFaq === i && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="px-5 pb-5 text-sm text-foreground/65 leading-relaxed">{item.a}</p></motion.div>)}</AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
