import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { LogOut, FileText, Mail, BarChart3, Calculator, Briefcase, Trash2, PenSquare, Plus, X } from "lucide-react";
import { LiquidButton } from "../components/LiquidButton";
import { useAuth } from "../lib/auth";
import { api, formatApiError } from "../lib/api";
import { toast } from "sonner";
import { cn } from "../lib/utils";

const TABS = [
  { key: "leads", label: "Leads", icon: Mail },
  { key: "newsletter", label: "Newsletter", icon: BarChart3 },
  { key: "calculator", label: "Calculator", icon: Calculator },
  { key: "blog", label: "Blog", icon: FileText },
  { key: "careers", label: "Careers", icon: Briefcase },
];

export default function Admin() {
  const { user, loading, logout } = useAuth();
  const [tab, setTab] = useState("leads");
  if (loading) return <div className="pt-44 text-center text-foreground/50">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <div className="pt-28 pb-20 px-5 md:px-8 max-w-7xl mx-auto" data-testid="admin-dashboard">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-2">Admin</div>
          <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight">NVP Labs CMS.</h1>
          <p className="mt-1.5 text-sm text-foreground/60">Leads, content, careers — all in one place.</p>
        </div>
        <button onClick={logout} className="liquid-glass-btn lgb-ghost rounded-full px-4 py-2 text-sm inline-flex items-center gap-2" data-testid="admin-logout">
          <LogOut className="h-3.5 w-3.5" strokeWidth={2} /> Sign out
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium font-mono uppercase tracking-wider border transition-all",
              tab === t.key ? "bg-nvp-red text-white border-nvp-red" : "bg-foreground/5 border-foreground/10 hover:bg-foreground/10"
            )} data-testid={`admin-tab-${t.key}`}>
              <Icon className="h-3 w-3" strokeWidth={2} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "leads" && <LeadsPanel />}
      {tab === "newsletter" && <NewsletterPanel />}
      {tab === "calculator" && <CalculatorPanel />}
      {tab === "blog" && <BlogPanel />}
      {tab === "careers" && <CareersPanel />}
    </div>
  );
}

function LeadsPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/admin/leads").then(({ data }) => setItems(data)).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="text-foreground/50 text-sm">Loading…</div>;
  return (
    <div className="space-y-3" data-testid="admin-leads">
      {items.length === 0 && <div className="glass-card !p-6 text-center text-foreground/60">No leads yet.</div>}
      {items.map((l) => (
        <div key={l.id} className="glass-card !p-5">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-nvp-red/10 text-nvp-red text-[10px] uppercase tracking-wider font-mono font-semibold px-2 py-0.5">{l.type}</span>
              <span className="font-display font-semibold text-sm">{l.name}</span>
              <span className="text-xs text-foreground/55">{l.email}</span>
            </div>
            <span className="text-xs text-foreground/50 font-mono">{new Date(l.created_at).toLocaleString()}</span>
          </div>
          {l.phone && <div className="text-xs text-foreground/65">Phone: {l.phone}</div>}
          {l.company && <div className="text-xs text-foreground/65">Company: {l.company}</div>}
          {l.service && <div className="text-xs text-foreground/65">Service: {l.service}</div>}
          {l.budget && <div className="text-xs text-foreground/65">Budget: {l.budget}</div>}
          {l.subject && <div className="text-xs text-foreground/65">Subject: {l.subject}</div>}
          <p className="mt-2 text-sm text-foreground/75 whitespace-pre-line">{l.message || l.description}</p>
        </div>
      ))}
    </div>
  );
}

function NewsletterPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/admin/newsletter").then(({ data }) => setItems(data)).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="text-foreground/50 text-sm">Loading…</div>;
  return (
    <div className="glass-card !p-5" data-testid="admin-newsletter">
      <div className="font-display font-semibold mb-3">{items.length} subscribers</div>
      <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
        {items.map((s) => (
          <div key={s.id} className="flex items-center justify-between text-sm py-1.5 border-b border-foreground/5 last:border-0">
            <span>{s.email}</span>
            <span className="text-xs text-foreground/50 font-mono">{new Date(s.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalculatorPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/admin/calculator-leads").then(({ data }) => setItems(data)).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="text-foreground/50 text-sm">Loading…</div>;
  return (
    <div className="space-y-3" data-testid="admin-calculator">
      {items.length === 0 && <div className="glass-card !p-6 text-center text-foreground/60">No calculator leads yet.</div>}
      {items.map((c) => (
        <div key={c.id} className="glass-card !p-5">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <div className="font-display font-semibold text-sm">{c.name} · {c.email}</div>
            <span className="text-xs text-foreground/50 font-mono">{new Date(c.created_at).toLocaleString()}</span>
          </div>
          <div className="text-xs text-foreground/65">Project: {c.project_type} · {c.pages} pages · {c.design_complexity} · {c.timeline_weeks}w</div>
          <div className="mt-2 text-sm font-display font-bold text-nvp-red">₹{Math.round(c.estimated_min).toLocaleString("en-IN")} — ₹{Math.round(c.estimated_max).toLocaleString("en-IN")}</div>
          {c.features?.length > 0 && <div className="mt-2 flex flex-wrap gap-1">
            {c.features.map((f) => <span key={f} className="text-[10px] font-mono uppercase tracking-wider bg-foreground/5 border border-foreground/10 rounded-full px-2 py-0.5">{f}</span>)}
          </div>}
        </div>
      ))}
    </div>
  );
}

function BlogPanel() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get("/admin/blog"); setItems(data); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try { await api.delete(`/admin/blog/${id}`); toast.success("Deleted"); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };

  return (
    <div data-testid="admin-blog">
      <div className="flex justify-end mb-4">
        <button onClick={() => setEditing({})} className="liquid-glass-btn lgb-primary rounded-full px-4 py-2 text-sm inline-flex items-center gap-2" data-testid="admin-blog-new">
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> New post
        </button>
      </div>
      {loading ? <div className="text-foreground/50 text-sm">Loading…</div> : (
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p.id} className="glass-card !p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="font-display font-semibold">{p.title}</div>
                <div className="text-xs text-foreground/55 font-mono">{p.slug} · {p.published ? "published" : "draft"}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(p)} className="liquid-glass-btn lgb-light rounded-full p-2" aria-label="Edit"><PenSquare className="h-3.5 w-3.5" /></button>
                <button onClick={() => del(p.id)} className="liquid-glass-btn lgb-light rounded-full p-2 text-nvp-red" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing !== null && <BlogEditor item={editing} onClose={() => setEditing(null)} onSaved={load} />}
    </div>
  );
}

function BlogEditor({ item, onClose, onSaved }) {
  const [f, setF] = useState({
    title: item.title || "", slug: item.slug || "", excerpt: item.excerpt || "",
    content: item.content || "", cover_image: item.cover_image || "",
    tags: (item.tags || []).join(", "), published: item.published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));
  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...f, tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean) };
      if (item.id) await api.put(`/admin/blog/${item.id}`, payload);
      else await api.post("/admin/blog", payload);
      toast.success("Saved");
      onSaved(); onClose();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
    finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-3xl border border-foreground/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display font-bold text-xl">{item.id ? "Edit post" : "New post"}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-foreground/5 inline-flex items-center justify-center"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          <input placeholder="Title" value={f.title} onChange={set("title")} className="w-full rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm" />
          <input placeholder="Slug (url-friendly)" value={f.slug} onChange={set("slug")} className="w-full rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm" />
          <input placeholder="Cover image URL" value={f.cover_image} onChange={set("cover_image")} className="w-full rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm" />
          <input placeholder="Tags (comma separated)" value={f.tags} onChange={set("tags")} className="w-full rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm" />
          <textarea placeholder="Excerpt" rows={2} value={f.excerpt} onChange={set("excerpt")} className="w-full rounded-2xl bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm resize-none" />
          <textarea placeholder="Content" rows={10} value={f.content} onChange={set("content")} className="w-full rounded-2xl bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm resize-none" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} className="accent-nvp-red" /> Published
          </label>
          <LiquidButton variant="primary" onClick={save} disabled={saving} className="w-full">{saving ? "Saving..." : "Save post"}</LiquidButton>
        </div>
      </div>
    </div>
  );
}

function CareersPanel() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get("/admin/careers"); setItems(data); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try { await api.delete(`/admin/careers/${id}`); toast.success("Deleted"); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };

  return (
    <div data-testid="admin-careers">
      <div className="flex justify-end mb-4">
        <button onClick={() => setEditing({})} className="liquid-glass-btn lgb-primary rounded-full px-4 py-2 text-sm inline-flex items-center gap-2" data-testid="admin-careers-new">
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> New job
        </button>
      </div>
      {loading ? <div className="text-foreground/50 text-sm">Loading…</div> : (
        <div className="space-y-3">
          {items.map((j) => (
            <div key={j.id} className="glass-card !p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="font-display font-semibold">{j.title}</div>
                <div className="text-xs text-foreground/55 font-mono">{j.department} · {j.location} · {j.type} · {j.published ? "live" : "draft"}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(j)} className="liquid-glass-btn lgb-light rounded-full p-2" aria-label="Edit"><PenSquare className="h-3.5 w-3.5" /></button>
                <button onClick={() => del(j.id)} className="liquid-glass-btn lgb-light rounded-full p-2 text-nvp-red" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing !== null && <CareerEditor item={editing} onClose={() => setEditing(null)} onSaved={load} />}
    </div>
  );
}

function CareerEditor({ item, onClose, onSaved }) {
  const [f, setF] = useState({
    title: item.title || "", department: item.department || "", location: item.location || "",
    type: item.type || "Full-time", description: item.description || "",
    requirements: (item.requirements || []).join("\n"), salary_range: item.salary_range || "",
    published: item.published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));
  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...f, requirements: f.requirements.split("\n").map((t) => t.trim()).filter(Boolean) };
      if (item.id) await api.put(`/admin/careers/${item.id}`, payload);
      else await api.post("/admin/careers", payload);
      toast.success("Saved");
      onSaved(); onClose();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
    finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-3xl border border-foreground/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display font-bold text-xl">{item.id ? "Edit job" : "New job"}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-foreground/5 inline-flex items-center justify-center"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          <input placeholder="Title" value={f.title} onChange={set("title")} className="w-full rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Department" value={f.department} onChange={set("department")} className="rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm" />
            <input placeholder="Location" value={f.location} onChange={set("location")} className="rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Type (Full-time)" value={f.type} onChange={set("type")} className="rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm" />
            <input placeholder="Salary range" value={f.salary_range} onChange={set("salary_range")} className="rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm" />
          </div>
          <textarea placeholder="Description" rows={3} value={f.description} onChange={set("description")} className="w-full rounded-2xl bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm resize-none" />
          <textarea placeholder="Requirements (one per line)" rows={4} value={f.requirements} onChange={set("requirements")} className="w-full rounded-2xl bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm resize-none" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} className="accent-nvp-red" /> Published
          </label>
          <LiquidButton variant="primary" onClick={save} disabled={saving} className="w-full">{saving ? "Saving..." : "Save job"}</LiquidButton>
        </div>
      </div>
    </div>
  );
}
