import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { LiquidButton } from "../components/LiquidButton";
import { useApiList } from "../lib/useApi";

const FALLBACK_PRODUCTS = [
  { id: "f1", name: "Helio Cloud", category: "Analytics", price: "₹2,499/mo", description: "Hosted SaaS analytics for product teams.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900", tag: "Live" },
  { id: "f2", name: "Coda Storefront", category: "Commerce", price: "₹14,999 one-time", description: "Headless commerce starter — Next.js, Stripe, Sanity.", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900", tag: "Live" },
];

function statusClass(tag) {
  if (tag === "Live") return "bg-green-500/10 text-green-600 dark:text-green-400";
  if (tag === "Beta") return "bg-nvp-red/10 text-nvp-red";
  return "bg-foreground/5 text-foreground/60";
}

export default function Products() {
  const { data: products } = useApiList("/products", FALLBACK_PRODUCTS);
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
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }} className="glass-card !p-0 overflow-hidden group" data-testid={`product-${i}`}>
              {p.image && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              )}
              <div className="p-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">{p.category}</span>
                  {p.tag && (
                    <span className={`text-[10px] uppercase tracking-[0.2em] font-mono font-semibold rounded-full px-2.5 py-1 ${statusClass(p.tag)}`}>{p.tag}</span>
                  )}
                </div>
                <h3 className="mt-3 font-display font-bold text-xl tracking-tight">{p.name}</h3>
                <p className="mt-1.5 text-sm text-foreground/65 leading-relaxed">{p.description}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-display font-bold text-base text-nvp-red">{p.price}</span>
                  <Link to="/contact" className="text-xs font-medium underline-link inline-flex items-center gap-1" data-testid={`product-cta-${i}`}>
                    Learn more <ArrowRight className="h-3 w-3" strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
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
