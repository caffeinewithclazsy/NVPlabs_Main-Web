import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";
import { GoogleSignInButton } from "../components/GoogleSignInButton";
import { Logo } from "../components/Logo";
import { useAuth } from "../lib/auth";

function AuthCard({ kicker, title, subtitle, buttonLabel, footerText, footerCta, footerHref, testid }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-32 grid-pattern">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card !p-8 md:!p-10 w-full max-w-md"
        data-testid={testid}
      >
        <Link to="/" className="inline-block mb-7"><Logo size="md" /></Link>
        <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-nvp-red font-semibold mb-3">{kicker}</div>
        <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight leading-tight">{title}</h1>
        <p className="mt-2 text-sm text-foreground/65 leading-relaxed">{subtitle}</p>

        <div className="mt-7">
          <GoogleSignInButton label={buttonLabel} testid={`${testid}-google`} />
        </div>

        <ul className="mt-7 space-y-2.5 text-xs text-foreground/65">
          <li className="flex items-start gap-2"><ShieldCheck className="h-3.5 w-3.5 text-nvp-red mt-0.5 shrink-0" strokeWidth={2} /> Secure sign-in via Google — we never see your password.</li>
          <li className="flex items-start gap-2"><Sparkles className="h-3.5 w-3.5 text-nvp-red mt-0.5 shrink-0" strokeWidth={2} /> Admins get the CMS, clients get their project portal.</li>
        </ul>

        <p className="mt-7 text-xs text-center text-foreground/55">
          {footerText} <Link to={footerHref} className="text-foreground underline-link font-medium">{footerCta}</Link>
        </p>
      </motion.div>
    </div>
  );
}

export function Login() {
  const { user } = useAuth();
  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  return (
    <AuthCard
      kicker="Sign in"
      title="Welcome back."
      subtitle="Sign in with Google to access your dashboard or the NVP Labs CMS."
      buttonLabel="Continue with Google"
      footerText="New here?"
      footerCta="Create an account"
      footerHref="/register"
      testid="login-card"
    />
  );
}

export function Register() {
  const { user } = useAuth();
  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  return (
    <AuthCard
      kicker="Sign up"
      title="Create your account."
      subtitle="One click with Google — no passwords to remember."
      buttonLabel="Sign up with Google"
      footerText="Already a member?"
      footerCta="Sign in"
      footerHref="/login"
      testid="register-card"
    />
  );
}
