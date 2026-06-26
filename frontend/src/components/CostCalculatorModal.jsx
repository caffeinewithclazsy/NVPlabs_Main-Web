import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight } from "lucide-react";
import { LiquidButton } from "./LiquidButton";
import { api, formatApiError } from "../lib/api";
import { toast } from "sonner";
import { cn } from "../lib/utils";

const PROJECT_TYPES = [
  { key: "Landing Page", base: [25000, 80000] },
  { key: "Business Website", base: [60000, 200000] },
  { key: "E-Commerce", base: [150000, 800000] },
  { key: "Web App / SaaS", base: [300000, 2000000] },
  { key: "Mobile App", base: [400000, 2500000] },
  { key: "Admin Dashboard", base: [150000, 700000] },
  { key: "AI Solution", base: [200000, 1500000] },
];

const FEATURES = [
  "Custom Design System", "Animations & Motion", "CMS", "Payments", "Authentication",
  "Multi-language", "AI Integration", "Real-time Features", "Admin Panel", "Analytics",
];

const COMPLEXITY = [
  { key: "basic", label: "Basic", mult: 0.8 },
  { key: "premium", label: "Premium", mult: 1.0 },
  { key: "luxury", label: "Luxury", mult: 1.6 },
];

function fmt(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function CostCalculatorModal({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0].key);
  const [features, setFeatures] = useState([]);
  const [pages, setPages] = useState(5);
  const [complexity, setComplexity] = useState("premium");
  const [timeline, setTimeline] = useState(8);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setStep(0);
      setFeatures([]);
    }
  }, [open]);

  const pt = PROJECT_TYPES.find((p) => p.key === projectType) || PROJECT_TYPES[0];
  const cmplx = COMPLEXITY.find((c) => c.key === complexity) || COMPLEXITY[1];
  const featCost = features.length * 35000;
  const pageCost = Math.max(0, pages - 5) * 8000;
  const min = (pt.base[0] + featCost + pageCost) * cmplx.mult;
  const max = (pt.base[1] + featCost + pageCost) * cmplx.mult;

  const toggleFeature = (f) =>
    setFeatures((arr) => (arr.includes(f) ? arr.filter((x) => x !== f) : [...arr, f]));

  const submit = async () => {
    if (!name || !email) {
      toast.error("Please fill in your name and email");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/calculator", {
        name, email, phone, project_type: projectType, features, pages,
        design_complexity: complexity, timeline_weeks: timeline,
        estimated_min: min, estimated_max: max,
      });
      toast.success("Estimate saved. We'll be in touch within 24 hours.");
      onClose();
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          data-testid="calculator-modal"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-background rounded-3xl border border-foreground/10 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-foreground/5 hover:bg-foreground/10 inline-flex items-center justify-center z-10"
              aria-label="Close"
              data-testid="calc-close"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-6 md:p-10">
              <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-2">Project Cost Calculator</div>
              <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight">Get a transparent estimate.</h2>
              <p className="mt-2 text-sm text-foreground/60">Pick what you need. We'll save your estimate and follow up.</p>

              <div className="mt-7 space-y-7">
                {/* Step 1 */}
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-foreground/55 mb-2.5">01 — Project type</div>
                  <div className="flex flex-wrap gap-2">
                    {PROJECT_TYPES.map((p) => (
                      <button
                        key={p.key}
                        onClick={() => setProjectType(p.key)}
                        data-testid={`calc-type-${p.key.toLowerCase().replace(/\s+/g, "-")}`}
                        className={cn(
                          "rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all",
                          projectType === p.key
                            ? "bg-nvp-red text-white border-nvp-red"
                            : "bg-foreground/5 border-foreground/10 hover:bg-foreground/10"
                        )}
                      >
                        {p.key}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-foreground/55 mb-2.5">02 — Features</div>
                  <div className="grid grid-cols-2 gap-2">
                    {FEATURES.map((f) => {
                      const checked = features.includes(f);
                      return (
                        <button
                          key={f}
                          onClick={() => toggleFeature(f)}
                          data-testid={`calc-feature-${f.toLowerCase().replace(/\s+/g, "-")}`}
                          className={cn(
                            "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs text-left transition-all",
                            checked
                              ? "border-nvp-red/40 bg-nvp-red/5"
                              : "border-foreground/10 hover:bg-foreground/5"
                          )}
                        >
                          <span className={cn(
                            "h-4 w-4 rounded-md border inline-flex items-center justify-center shrink-0",
                            checked ? "bg-nvp-red border-nvp-red" : "border-foreground/30"
                          )}>
                            {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                          </span>
                          {f}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pages + Complexity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-foreground/55 mb-2.5">03 — Pages: <span className="text-foreground">{pages}</span></div>
                    <input
                      type="range" min="1" max="30" value={pages}
                      onChange={(e) => setPages(parseInt(e.target.value, 10))}
                      className="w-full accent-nvp-red"
                      data-testid="calc-pages-slider"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-foreground/55 mb-2.5">04 — Design</div>
                    <div className="flex gap-2">
                      {COMPLEXITY.map((c) => (
                        <button
                          key={c.key}
                          onClick={() => setComplexity(c.key)}
                          data-testid={`calc-complexity-${c.key}`}
                          className={cn(
                            "flex-1 rounded-xl border px-3 py-2 text-xs font-medium transition-all",
                            complexity === c.key
                              ? "border-nvp-red/40 bg-nvp-red/5 text-nvp-red"
                              : "border-foreground/10 hover:bg-foreground/5"
                          )}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-foreground/55 mb-2.5">05 — Timeline: <span className="text-foreground">{timeline} weeks</span></div>
                  <input
                    type="range" min="2" max="40" value={timeline}
                    onChange={(e) => setTimeline(parseInt(e.target.value, 10))}
                    className="w-full accent-nvp-red"
                    data-testid="calc-timeline-slider"
                  />
                </div>

                {/* Estimate */}
                <div className="rounded-2xl bg-nvp-red/5 border border-nvp-red/15 p-5">
                  <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold">Estimated investment</div>
                  <div className="mt-2 font-display font-bold text-2xl md:text-3xl tracking-tight" data-testid="calc-estimate">
                    {fmt(min)} <span className="text-foreground/40">—</span> {fmt(max)}
                  </div>
                  <div className="mt-1 text-xs text-foreground/55">Final scope confirmed during discovery call.</div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)}
                    className="rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm focus:outline-none focus:border-nvp-red"
                    data-testid="calc-name"
                  />
                  <input
                    type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm focus:outline-none focus:border-nvp-red"
                    data-testid="calc-email"
                  />
                  <input
                    placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm focus:outline-none focus:border-nvp-red"
                    data-testid="calc-phone"
                  />
                </div>

                <LiquidButton variant="primary" size="lg" onClick={submit} disabled={submitting} className="w-full" data-testid="calc-submit">
                  {submitting ? "Saving..." : (<>Save estimate & continue <ArrowRight className="h-4 w-4" strokeWidth={2} /></>)}
                </LiquidButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
