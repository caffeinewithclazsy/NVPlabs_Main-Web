import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock, Briefcase } from "lucide-react";
import { LiquidButton } from "../components/LiquidButton";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/careers").then(({ data }) => setJobs(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-x-hidden">
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 grid-pattern" data-testid="careers-hero">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-4">Careers</div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-[-0.04em] leading-[1.02] max-w-4xl">
            Build the future of premium software with <span className="text-nvp-red">us.</span>
          </motion.h1>
          <p className="mt-6 text-base md:text-lg text-foreground/65 max-w-2xl">
            We're hiring craftspeople who care deeply about the work. Remote-first, deeply collaborative, and intentionally small.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-6">Open positions</div>
          {loading ? (
            <div className="text-foreground/50 text-sm">Loading…</div>
          ) : jobs.length === 0 ? (
            <div className="glass-card !p-8 text-center text-foreground/60">No open roles right now — drop us your CV at <a href="mailto:nvplabs@gmail.com" className="text-nvp-red underline">nvplabs@gmail.com</a></div>
          ) : (
            <div className="space-y-4">
              {jobs.map((j, i) => (
                <motion.div key={j.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }} className="glass-card !p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5" data-testid={`job-${i}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold mb-2">
                      <Briefcase className="h-3 w-3" strokeWidth={2} /> {j.department}
                    </div>
                    <h3 className="font-display font-bold text-xl md:text-2xl tracking-tight">{j.title}</h3>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-foreground/65">
                      <span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3" strokeWidth={2} />{j.location}</span>
                      <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3" strokeWidth={2} />{j.type}</span>
                      {j.salary_range && <span className="rounded-full bg-foreground/5 border border-foreground/10 px-2.5 py-1">{j.salary_range}</span>}
                    </div>
                    <p className="mt-3 text-sm text-foreground/65 leading-relaxed">{j.description}</p>
                  </div>
                  <Link to="/contact" data-testid={`job-apply-${i}`}>
                    <LiquidButton variant="glass" size="md">Apply <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} /></LiquidButton>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center px-5">
          <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">Don't see your role?</h2>
          <p className="mt-3 text-foreground/65">We're always meeting talented people. Send us a note.</p>
          <Link to="/contact" className="mt-7 inline-block" data-testid="careers-cta">
            <LiquidButton variant="primary" size="lg">Say hello <ArrowRight className="h-4 w-4" strokeWidth={2} /></LiquidButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
