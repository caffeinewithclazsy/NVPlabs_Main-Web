import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, ShoppingBag, ArrowRight, Package } from "lucide-react";
import { LiquidButton } from "../components/LiquidButton";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";

const STATUS_STYLE = {
  pending: "bg-foreground/10 text-foreground/70",
  confirmed: "bg-blue-500/10 text-blue-500",
  fulfilled: "bg-green-500/10 text-green-600 dark:text-green-400",
  cancelled: "bg-nvp-red/10 text-nvp-red",
};

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [oLoading, setOLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get("/orders").then(({ data }) => setOrders(data)).catch(()=>{}).finally(() => setOLoading(false));
  }, [user]);

  if (loading) return <div className="pt-44 text-center text-foreground/50">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="pt-32 pb-20 px-5 md:px-8 max-w-6xl mx-auto" data-testid="client-dashboard">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-2">Client portal</div>
          <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight">Welcome, {user.name.split(" ")[0]}.</h1>
          <p className="mt-1.5 text-sm text-foreground/60">Manage your orders and conversations with the NVP Labs team.</p>
        </div>
        <button onClick={logout} className="liquid-glass-btn lgb-ghost rounded-full px-4 py-2 text-sm inline-flex items-center gap-2" data-testid="logout-btn">
          <LogOut className="h-3.5 w-3.5" strokeWidth={2} /> Sign out
        </button>
      </div>

      <div className="mb-10 flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display font-bold text-xl tracking-tight inline-flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-nvp-red" strokeWidth={2} /> My Orders
        </h2>
        <Link to="/products" data-testid="dash-browse">
          <LiquidButton variant="glass" size="sm">Browse products <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} /></LiquidButton>
        </Link>
      </div>

      {oLoading ? (
        <div className="text-foreground/50 text-sm">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="glass-card !p-10 text-center" data-testid="dash-no-orders">
          <Package className="h-7 w-7 text-foreground/30 mx-auto mb-3" strokeWidth={1.25} />
          <h3 className="font-display font-bold text-lg tracking-tight">No orders yet.</h3>
          <p className="mt-1.5 text-sm text-foreground/60">When you purchase a product it will appear here.</p>
          <Link to="/products" className="mt-5 inline-block"><LiquidButton variant="primary" size="md">Explore products <ArrowRight className="h-4 w-4" strokeWidth={2} /></LiquidButton></Link>
        </div>
      ) : (
        <div className="space-y-3" data-testid="dash-orders">
          {orders.map((o, i) => (
            <motion.div key={o.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:i*0.04}} className="glass-card !p-5 flex flex-col md:flex-row md:items-center gap-4" data-testid={`order-${i}`}>
              {o.product_image && <img src={o.product_image} alt="" className="h-16 w-16 rounded-xl object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-semibold">{o.product_name}</span>
                  <span className={`text-[10px] uppercase tracking-[0.2em] font-mono font-semibold rounded-full px-2 py-0.5 ${STATUS_STYLE[o.status] || STATUS_STYLE.pending}`}>{o.status}</span>
                </div>
                <div className="mt-1 text-xs text-foreground/55 font-mono">{o.product_price} · qty {o.quantity} · {new Date(o.created_at).toLocaleString()}</div>
                {o.notes && <p className="mt-2 text-xs text-foreground/65 line-clamp-2">{o.notes}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
