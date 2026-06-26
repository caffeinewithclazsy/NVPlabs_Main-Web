import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Sparkles, Globe, Smartphone, Palette, Layers,
  LayoutDashboard, Users, Boxes, Code, ShoppingBag, Rocket, Plug, Cloud,
  ShieldCheck, Star, Check, Plus, Minus, ChevronRight, Calculator
} from "lucide-react";
import { LiquidButton } from "../components/LiquidButton";
import {
  SERVICES, WEBSITE_CATEGORIES, ECOMMERCE_NICHES, ECOMMERCE_FEATURES,
  DASHBOARD_FEATURES, TECH_STACK, PORTFOLIO, PROCESS_STEPS, WHY_CHOOSE,
  TESTIMONIALS, PRICING_PLANS, FAQ_ITEMS
} from "../lib/data";
import { cn } from "../lib/utils";
import { api, formatApiError } from "../lib/api";
import { useApiList } from "../lib/useApi";
import { toast } from "sonner";
import { CostCalculatorModal } from "../components/CostCalculatorModal";

const ICONS = {
  globe: Globe, smartphone: Smartphone, palette: Palette, sparkles: Sparkles,
  layers: Layers, layoutDashboard: LayoutDashboard, users: Users, boxes: Boxes,
  code: Code, shoppingBag: ShoppingBag, rocket: Rocket, plug: Plug, cloud: Cloud,
  shieldCheck: ShieldCheck
};

/* =============== HERO =============== */
function Hero() {
  const ref = useRef(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const onMove = (e) => {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center pt-32 pb-20 overflow-hidden" data-testid="hero-section">
      {/* Backgrounds */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute inset-0 gradient-bg" />
        <div className="absolute inset-0 noise" />
        {/* Aurora mesh */}
        <div className="aurora absolute inset-0 pointer-events-none" />
        {/* Conic accent in the corner */}
        <div className="conic-accent absolute -top-1/3 -right-1/4 h-[700px] w-[700px] rounded-full opacity-60" />
        {/* Glow particles that follow mouse */}
        <div
          className="absolute h-[600px] w-[600px] rounded-full bg-nvp-red/20 blur-[140px] particle-1"
          style={{ left: `${mouse.x * 30 + 10}%`, top: `${mouse.y * 20 + 5}%` }}
        />
        <div
          className="absolute h-[500px] w-[500px] rounded-full bg-nvp-red/10 blur-[140px] particle-2"
          style={{ right: `${(1 - mouse.x) * 25 + 5}%`, bottom: `${(1 - mouse.y) * 20 + 10}%` }}
        />
        <div className="absolute h-[300px] w-[300px] rounded-full bg-foreground/5 blur-[100px] particle-3 top-1/2 left-1/4" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 w-full relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-3.5 py-1.5 mb-7"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-nvp-red pulse-red" />
          <span className="text-[11px] uppercase tracking-[0.18em] font-mono font-medium">Now booking projects for 2026</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-extrabold text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.04em] max-w-5xl"
        >
          Building <span className="text-nvp-red">Premium</span><br />
          Digital Products<br />
          That Scale.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-7 text-base sm:text-lg text-foreground/65 max-w-2xl leading-relaxed"
        >
          We design, develop and deploy world-class websites, mobile applications, AI solutions and enterprise software.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-9 flex flex-col sm:flex-row gap-3"
        >
          <Link to="/contact" data-testid="hero-start-project">
            <LiquidButton variant="primary" size="lg">
              Start Your Project <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </LiquidButton>
          </Link>
          <Link to="/portfolio" data-testid="hero-view-portfolio">
            <LiquidButton variant="glass" size="lg">
              View Portfolio <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </LiquidButton>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-20 sm:mt-28 grid grid-cols-2 md:grid-cols-4 gap-px bg-foreground/10 rounded-3xl overflow-hidden border border-foreground/5"
        >
          <Stat num="100+" label="Projects Delivered" />
          <Stat num="20+" label="Technologies" />
          <Stat num="99%" label="Client Satisfaction" />
          <Stat num="24/7" label="Premium Support" />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ num, label }) {
  return (
    <div className="bg-background p-6 md:p-8" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight stat-num">
        {num.includes("%") || num.includes("/") || num.includes("+") ? (
          <>
            <span>{num.replace(/[+%/]\d*/, "").replace(/[+%/]/, "")}</span>
            <span className="text-nvp-red">{num.match(/[+%/]\d*$/)?.[0]}</span>
          </>
        ) : (
          num
        )}
      </div>
      <div className="mt-2 text-xs uppercase tracking-[0.18em] font-mono text-foreground/55">{label}</div>
    </div>
  );
}

/* =============== SECTION HEADING =============== */
function SectionHeading({ kicker, title, subtitle, align = "left" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn("max-w-3xl mb-12 md:mb-16", align === "center" && "mx-auto text-center")}
    >
      {kicker && (
        <div className="inline-flex items-center gap-2 mb-5">
          <span className="h-px w-8 bg-nvp-red" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono font-semibold text-nvp-red">{kicker}</span>
        </div>
      )}
      <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-[-0.03em] leading-[1.05]">{title}</h2>
      {subtitle && <p className="mt-5 text-base text-foreground/60 leading-relaxed">{subtitle}</p>}
    </motion.div>
  );
}

