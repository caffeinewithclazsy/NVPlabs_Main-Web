import { forwardRef } from "react";
import { cn } from "../lib/utils";

/**
 * Apple-style Liquid Glass button with shine, reflection and magnetic feel.
 * Variants: primary (red), glass (default), ghost (outlined)
 */
export const LiquidButton = forwardRef(function LiquidButton(
  { children, variant = "glass", size = "md", className = "", as: As = "button", ...props },
  ref
) {
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-7 py-3.5 text-base",
    xl: "px-9 py-4 text-base",
  };
  const variants = {
    glass: "lgb-light",
    primary: "lgb-primary",
    ghost: "lgb-ghost",
  };
  return (
    <As
      ref={ref}
      className={cn(
        "liquid-glass-btn inline-flex items-center justify-center gap-2 rounded-full font-display font-medium tracking-tight select-none",
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </As>
  );
});
