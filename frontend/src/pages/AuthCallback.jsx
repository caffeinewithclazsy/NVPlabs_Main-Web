import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api, formatApiError } from "../lib/api";
import { useAuth } from "../lib/auth";
import { Logo } from "../components/Logo";
import { toast } from "sonner";

/**
 * Handles the redirect from auth.emergentagent.com. The hash carries
 *   #session_id=<id>
 * which we exchange (server-side) for our own JWT cookies, then route the
 * user to /admin or /dashboard based on their role.
 *
 * REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
 */
export default function AuthCallback() {
  const loc = useLocation();
  const nav = useNavigate();
  const { refresh } = useAuth();
  const processed = useRef(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const hash = loc.hash || window.location.hash || "";
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const sessionId = params.get("session_id");
    if (!sessionId) {
      setError("Missing session. Please try signing in again.");
      return;
    }

    (async () => {
      try {
        const { data: user } = await api.post("/auth/google-session", { session_id: sessionId });
        await refresh();
        // Clear hash so we don't reprocess
        window.history.replaceState(null, "", window.location.pathname);
        toast.success(`Welcome, ${user.name.split(" ")[0]}.`);
        nav(user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
      } catch (e) {
        setError(formatApiError(e.response?.data?.detail) || "Authentication failed");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card !p-8 md:!p-10 text-center max-w-md w-full" data-testid="auth-callback">
        <Logo size="md" className="justify-center" />
        {!error ? (
          <>
            <div className="mt-7 flex justify-center">
              <div className="h-10 w-10 rounded-full border-2 border-foreground/10 border-t-nvp-red loader-ring" />
            </div>
            <h1 className="mt-6 font-display font-bold text-xl tracking-tight">Signing you in…</h1>
            <p className="mt-1 text-sm text-foreground/55">Finalising your Google session.</p>
          </>
        ) : (
          <>
            <h1 className="mt-6 font-display font-bold text-xl tracking-tight text-nvp-red">Sign-in failed</h1>
            <p className="mt-1 text-sm text-foreground/65">{error}</p>
            <button onClick={() => nav("/login", { replace: true })} className="liquid-glass-btn lgb-primary rounded-full px-5 py-2 text-sm mt-6">
              Back to login
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
