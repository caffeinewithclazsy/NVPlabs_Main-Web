import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MessageSquare, ArrowRight, MapPin, Send } from "lucide-react";
import { LiquidButton } from "../components/LiquidButton";
import { api, formatApiError } from "../lib/api";
import { COMPANY } from "../lib/data";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", form);
      toast.success("Message sent. We'll respond within 24 hours.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-hidden">
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 grid-pattern" data-testid="contact-hero">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-4">Contact</div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-[-0.04em] leading-[1.02] max-w-4xl">
            Let's build something <span className="text-nvp-red">extraordinary.</span>
          </motion.h1>
          <p className="mt-6 text-base md:text-lg text-foreground/65 max-w-xl">
            Tell us about your project — we'll respond within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-card !p-6" data-testid="contact-card-email">
              <Mail className="h-5 w-5 text-nvp-red" strokeWidth={1.5} />
              <div className="mt-3 text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">Email</div>
              <a href={`mailto:${COMPANY.email}`} className="mt-1 block font-display font-semibold underline-link">{COMPANY.email}</a>
            </div>
            <div className="glass-card !p-6" data-testid="contact-card-phone">
              <Phone className="h-5 w-5 text-nvp-red" strokeWidth={1.5} />
              <div className="mt-3 text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">Phone</div>
              <a href={`tel:${COMPANY.phone}`} className="mt-1 block font-display font-semibold underline-link">{COMPANY.phone}</a>
            </div>
            <div className="glass-card !p-6" data-testid="contact-card-whatsapp">
              <MessageSquare className="h-5 w-5 text-nvp-red" strokeWidth={1.5} />
              <div className="mt-3 text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">WhatsApp</div>
              <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noreferrer" className="mt-1 block font-display font-semibold underline-link">Chat with us</a>
            </div>
            <div className="glass-card !p-6">
              <MapPin className="h-5 w-5 text-nvp-red" strokeWidth={1.5} />
              <div className="mt-3 text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">Location</div>
              <div className="mt-1 font-display font-semibold">Ahmedabad, India · Remote-first</div>
            </div>
          </div>

          <form onSubmit={submit} className="lg:col-span-2 glass-card !p-8 md:!p-10" data-testid="contact-form">
            <h2 className="font-display font-bold text-2xl tracking-tight">Tell us what you're building.</h2>
            <p className="mt-1 text-sm text-foreground/60">We'll come back within 24 hours.</p>
            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">Name *</label>
                <input required value={form.name} onChange={update("name")} className="mt-1.5 w-full rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm focus:outline-none focus:border-nvp-red" data-testid="contact-name" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">Email *</label>
                <input required type="email" value={form.email} onChange={update("email")} className="mt-1.5 w-full rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm focus:outline-none focus:border-nvp-red" data-testid="contact-email" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">Phone</label>
                <input value={form.phone} onChange={update("phone")} className="mt-1.5 w-full rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm focus:outline-none focus:border-nvp-red" data-testid="contact-phone" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">Subject</label>
                <input value={form.subject} onChange={update("subject")} className="mt-1.5 w-full rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm focus:outline-none focus:border-nvp-red" data-testid="contact-subject" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">Message *</label>
                <textarea required rows={5} value={form.message} onChange={update("message")} className="mt-1.5 w-full rounded-2xl bg-foreground/5 border border-foreground/10 px-4 py-3 text-sm focus:outline-none focus:border-nvp-red resize-none" data-testid="contact-message" />
              </div>
            </div>
            <LiquidButton type="submit" variant="primary" size="lg" disabled={loading} className="mt-6 w-full md:w-auto" data-testid="contact-submit">
              {loading ? "Sending..." : (<>Send message <Send className="h-4 w-4" strokeWidth={2} /></>)}
            </LiquidButton>
          </form>
        </div>
      </section>
    </div>
  );
}