/* =============== SERVICES =============== */
function ServicesSection() {
  return (
    <section id="services" className="relative py-24 md:py-32" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeading
          kicker="What we do"
          title="Premium services. Crafted with restraint."
          subtitle="From a single landing page to enterprise platforms — we handle the full stack with the same obsessive attention to detail."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon] || Sparkles;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card p-6 group cursor-default"
                data-testid={`service-card-${i}`}
              >
                <div className="h-11 w-11 rounded-xl bg-foreground/5 border border-foreground/10 inline-flex items-center justify-center group-hover:bg-nvp-red/10 group-hover:border-nvp-red/30 transition-all">
                  <Icon className="h-5 w-5 group-hover:text-nvp-red transition-colors" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 font-display font-semibold text-lg tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm text-foreground/60 leading-relaxed">{s.desc}</p>
                <Link to="/contact" className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-foreground/70 group-hover:text-nvp-red transition-colors underline-link">
                  Learn more <ChevronRight className="h-3 w-3" strokeWidth={2} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =============== WEBSITE CATEGORIES =============== */
function WebsiteCategoriesSection() {
  return (
    <section className="relative py-24 md:py-32" data-testid="website-categories-section">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeading
          kicker="Website categories"
          title="Premium websites for every industry."
          subtitle="We build sites that look luxurious, perform fast, and convert visitors into customers."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {WEBSITE_CATEGORIES.map((c, i) => (
            <motion.div
              key={c}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.03 }}
              className="glass-card !rounded-2xl !p-5 group cursor-default"
              data-testid={`website-cat-${i}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-foreground/40">{String(i + 1).padStart(2, "0")}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-foreground/40 group-hover:text-nvp-red group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" strokeWidth={1.75} />
              </div>
              <div className="mt-7 font-display font-semibold text-base tracking-tight">{c}</div>
              <div className="mt-1 text-xs text-foreground/50">Websites</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============== ECOMMERCE =============== */
function EcommerceSection() {
  return (
    <section className="relative py-24 md:py-32" data-testid="ecommerce-section">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeading
          kicker="Ecommerce solutions"
          title="Storefronts built to convert."
          subtitle="Custom shopping experiences with everything you need — payments, inventory, analytics — and nothing you don't."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-10">
          {ECOMMERCE_NICHES.map((n, i) => (
            <div
              key={n}
              className="glass-card !rounded-2xl !p-4 text-center group cursor-default"
              data-testid={`ecom-niche-${i}`}
            >
              <div className="font-display font-semibold text-sm tracking-tight">{n}</div>
            </div>
          ))}
        </div>
        <div className="glass-card !rounded-3xl !p-8 md:!p-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-nvp-red" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-mono font-semibold text-nvp-red">Features included</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {ECOMMERCE_FEATURES.map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 border border-foreground/10 px-3.5 py-1.5 text-sm font-medium">
                <Check className="h-3 w-3 text-nvp-red" strokeWidth={2.5} /> {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============== DASHBOARD SHOWCASE =============== */
function DashboardShowcase() {
  return (
    <section className="relative py-24 md:py-32" data-testid="dashboard-section">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeading
          kicker="Dashboards"
          title="Powerful admin dashboards."
          subtitle="Built for operators — fast, beautiful, and packed with the features you actually use."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-2.5"
          >
            {DASHBOARD_FEATURES.map((f, i) => (
              <div key={f} className="flex items-center gap-2 rounded-xl bg-foreground/5 border border-foreground/10 px-3.5 py-2.5" data-testid={`dash-feature-${i}`}>
                <div className="h-1.5 w-1.5 rounded-full bg-nvp-red" />
                <span className="text-sm font-medium">{f}</span>
              </div>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-foreground/10 aspect-[4/3] bg-foreground/5">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
                alt="Admin dashboard"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-nvp-red/10 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 glass-card !rounded-2xl !p-4 max-w-[220px] hidden md:block">
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/50 mb-1">Revenue today</div>
              <div className="font-display font-bold text-2xl">₹4,82,300</div>
              <div className="text-xs text-nvp-red mt-1">+12.4% vs yesterday</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* =============== TECH STACK =============== */
function TechStackSection() {
  return (
    <section className="relative py-24 md:py-32" data-testid="techstack-section">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeading
          kicker="Our stack"
          title="Battle-tested technologies."
          subtitle="We pick the right tool for the job — modern, fast, and built to scale."
        />
        <div className="space-y-3">
          {Object.entries(TECH_STACK).map(([category, items], catIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: catIdx * 0.05 }}
              className="glass-card !rounded-2xl !p-5 md:!p-6 flex flex-col md:flex-row md:items-center gap-4"
              data-testid={`tech-category-${category.toLowerCase()}`}
            >
              <div className="md:w-40 shrink-0">
                <div className="text-[10px] uppercase tracking-[0.3em] font-mono font-semibold text-nvp-red">{category}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((t) => (
                  <span key={t} className="rounded-full bg-foreground/5 border border-foreground/10 px-3 py-1 text-xs font-medium font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============== PORTFOLIO =============== */
function PortfolioSection() {
  const [filter, setFilter] = useState("All");
  const { data: projects } = useApiList("/projects", PORTFOLIO);
  const categories = ["All", "Websites", "Apps", "AI", "Ecommerce", "Dashboards"];
  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="portfolio" className="relative py-24 md:py-32" data-testid="portfolio-section">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeading
          kicker="Portfolio"
          title="Selected work."
          subtitle="Recent projects we're proud to share."
        />
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              data-testid={`portfolio-filter-${c.toLowerCase()}`}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-medium font-mono uppercase tracking-wider transition-all",
                filter === c
                  ? "bg-nvp-red text-white"
                  : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10 border border-foreground/10"
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id || p.title}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="glass-card !p-0 overflow-hidden group cursor-pointer"
                data-testid={`portfolio-card-${i}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-white/15 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-mono px-2.5 py-1 border border-white/20">
                      {p.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display font-semibold text-lg tracking-tight">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-foreground/60 leading-relaxed">{p.description || p.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(p.tech || []).map((t) => (
                      <span key={t} className="text-[10px] font-mono uppercase tracking-wider text-foreground/50 border border-foreground/10 rounded-full px-2 py-0.5">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* =============== PROCESS =============== */
function ProcessSection() {
  return (
    <section className="relative py-24 md:py-32" data-testid="process-section">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeading
          kicker="Our process"
          title="From discovery to delivery."
          subtitle="A clear, predictable process for every engagement — no surprises, just craft."
        />
        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-foreground/10 -translate-x-1/2" />
          <div className="space-y-4">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className={cn(
                  "relative md:grid md:grid-cols-2 md:gap-12 items-center pl-16 md:pl-0",
                  i % 2 === 0 ? "" : "md:[&>div:first-child]:order-2"
                )}
                data-testid={`process-step-${i}`}
              >
                <div className="absolute left-6 md:left-1/2 top-6 -translate-x-1/2 h-3 w-3 rounded-full bg-nvp-red ring-4 ring-background z-10" />
                <div className={cn("glass-card !rounded-2xl", i % 2 === 0 ? "md:text-right" : "")}>
                  <div className="text-[10px] uppercase tracking-[0.3em] font-mono font-semibold text-nvp-red">{step.n}</div>
                  <h3 className="mt-2 font-display font-semibold text-xl tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-sm text-foreground/60 leading-relaxed">{step.desc}</p>
                </div>
                <div />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============== WHY CHOOSE =============== */
function WhyChooseSection() {
  return (
    <section className="relative py-24 md:py-32" data-testid="why-choose-section">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeading
          kicker="Why NVP Labs"
          title="Built for teams that ship."
          subtitle="Nine reasons why founders and CTOs choose us."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WHY_CHOOSE.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="glass-card !p-6"
              data-testid={`why-${i}`}
            >
              <div className="h-9 w-9 rounded-xl bg-nvp-red/10 border border-nvp-red/20 inline-flex items-center justify-center">
                <Check className="h-4 w-4 text-nvp-red" strokeWidth={2.5} />
              </div>
              <h3 className="mt-4 font-display font-semibold text-base tracking-tight">{w.title}</h3>
              <p className="mt-1.5 text-sm text-foreground/60 leading-relaxed">{w.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============== TESTIMONIALS =============== */
function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative py-24 md:py-32" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeading
          kicker="Loved by founders"
          title="Don't take our word for it."
          align="center"
        />
        <div className="relative max-w-3xl mx-auto min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="glass-card !p-8 md:!p-12 text-center"
              data-testid={`testimonial-${idx}`}
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: TESTIMONIALS[idx].rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-nvp-red text-nvp-red" />
                ))}
              </div>
              <blockquote className="font-display text-xl md:text-2xl leading-relaxed tracking-tight">
                "{TESTIMONIALS[idx].text}"
              </blockquote>
              <div className="mt-8 flex flex-col items-center gap-3">
                <img src={TESTIMONIALS[idx].avatar} alt={TESTIMONIALS[idx].name} className="h-12 w-12 rounded-full object-cover ring-2 ring-foreground/10" />
                <div>
                  <div className="font-display font-semibold text-sm">{TESTIMONIALS[idx].name}</div>
                  <div className="text-xs text-foreground/55 font-mono uppercase tracking-wider">{TESTIMONIALS[idx].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-1.5 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Show testimonial ${i + 1}`}
                data-testid={`testimonial-dot-${i}`}
                className={cn(
                  "rounded-full transition-all",
                  i === idx ? "w-6 h-1.5 bg-nvp-red" : "w-1.5 h-1.5 bg-foreground/20"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============== PRICING =============== */
function PricingSection() {
  const { data: plans } = useApiList("/pricing-plans", PRICING_PLANS);
  return (
    <section id="pricing" className="relative py-24 md:py-32" data-testid="pricing-section">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeading
          kicker="Pricing"
          title="Plans for every ambition."
          subtitle="Transparent, fixed pricing for clearly scoped work. Custom quotes for everything else."
          align="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {plans.map((p, i) => (
            <motion.div
              key={p.id || p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={cn(
                "glass-card !p-8 relative flex flex-col",
                p.popular && "ring-1 ring-nvp-red/40 md:scale-[1.03]"
              )}
              data-testid={`pricing-${p.name.toLowerCase()}`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-nvp-red text-white text-[10px] uppercase tracking-[0.2em] font-mono font-semibold px-3 py-1">Most Popular</span>
                </div>
              )}
              <div className="text-[10px] uppercase tracking-[0.3em] font-mono font-semibold text-foreground/50">{p.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display font-bold text-4xl tracking-tight">{p.price}</span>
                <span className="text-sm text-foreground/50">{p.period}</span>
              </div>
              <p className="mt-2 text-sm text-foreground/60">{p.description || p.desc}</p>
              <ul className="mt-7 space-y-3 flex-1">
                {(p.features || []).map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-nvp-red shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-foreground/75">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="mt-8 w-full" data-testid={`pricing-cta-${p.name.toLowerCase()}`}>
                <LiquidButton variant={p.popular ? "primary" : "glass"} size="md" className="w-full">
                  {p.cta} <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </LiquidButton>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============== FAQ =============== */
function FAQSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="relative py-24 md:py-32" data-testid="faq-section">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <SectionHeading
          kicker="FAQ"
          title="Questions, answered."
          align="center"
        />
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={item.q}
              className={cn(
                "glass-card !rounded-2xl !p-0 overflow-hidden transition-all",
                open === i && "ring-1 ring-nvp-red/30"
              )}
              data-testid={`faq-item-${i}`}
            >
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
                data-testid={`faq-toggle-${i}`}
              >
                <span className="font-display font-medium text-sm md:text-base">{item.q}</span>
                <div className="h-7 w-7 rounded-full border border-foreground/10 inline-flex items-center justify-center shrink-0">
                  {open === i ? <Minus className="h-3.5 w-3.5 text-nvp-red" strokeWidth={2} /> : <Plus className="h-3.5 w-3.5" strokeWidth={2} />}
                </div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-foreground/65 leading-relaxed">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============== CTA =============== */
function CTASection() {
  const [calcOpen, setCalcOpen] = useState(false);
  return (
    <section className="relative py-24 md:py-32" data-testid="cta-section">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="relative glass-card !p-10 md:!p-20 text-center overflow-hidden">
          <div className="absolute inset-0 gradient-bg opacity-60" />
          <div className="relative">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display font-bold text-3xl sm:text-5xl md:text-6xl tracking-[-0.03em] leading-[1.05] max-w-3xl mx-auto"
            >
              Let's build something <span className="text-nvp-red">extraordinary.</span>
            </motion.h2>
            <p className="mt-6 text-base md:text-lg text-foreground/65 max-w-xl mx-auto">
              Tell us about your idea — we'll come back within 24 hours with a clear plan.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/contact" data-testid="cta-book-call">
                <LiquidButton variant="primary" size="lg">
                  Book a Call <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </LiquidButton>
              </Link>
              <button onClick={() => setCalcOpen(true)} data-testid="cta-cost-calculator">
                <LiquidButton variant="glass" size="lg" as="span">
                  <Calculator className="h-4 w-4" strokeWidth={1.75} /> Project Cost Calculator
                </LiquidButton>
              </button>
              <Link to="/contact" data-testid="cta-free-quote">
                <LiquidButton variant="ghost" size="lg">
                  Get Free Quote
                </LiquidButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <CostCalculatorModal open={calcOpen} onClose={() => setCalcOpen(false)} />
    </section>
  );
}

/* =============== HOME =============== */
import { LogoMarquee } from "../components/LogoMarquee";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <LogoMarquee />
      <ServicesSection />
      <WebsiteCategoriesSection />
      <EcommerceSection />
      <DashboardShowcase />
      <TechStackSection />
      <PortfolioSection />
      <ProcessSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
