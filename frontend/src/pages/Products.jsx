import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, X, ShoppingBag } from "lucide-react";
import { LiquidButton } from "../components/LiquidButton";
import { useApiList } from "../lib/useApi";
import { useAuth } from "../lib/auth";
import { api, formatApiError } from "../lib/api";
import { toast } from "sonner";

function statusClass(tag) {
  if (tag === "Live") return "bg-green-500/10 text-green-600 dark:text-green-400";
  if (tag === "Beta") return "bg-nvp-red/10 text-nvp-red";
  return "bg-foreground/5 text-foreground/60";
}

function BuyModal({ product, onClose, onPlaced }) {
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    setSaving(true);
    try {
      await api.post("/orders", { product_id: product.id, quantity: qty, notes, phone });
      toast.success("Order placed. Our team will reach out shortly.");
      onPlaced();
      onClose();
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail) || "Could not place order");
    } finally { setSaving(false); }
  };
  return (
    <AnimatePresence>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.95,opacity:0}} onClick={(e)=>e.stopPropagation()} className="bg-background rounded-3xl border border-foreground/10 max-w-md w-full p-7" data-testid="buy-modal">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-xl tracking-tight">Confirm purchase</h3>
            <button onClick={onClose} className="h-8 w-8 rounded-full bg-foreground/5 inline-flex items-center justify-center"><X className="h-4 w-4" /></button>
          </div>
          <div className="flex gap-3 mb-5">
            {product.image && <img src={product.image} alt="" className="h-16 w-16 rounded-xl object-cover" />}
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">{product.category}</div>
              <div className="font-display font-semibold">{product.name}</div>
              <div className="text-sm text-nvp-red font-display font-bold">{product.price}</div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">Quantity</label>
              <input type="number" min="1" max="99" value={qty} onChange={(e)=>setQty(parseInt(e.target.value,10)||1)} className="mt-1.5 w-full rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm focus:outline-none focus:border-nvp-red" data-testid="buy-qty" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">Phone (optional)</label>
              <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="mt-1.5 w-full rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm focus:outline-none focus:border-nvp-red" data-testid="buy-phone" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">Notes</label>
              <textarea rows={3} value={notes} onChange={(e)=>setNotes(e.target.value)} className="mt-1.5 w-full rounded-2xl bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-nvp-red" data-testid="buy-notes" />
            </div>
          </div>
          <LiquidButton variant="primary" onClick={submit} disabled={saving} className="mt-5 w-full" data-testid="buy-submit">{saving ? "Placing order..." : "Confirm order"}</LiquidButton>
          <p className="mt-3 text-[10px] text-center text-foreground/45">An NVP Labs rep will confirm payment & delivery via email after order placement.</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Products() {
  const { data: products, loading } = useApiList("/products", []);
  const { user } = useAuth();
  const [buying, setBuying] = useState(null);

  const onBuy = (p) => {
    if (!user) {
      toast.info("Please sign in to purchase.");
      window.location.href = "/login";
      return;
    }
    setBuying(p);
  };

  return (
    <div className="overflow-x-hidden">
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 grid-pattern" data-testid="products-hero">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-4">Products</div>
          <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.8}} className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-[-0.04em] leading-[1.02] max-w-4xl">
            Software we love.<br />Now <span className="text-nvp-red">yours.</span>
          </motion.h1>
          <p className="mt-6 text-base md:text-lg text-foreground/65 max-w-2xl">
            Pick a product, place an order — our team confirms payment and delivery within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          {loading ? (
            <div className="text-foreground/50 text-sm">Loading…</div>
          ) : products.length === 0 ? (
            <div className="glass-card !p-10 text-center max-w-xl mx-auto" data-testid="products-empty">
              <Sparkles className="h-7 w-7 text-nvp-red mx-auto mb-3" strokeWidth={1.25} />
              <h3 className="font-display font-bold text-xl tracking-tight">No products listed yet.</h3>
              <p className="mt-1.5 text-sm text-foreground/60">Admin can add products from the CMS dashboard.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p, i) => (
                <motion.div key={p.id} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5,delay:i*0.05}} className="glass-card !p-0 overflow-hidden group flex flex-col" data-testid={`product-${i}`}>
                  {p.image && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                  )}
                  <div className="p-7 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">{p.category}</span>
                      {p.tag && (<span className={`text-[10px] uppercase tracking-[0.2em] font-mono font-semibold rounded-full px-2.5 py-1 ${statusClass(p.tag)}`}>{p.tag}</span>)}
                    </div>
                    <h3 className="mt-3 font-display font-bold text-xl tracking-tight">{p.name}</h3>
                    <p className="mt-1.5 text-sm text-foreground/65 leading-relaxed flex-1">{p.description}</p>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="font-display font-bold text-base text-nvp-red">{p.price}</span>
                      <LiquidButton variant="primary" size="sm" onClick={() => onBuy(p)} disabled={p.in_stock === false} data-testid={`product-buy-${i}`}>
                        <ShoppingBag className="h-3.5 w-3.5" strokeWidth={2} /> {p.in_stock === false ? "Sold Out" : "Buy now"}
                      </LiquidButton>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center px-5">
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight">Need something custom?</h2>
          <Link to="/contact" className="mt-8 inline-block" data-testid="products-cta">
            <LiquidButton variant="primary" size="lg">Talk to our team <ArrowRight className="h-4 w-4" strokeWidth={2} /></LiquidButton>
          </Link>
        </div>
      </section>

      {buying && <BuyModal product={buying} onClose={() => setBuying(null)} onPlaced={() => {}} />}
    </div>
  );
}
