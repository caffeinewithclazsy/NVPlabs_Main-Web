import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, FileText, MessageSquare, CheckCircle2, ArrowRight } from "lucide-react";
import { LiquidButton } from "../components/LiquidButton";
import { useAuth } from "../lib/auth";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  if (loading) return <div className="pt-44 text-center text-foreground/50">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="pt-32 pb-20 px-5 md:px-8 max-w-6xl mx-auto" data-testid="client-dashboard">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-2">Client portal</div>
          <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight">Welcome, {user.name.split(" ")[0]}.</h1>
          <p className="mt-1.5 text-sm text-foreground/60">Manage your projects, invoices, and conversations with the NVP Labs team.</p>
        </div>
        <button onClick={logout} className="liquid-glass-btn lgb-ghost rounded-full px-4 py-2 text-sm inline-flex items-center gap-2" data-testid="logout-btn">
          <LogOut className="h-3.5 w-3.5" strokeWidth={2} /> Sign out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Active Projects", value: "2", icon: FileText },
          { label: "Open Threads", value: "5", icon: MessageSquare },
          { label: "Tasks Completed", value: "47", icon: CheckCircle2 },
        ].map((s, i) => {
          const I = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.06 }} className="glass-card !p-6" data-testid={`dash-stat-${i}`}>
              <I className="h-5 w-5 text-nvp-red" strokeWidth={1.5} />
              <div className="mt-4 font-display font-bold text-3xl tracking-tight">{s.value}</div>
              <div className="text-xs uppercase tracking-[0.2em] font-mono text-foreground/55 mt-1">{s.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="glass-card !p-8 text-center">
        <h2 className="font-display font-bold text-xl tracking-tight">Client portal is live in preview.</h2>
        <p className="mt-2 text-sm text-foreground/60 max-w-md mx-auto">Project boards, invoices, and dedicated chat threads are rolling out. Reach out anytime via WhatsApp or email.</p>
        <Link to="/contact" className="mt-6 inline-block" data-testid="dash-contact">
          <LiquidButton variant="primary" size="md">Message your team <ArrowRight className="h-4 w-4" strokeWidth={2} /></LiquidButton>
        </Link>
      </div>
    </div>
  );
}
