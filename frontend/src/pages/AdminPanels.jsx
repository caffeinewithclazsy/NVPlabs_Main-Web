import { useEffect, useState } from "react";
import { X, Plus, Trash2, PenSquare, Image as ImageIcon } from "lucide-react";
import { LiquidButton } from "../components/LiquidButton";
import { api, formatApiError } from "../lib/api";
import { toast } from "sonner";

const CATEGORIES = ["Websites", "Apps", "AI", "Ecommerce", "Dashboards"];

export function ProjectsPanel() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get("/admin/projects"); setItems(data); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try { await api.delete(`/admin/projects/${id}`); toast.success("Deleted"); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };

  return (
    <div data-testid="admin-projects">
      <div className="flex justify-end mb-4">
        <button onClick={() => setEditing({})} className="liquid-glass-btn lgb-primary rounded-full px-4 py-2 text-sm inline-flex items-center gap-2" data-testid="admin-projects-new">
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> New project
        </button>
      </div>
      {loading ? <div className="text-foreground/50 text-sm">Loading…</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.length === 0 && <div className="col-span-full glass-card !p-6 text-center text-foreground/60">No projects yet.</div>}
          {items.map((p, i) => (
            <div key={p.id} className="glass-card !p-0 overflow-hidden" data-testid={`admin-project-${i}`}>
              <div className="relative aspect-[16/10] bg-foreground/5 overflow-hidden">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground/30"><ImageIcon className="h-8 w-8" strokeWidth={1.25} /></div>
                )}
                <span className="absolute top-3 left-3 rounded-full bg-white/15 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 border border-white/20">{p.category}</span>
                {!p.published && <span className="absolute top-3 right-3 rounded-full bg-foreground/70 text-background text-[10px] uppercase tracking-wider font-mono px-2 py-0.5">Hidden</span>}
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-1 text-xs text-foreground/55 line-clamp-2">{p.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/40">Order #{p.order}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(p)} className="liquid-glass-btn lgb-light rounded-full p-2" aria-label="Edit"><PenSquare className="h-3.5 w-3.5" /></button>
                    <button onClick={() => del(p.id)} className="liquid-glass-btn lgb-light rounded-full p-2 text-nvp-red" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing !== null && <ProjectEditor item={editing} onClose={() => setEditing(null)} onSaved={load} />}
    </div>
  );
}

function ProjectEditor({ item, onClose, onSaved }) {
  const [f, setF] = useState({
    title: item.title || "", category: item.category || "Websites",
    description: item.description || item.desc || "", image: item.image || "",
    tech: (item.tech || []).join(", "), demo_url: item.demo_url || "",
    case_study_url: item.case_study_url || "", featured: item.featured ?? false,
    published: item.published ?? true, order: item.order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));
  const save = async () => {
    if (!f.title || !f.image) { toast.error("Title and image are required"); return; }
    setSaving(true);
    try {
      const payload = { ...f, tech: f.tech.split(",").map((t) => t.trim()).filter(Boolean), order: parseInt(f.order, 10) || 0 };
      if (item.id) await api.put(`/admin/projects/${item.id}`, payload);
      else await api.post("/admin/projects", payload);
      toast.success("Saved");
      onSaved(); onClose();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
    finally { setSaving(false); }
  };
  return (
    <Modal title={item.id ? "Edit project" : "New project"} onClose={onClose}>
      <input placeholder="Title" value={f.title} onChange={set("title")} className={inputCls} data-testid="project-title" />
      <select value={f.category} onChange={set("category")} className={inputCls}>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <input placeholder="Image URL" value={f.image} onChange={set("image")} className={inputCls} />
      {f.image && <div className="aspect-[16/10] rounded-xl overflow-hidden bg-foreground/5"><img src={f.image} alt="" className="w-full h-full object-cover" /></div>}
      <textarea placeholder="Description" rows={3} value={f.description} onChange={set("description")} className={textareaCls} />
      <input placeholder="Tech (comma separated, e.g. React, Next.js)" value={f.tech} onChange={set("tech")} className={inputCls} />
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="Live demo URL" value={f.demo_url} onChange={set("demo_url")} className={inputCls} />
        <input placeholder="Case study URL" value={f.case_study_url} onChange={set("case_study_url")} className={inputCls} />
      </div>
      <input type="number" placeholder="Order (lower = first)" value={f.order} onChange={set("order")} className={inputCls} />
      <div className="flex gap-5">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} className="accent-nvp-red" /> Published</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.featured} onChange={(e) => setF({ ...f, featured: e.target.checked })} className="accent-nvp-red" /> Featured</label>
      </div>
      <LiquidButton variant="primary" onClick={save} disabled={saving} className="w-full" data-testid="project-save">{saving ? "Saving..." : "Save project"}</LiquidButton>
    </Modal>
  );
}

