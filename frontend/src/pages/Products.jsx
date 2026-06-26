import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, ShoppingBag, BarChart3, Bot } from "lucide-react";
import { LiquidButton } from "../components/LiquidButton";

const PRODUCTS = [
  { name: "Helio Cloud", desc: "Hosted SaaS analytics for product teams. From insight to action in one click.", icon: BarChart3, status: "Live", tag: "Analytics" },
  { name: "Coda Storefront", desc: "Headless commerce starter — Next.js, Stripe, Sanity. Ship in days.", icon: ShoppingBag, status: "Live", tag: "Commerce" },
  { name: "Nova Assistant", desc: "Plug-and-play AI customer support that learns from your docs.", icon: Bot, status: "Beta", tag: "AI" },
  { name: "Vertex CRM Lite", desc: "Lightweight CRM for small teams. Pipeline, deals, contacts — done right.", icon: Zap, status: "Coming Soon", tag: "Sales" },
];

export default function Products() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 grid-pattern" data-testid="products-hero">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-4">Products</div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-[-0.04em] leading-[1.02] max-w-4xl">
            Software we love.<br />Now <span className="text-nvp-red">yours.</span>
          </motion.h1>
          <p className="mt-6 text-base md:text-lg text-foreground/65 max-w-2xl">
            A small but growing family of products, built with the same craft we bring to client work.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRODUCTS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div key={p.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }} className="glass-card !p-8" data-testid={`product-${i}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="h-12 w-12 rounded-xl bg-nvp-red/10 border border-nvp-red/20 inline-flex items-center justify-center">
                    <Icon className="h-5 w-5 text-nvp-red" strokeWidth={1.5} />
                  </div>
                  <span className={`text-[10px] uppercase tracking-[0.2em] font-mono font-semibold rounded-full px-2.5 py-1 ${p.status === "Live" ? "bg-green-500/10 text-green-600 dark:text-green-400" : p.status === "Beta" ? "bg-nvp-red/10 text-nvp-red" : "bg-foreground/5 text-foreground/60"}`}>
                    {p.status}
                  </span>
                </div>
                <h3 className="mt-6 font-display font-bold text-2xl tracking-tight">{p.name}</h3>
                <p className="mt-2 text-sm text-foreground/65 leading-relaxed">{p.desc}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/50">{p.tag}</span>
                  <Link to="/contact" className="text-xs font-medium underline-link inline-flex items-center gap-1" data-testid={`product-cta-${i}`}>
                    Learn more <ArrowRight className="h-3 w-3" strokeWidth={2} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center px-5">
          <Sparkles className="h-8 w-8 text-nvp-red mx-auto mb-4" strokeWidth={1.25} />
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight">Have an idea? We build SaaS for clients too.</h2>
          <Link to="/contact" className="mt-8 inline-block" data-testid="products-cta">
            <LiquidButton variant="primary" size="lg">Discuss your idea <ArrowRight className="h-4 w-4" strokeWidth={2} /></LiquidButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
