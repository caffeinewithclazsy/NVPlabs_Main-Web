import { motion } from "framer-motion";

const ROW_1 = ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion", "GSAP", "Figma", "Vercel", "AWS", "MongoDB"];
const ROW_2 = ["FastAPI", "Node.js", "Python", "Stripe", "PostgreSQL", "Docker", "OpenAI", "Gemini", "LangChain", "Supabase"];

function Row({ items, reverse = false }) {
  // Duplicate so the marquee can loop seamlessly
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div
        className="flex gap-12 whitespace-nowrap"
        style={{
          animation: `marquee ${reverse ? "45s" : "38s"} linear infinite${reverse ? " reverse" : ""}`,
        }}
      >
        {doubled.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="font-display font-bold text-3xl md:text-5xl tracking-tighter text-foreground/15 hover:text-nvp-red transition-colors"
          >
            {t}
            <span className="text-nvp-red">.</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function LogoMarquee() {
  return (
    <section className="relative py-12 md:py-20 border-y border-foreground/5 overflow-hidden" data-testid="marquee-section">
      <div className="max-w-7xl mx-auto px-5 md:px-8 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-nvp-red" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono font-semibold text-foreground/55">Our toolkit</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-foreground/40">Always evolving</span>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="space-y-4"
      >
        <Row items={ROW_1} />
        <Row items={ROW_2} reverse />
      </motion.div>
    </section>
  );
}