/* ============== PRICING ============== */
export function PricingPanel() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); try { const { data } = await api.get("/admin/pricing-plans"); setItems(data); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const del = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try { await api.delete(`/admin/pricing-plans/${id}`); toast.success("Deleted"); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };
  return (
    <div data-testid="admin-pricing">
      <div className="flex justify-end mb-4">
        <button onClick={() => setEditing({})} className="liquid-glass-btn lgb-primary rounded-full px-4 py-2 text-sm inline-flex items-center gap-2" data-testid="admin-pricing-new">
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> New plan
        </button>
      </div>
      {loading ? <div className="text-foreground/50 text-sm">Loading…</div> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.length === 0 && <div className="col-span-full glass-card !p-6 text-center text-foreground/60">No plans yet.</div>}
          {items.map((p, i) => (
            <div key={p.id} className="glass-card !p-6 relative" data-testid={`admin-plan-${i}`}>
              {p.popular && <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-nvp-red text-white text-[9px] uppercase tracking-[0.18em] font-mono font-semibold px-2 py-0.5">Popular</span>}
              <div className="text-[10px] uppercase tracking-[0.3em] font-mono font-semibold text-foreground/55">{p.name}</div>
              <div className="mt-3 font-display font-bold text-2xl tracking-tight">{p.price}<span className="text-sm text-foreground/50 font-normal">{p.period}</span></div>
              <p className="mt-1 text-xs text-foreground/60">{p.description}</p>
              <div className="mt-3 text-xs text-foreground/55 font-mono">{(p.features || []).length} features · order #{p.order} · {p.published ? "live" : "hidden"}</div>
              <div className="mt-5 flex gap-2 justify-end">
                <button onClick={() => setEditing(p)} className="liquid-glass-btn lgb-light rounded-full p-2"><PenSquare className="h-3.5 w-3.5" /></button>
                <button onClick={() => del(p.id)} className="liquid-glass-btn lgb-light rounded-full p-2 text-nvp-red"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing !== null && <PricingEditor item={editing} onClose={() => setEditing(null)} onSaved={load} />}
    </div>
  );
}

function PricingEditor({ item, onClose, onSaved }) {
  const [f, setF] = useState({
    name: item.name || "", price: item.price || "", period: item.period || "",
    description: item.description || item.desc || "", features: (item.features || []).join("\n"),
    cta: item.cta || "Get started", popular: item.popular ?? false,
    published: item.published ?? true, order: item.order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));
  const save = async () => {
    if (!f.name || !f.price) { toast.error("Name and price are required"); return; }
    setSaving(true);
    try {
      const payload = { ...f, features: f.features.split("\n").map((s) => s.trim()).filter(Boolean), order: parseInt(f.order, 10) || 0 };
      if (item.id) await api.put(`/admin/pricing-plans/${item.id}`, payload);
      else await api.post("/admin/pricing-plans", payload);
      toast.success("Saved");
      onSaved(); onClose();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
    finally { setSaving(false); }
  };
  return (
    <Modal title={item.id ? "Edit plan" : "New plan"} onClose={onClose}>
      <input placeholder="Plan name (e.g. Starter)" value={f.name} onChange={set("name")} className={inputCls} data-testid="plan-name" />
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="Price (e.g. ₹49,000)" value={f.price} onChange={set("price")} className={inputCls} />
        <input placeholder="Period (e.g. /project)" value={f.period} onChange={set("period")} className={inputCls} />
      </div>
      <textarea placeholder="Description" rows={2} value={f.description} onChange={set("description")} className={textareaCls} />
      <textarea placeholder="Features (one per line)" rows={6} value={f.features} onChange={set("features")} className={textareaCls} />
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="CTA label (e.g. Start project)" value={f.cta} onChange={set("cta")} className={inputCls} />
        <input type="number" placeholder="Order" value={f.order} onChange={set("order")} className={inputCls} />
      </div>
      <div className="flex gap-5">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} className="accent-nvp-red" /> Published</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.popular} onChange={(e) => setF({ ...f, popular: e.target.checked })} className="accent-nvp-red" /> Mark as Popular</label>
      </div>
      <LiquidButton variant="primary" onClick={save} disabled={saving} className="w-full" data-testid="plan-save">{saving ? "Saving..." : "Save plan"}</LiquidButton>
    </Modal>
  );
}

/* ============== PRODUCTS ============== */
export function ProductsPanel() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); try { const { data } = await api.get("/admin/products"); setItems(data); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const del = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try { await api.delete(`/admin/products/${id}`); toast.success("Deleted"); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };
  return (
    <div data-testid="admin-products">
      <div className="flex justify-end mb-4">
        <button onClick={() => setEditing({})} className="liquid-glass-btn lgb-primary rounded-full px-4 py-2 text-sm inline-flex items-center gap-2" data-testid="admin-products-new">
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> New product
        </button>
      </div>
      {loading ? <div className="text-foreground/50 text-sm">Loading…</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.length === 0 && <div className="col-span-full glass-card !p-6 text-center text-foreground/60">No products yet.</div>}
          {items.map((p, i) => (
            <div key={p.id} className="glass-card !p-0 overflow-hidden" data-testid={`admin-product-${i}`}>
              <div className="relative aspect-[16/10] bg-foreground/5 overflow-hidden">
                {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" /> :
                  <div className="w-full h-full flex items-center justify-center text-foreground/30"><ImageIcon className="h-8 w-8" strokeWidth={1.25} /></div>}
                {p.tag && <span className="absolute top-3 left-3 rounded-full bg-white/15 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 border border-white/20">{p.tag}</span>}
                {!p.published && <span className="absolute top-3 right-3 rounded-full bg-foreground/70 text-background text-[10px] uppercase tracking-wider font-mono px-2 py-0.5">Hidden</span>}
              </div>
              <div className="p-5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-foreground/55">{p.category}</div>
                <h3 className="mt-1 font-display font-semibold tracking-tight">{p.name}</h3>
                <p className="mt-1 text-xs text-foreground/55 line-clamp-2">{p.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-display font-bold text-nvp-red text-sm">{p.price}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(p)} className="liquid-glass-btn lgb-light rounded-full p-2"><PenSquare className="h-3.5 w-3.5" /></button>
                    <button onClick={() => del(p.id)} className="liquid-glass-btn lgb-light rounded-full p-2 text-nvp-red"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing !== null && <ProductEditor item={editing} onClose={() => setEditing(null)} onSaved={load} />}
    </div>
  );
}

function ProductEditor({ item, onClose, onSaved }) {
  const [f, setF] = useState({
    name: item.name || "", category: item.category || "", price: item.price || "",
    description: item.description || "", image: item.image || "", tag: item.tag || "Live",
    in_stock: item.in_stock ?? true, featured: item.featured ?? false,
    published: item.published ?? true, order: item.order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));
  const save = async () => {
    if (!f.name || !f.price) { toast.error("Name and price are required"); return; }
    setSaving(true);
    try {
      const payload = { ...f, order: parseInt(f.order, 10) || 0 };
      if (item.id) await api.put(`/admin/products/${item.id}`, payload);
      else await api.post("/admin/products", payload);
      toast.success("Saved");
      onSaved(); onClose();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
    finally { setSaving(false); }
  };
  return (
    <Modal title={item.id ? "Edit product" : "New product"} onClose={onClose}>
      <input placeholder="Product name" value={f.name} onChange={set("name")} className={inputCls} data-testid="product-name" />
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="Category (e.g. Analytics)" value={f.category} onChange={set("category")} className={inputCls} />
        <input placeholder="Price (e.g. ₹2,499/mo)" value={f.price} onChange={set("price")} className={inputCls} />
      </div>
      <input placeholder="Image URL" value={f.image} onChange={set("image")} className={inputCls} />
      {f.image && <div className="aspect-[16/10] rounded-xl overflow-hidden bg-foreground/5"><img src={f.image} alt="" className="w-full h-full object-cover" /></div>}
      <textarea placeholder="Description" rows={3} value={f.description} onChange={set("description")} className={textareaCls} />
      <div className="grid grid-cols-2 gap-3">
        <select value={f.tag} onChange={set("tag")} className={inputCls}>
          <option value="Live">Live</option>
          <option value="Beta">Beta</option>
          <option value="Coming Soon">Coming Soon</option>
          <option value="Sold Out">Sold Out</option>
        </select>
        <input type="number" placeholder="Order" value={f.order} onChange={set("order")} className={inputCls} />
      </div>
      <div className="flex gap-5 flex-wrap">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} className="accent-nvp-red" /> Published</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.in_stock} onChange={(e) => setF({ ...f, in_stock: e.target.checked })} className="accent-nvp-red" /> In stock</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.featured} onChange={(e) => setF({ ...f, featured: e.target.checked })} className="accent-nvp-red" /> Featured</label>
      </div>
      <LiquidButton variant="primary" onClick={save} disabled={saving} className="w-full" data-testid="product-save">{saving ? "Saving..." : "Save product"}</LiquidButton>
    </Modal>
  );
}

/* ============== SITE CONTENT ============== */
export function ContentPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const load = async () => { setLoading(true); try { const { data } = await api.get("/admin/site-content"); setItems(data); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const del = async (key) => {
    if (!window.confirm(`Delete content "${key}"?`)) return;
    try { await api.delete(`/admin/site-content/${encodeURIComponent(key)}`); toast.success("Deleted"); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };
  return (
    <div data-testid="admin-content">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xs text-foreground/55">
          Edit any text content used across the site. Values are referenced by <span className="font-mono">key</span> from the frontend.
        </div>
        <button onClick={() => setEditing({})} className="liquid-glass-btn lgb-primary rounded-full px-4 py-2 text-sm inline-flex items-center gap-2" data-testid="admin-content-new">
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> New key
        </button>
      </div>
      {loading ? <div className="text-foreground/50 text-sm">Loading…</div> : (
        <div className="space-y-2">
          {items.length === 0 && <div className="glass-card !p-6 text-center text-foreground/60">No content keys yet.</div>}
          {items.map((c, i) => (
            <div key={c.key} className="glass-card !p-5" data-testid={`admin-content-${i}`}>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-nvp-red font-semibold">{c.key}</div>
                  <div className="mt-1 text-sm text-foreground/80 whitespace-pre-line break-words">{c.value}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setEditing(c)} className="liquid-glass-btn lgb-light rounded-full p-2"><PenSquare className="h-3.5 w-3.5" /></button>
                  <button onClick={() => del(c.key)} className="liquid-glass-btn lgb-light rounded-full p-2 text-nvp-red"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing !== null && <ContentEditor item={editing} onClose={() => setEditing(null)} onSaved={load} />}
    </div>
  );
}

function ContentEditor({ item, onClose, onSaved }) {
  const [f, setF] = useState({ key: item.key || "", value: item.value || "" });
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if (!f.key) { toast.error("Key is required"); return; }
    setSaving(true);
    try {
      await api.put("/admin/site-content", f);
      toast.success("Saved");
      onSaved(); onClose();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
    finally { setSaving(false); }
  };
  return (
    <Modal title={item.key ? "Edit content" : "New content key"} onClose={onClose}>
      <input placeholder="Key (e.g. hero_title)" value={f.key} onChange={(e) => setF({ ...f, key: e.target.value })} disabled={!!item.key} className={inputCls + (item.key ? " opacity-60 cursor-not-allowed" : "")} data-testid="content-key" />
      <textarea placeholder="Value" rows={6} value={f.value} onChange={(e) => setF({ ...f, value: e.target.value })} className={textareaCls} data-testid="content-value" />
      <LiquidButton variant="primary" onClick={save} disabled={saving} className="w-full" data-testid="content-save">{saving ? "Saving..." : "Save"}</LiquidButton>
    </Modal>
  );
}

/* ============== UI HELPERS ============== */
const inputCls = "w-full rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm focus:outline-none focus:border-nvp-red";
const textareaCls = "w-full rounded-2xl bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-nvp-red";

function Modal({ title, children, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-3xl border border-foreground/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-display font-bold text-xl">{title}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-foreground/5 inline-flex items-center justify-center"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
