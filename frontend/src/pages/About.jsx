import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Target, Users, Zap } from "lucide-react";
import { LiquidButton } from "../components/LiquidButton";

const VALUES = [
  { icon: Award, title: "Craft", text: "We sweat the details so the experience feels effortless. Every shadow, every transition." },
  { icon: Target, title: "Clarity", text: "Clear scope. Clear timelines. Clear pricing. Weekly demos and no surprises." },
  { icon: Zap, title: "Speed", text: "We move fast — but never at the cost of quality. Most MVPs ship in 6-8 weeks." },
  { icon: Users, title: "Partnership", text: "Long-term relationships, not transactions. We're invested in your product's success." },
];

export default function About() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 grid-pattern" data-testid="about-hero">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-4">About</div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-[-0.04em] leading-[1.02] max-w-4xl">
            A small team building <span className="text-nvp-red">premium</span> software for ambitious people.
          </motion.h1>
          <p className="mt-7 text-base md:text-lg text-foreground/65 max-w-2xl leading-relaxed">
            NVP Labs is a design-led software studio. We craft web, mobile, and AI products that look luxurious, perform exceptionally, and stand the test of time.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="aspect-[4/5] rounded-3xl overflow-hidden border border-foreground/10">
            <img src="https://images.pexels.com/photos/21044856/pexels-photo-21044856.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720" alt="Our team" className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">Born from a love of craft.</h2>
            <div className="mt-5 space-y-4 text-foreground/70 leading-relaxed">
              <p>We started NVP Labs because we couldn't find an agency that obsessed over craft the way we did. So we built one.</p>
              <p>Today, we work with founders, CTOs, and product teams who care deeply about how their software feels — not just what it does.</p>
              <p>We're proudly small. We say no often. The clients we say yes to get our full attention.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12">
            <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-3">Our values</div>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">What we believe.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div key={v.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }} className="glass-card !p-7" data-testid={`value-${i}`}>
                  <Icon className="h-6 w-6 text-nvp-red" strokeWidth={1.25} />
                  <h3 className="mt-5 font-display font-semibold text-lg tracking-tight">{v.title}</h3>
                  <p className="mt-2 text-sm text-foreground/60 leading-relaxed">{v.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center px-5">
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight">Want to work with us?</h2>
          <Link to="/contact" className="mt-8 inline-block" data-testid="about-cta">
            <LiquidButton variant="primary" size="lg">Get in touch <ArrowRight className="h-4 w-4" strokeWidth={2} /></LiquidButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
