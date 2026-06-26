import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, Monitor } from "lucide-react";
import { LiquidButton } from "./LiquidButton";
import { Logo } from "./Logo";
import { useTheme } from "../lib/theme";
import { NAV_LINKS } from "../lib/data";
import { cn } from "../lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle, isAuto } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 nav-blur transition-all duration-500",
        scrolled ? "py-2" : "py-4"
      )}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
        <Link to="/" className="shrink-0" data-testid="nav-logo-link">
          <Logo size={scrolled ? "sm" : "md"} />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                cn(
                  "px-3.5 py-2 text-sm font-medium rounded-full transition-colors",
                  isActive
                    ? "text-foreground bg-foreground/5"
                    : "text-foreground/65 hover:text-foreground hover:bg-foreground/5"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label={isAuto ? `Theme: following system (${theme})` : `Theme: ${theme}`}
            title={isAuto ? `Following system • ${theme}` : `Manual • ${theme}`}
            data-testid="theme-toggle"
            className="liquid-glass-btn lgb-light h-10 w-10 rounded-full inline-flex items-center justify-center relative"
          >
            {isAuto ? (
              <Monitor className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <>
                <Sun className="h-4 w-4 hidden dark:block" strokeWidth={1.75} />
                <Moon className="h-4 w-4 block dark:hidden" strokeWidth={1.75} />
              </>
            )}
            {isAuto && <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-nvp-red" />}
          </button>
          <Link to="/contact" className="hidden md:inline-flex" data-testid="nav-get-started">
            <LiquidButton variant="primary" size="md">
              Get Started
            </LiquidButton>
          </Link>
          <button
            className="lg:hidden liquid-glass-btn lgb-light h-10 w-10 rounded-full inline-flex items-center justify-center"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            data-testid="mobile-menu-toggle"
          >
            {open ? <X className="h-4 w-4" strokeWidth={1.75} /> : <Menu className="h-4 w-4" strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-foreground/5 bg-background/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                data-testid={`mnav-link-${l.label.toLowerCase()}`}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-3 rounded-xl text-sm font-medium",
                    isActive ? "bg-foreground/5 text-foreground" : "text-foreground/70"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/contact" className="mt-2">
              <LiquidButton variant="primary" className="w-full" data-testid="mobile-get-started">
                Get Started
              </LiquidButton>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
