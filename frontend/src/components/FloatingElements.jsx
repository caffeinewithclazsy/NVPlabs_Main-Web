import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { COMPANY } from "../lib/data";
import { cn } from "../lib/utils";

export function WhatsAppButton() {
  const [show, setShow] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1200);
    const t2 = setTimeout(() => setTooltip(true), 3000);
    const t3 = setTimeout(() => setTooltip(false), 8000);
    return () => { clearTimeout(t); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (!show) return null;
  const url = `https://wa.me/${COMPANY.whatsapp}?text=Hi%20NVP%20Labs!%20I'd%20like%20to%20discuss%20a%20project.`;

  return (
    <div className="fixed bottom-5 left-5 z-[60] flex items-end gap-3" data-testid="whatsapp-float">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="relative h-14 w-14 rounded-full bg-[#25D366] text-white shadow-[0_10px_40px_rgba(37,211,102,0.4)] inline-flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6 fill-white" strokeWidth={1.5} />
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      </a>
      {tooltip && (
        <div className="glass-card !rounded-2xl !p-3 max-w-[220px] text-xs animate-fade-in pr-7 relative">
          <button onClick={() => setTooltip(false)} className="absolute top-1.5 right-1.5 text-foreground/50 hover:text-foreground" aria-label="Close">
            <X className="h-3 w-3" />
          </button>
          <div className="font-medium mb-0.5">Need help?</div>
          <div className="text-foreground/60">Chat with our team on WhatsApp.</div>
        </div>
      )}
    </div>
  );
}

export function CookieConsent() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("nvp-cookies")) {
      const t = setTimeout(() => setShow(true), 1800);
      return () => clearTimeout(t);
    }
  }, []);
  if (!show) return null;
  const accept = () => { localStorage.setItem("nvp-cookies", "accepted"); setShow(false); };
  const reject = () => { localStorage.setItem("nvp-cookies", "rejected"); setShow(false); };
  return (
    <div className="fixed bottom-5 right-5 z-[60] max-w-md" data-testid="cookie-consent">
      <div className="glass-card !p-5">
        <h4 className="font-display font-semibold text-sm mb-1.5">We use cookies</h4>
        <p className="text-xs text-foreground/65 leading-relaxed mb-4">
          We use cookies to enhance your experience, analyze traffic, and personalize content. By accepting, you agree to our cookie policy.
        </p>
        <div className="flex gap-2">
          <button onClick={reject} className="liquid-glass-btn lgb-ghost rounded-full px-4 py-2 text-xs" data-testid="cookie-reject">Reject</button>
          <button onClick={accept} className="liquid-glass-btn lgb-primary rounded-full px-4 py-2 text-xs" data-testid="cookie-accept">Accept all</button>
        </div>
      </div>
    </div>
  );
}

export function LoadingScreen({ done }) {
  return (
    <div className={cn(
      "fixed inset-0 z-[200] flex items-center justify-center bg-background transition-opacity duration-700",
      done ? "opacity-0 pointer-events-none" : "opacity-100"
    )}>
      <div className="flex flex-col items-center gap-5">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-2xl bg-nvp-black dark:bg-white flex items-center justify-center">
            <span className="font-display font-extrabold text-white dark:text-nvp-black text-2xl">N</span>
          </div>
          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-nvp-red pulse-red" />
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/50">Loading</div>
      </div>
    </div>
  );
}
