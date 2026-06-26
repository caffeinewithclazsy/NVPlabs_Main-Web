import { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { LiquidButton } from "../components/LiquidButton";
import { GoogleSignInButton } from "../components/GoogleSignInButton";
import { Logo } from "../components/Logo";
import { useAuth } from "../lib/auth";
import { formatApiError } from "../lib/api";
import { toast } from "sonner";

export function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from || "/dashboard";

  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(email, password);
      toast.success(`Welcome back, ${u.name}`);
      nav(u.role === "admin" ? "/admin" : from, { replace: true });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-32 grid-pattern">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="glass-card !p-8 md:!p-10 w-full max-w-md">
        <Link to="/" className="inline-block mb-7"><Logo size="md" /></Link>
        <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight">Welcome back.</h1>
        <p className="mt-1.5 text-sm text-foreground/60">Sign in to your dashboard. Use your <span className="font-mono text-foreground">nvplabs@gmail.com</span> Google account for admin access.</p>

        <div className="mt-7 space-y-3">
          <GoogleSignInButton testid="login-google" />
        </div>
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-foreground/10" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/40">Or with email</span>
          <div className="flex-1 h-px bg-foreground/10" />
        </div>

        <form onSubmit={submit} className="space-y-4" data-testid="login-form">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm focus:outline-none focus:border-nvp-red" data-testid="login-email" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">Password</label>
            <div className="mt-1.5 relative">
              <input required type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm focus:outline-none focus:border-nvp-red pr-12" data-testid="login-password" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground" aria-label="Toggle password">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <LiquidButton type="submit" variant="primary" size="lg" disabled={loading} className="w-full" data-testid="login-submit">
            {loading ? "Signing in..." : (<>Sign in <ArrowRight className="h-4 w-4" strokeWidth={2} /></>)}
          </LiquidButton>
        </form>
        <p className="mt-5 text-xs text-center text-foreground/55">
          New here? <Link to="/register" className="text-foreground underline-link">Create an account</Link>
        </p>
      </motion.div>
    </div>
  );
}

export function Register() {
  const { user, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Account created. Welcome to NVP Labs.");
      nav("/dashboard", { replace: true });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-32 grid-pattern">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="glass-card !p-8 md:!p-10 w-full max-w-md">
        <Link to="/" className="inline-block mb-7"><Logo size="md" /></Link>
        <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight">Create an account.</h1>
        <p className="mt-1.5 text-sm text-foreground/60">Start your client portal in seconds.</p>

        <div className="mt-7 space-y-3">
          <GoogleSignInButton label="Sign up with Google" testid="register-google" />
        </div>
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-foreground/10" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/40">Or with email</span>
          <div className="flex-1 h-px bg-foreground/10" />
        </div>

        <form onSubmit={submit} className="space-y-4" data-testid="register-form">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm focus:outline-none focus:border-nvp-red" data-testid="register-name" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm focus:outline-none focus:border-nvp-red" data-testid="register-email" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-foreground/55 font-semibold">Password</label>
            <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 w-full rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2.5 text-sm focus:outline-none focus:border-nvp-red" data-testid="register-password" />
          </div>
          <LiquidButton type="submit" variant="primary" size="lg" disabled={loading} className="w-full" data-testid="register-submit">
            {loading ? "Creating..." : (<>Create account <ArrowRight className="h-4 w-4" strokeWidth={2} /></>)}
          </LiquidButton>
        </form>
        <p className="mt-5 text-xs text-center text-foreground/55">
          Already a member? <Link to="/login" className="text-foreground underline-link">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
