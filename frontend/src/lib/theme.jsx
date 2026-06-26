import { createContext, useContext, useEffect, useState } from "react";

const ThemeCtx = createContext({ theme: "light", toggle: () => {}, isAuto: true });

function systemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  // 'auto' means follow system; 'light'/'dark' means user override
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return "auto";
    return localStorage.getItem("nvp-theme") || "auto";
  });
  const [sysTheme, setSysTheme] = useState(systemTheme);

  // Listen for OS theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setSysTheme(e.matches ? "dark" : "light");
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const theme = mode === "auto" ? sysTheme : mode;

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  useEffect(() => {
    if (mode === "auto") localStorage.removeItem("nvp-theme");
    else localStorage.setItem("nvp-theme", mode);
  }, [mode]);

  // Toggle cycles: follow-system → manual-opposite-of-current → follow-system
  const toggle = () => {
    setMode((m) => {
      if (m === "auto") return sysTheme === "dark" ? "light" : "dark";
      // already manual — flip to other, but if it equals system, go back to auto
      const next = m === "dark" ? "light" : "dark";
      return next === sysTheme ? "auto" : next;
    });
  };

  return (
    <ThemeCtx.Provider value={{ theme, toggle, isAuto: mode === "auto", mode }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
