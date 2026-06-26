import { cn } from "../lib/utils";

/**
 * Premium typographic logo for NVP Labs.
 * Pure CSS — no image asset required.
 */
export function Logo({ className = "", showText = true, size = "md" }) {
  const sizes = {
    sm: { box: "h-7 w-7", text: "text-base", dot: "h-1.5 w-1.5" },
    md: { box: "h-9 w-9", text: "text-lg", dot: "h-2 w-2" },
    lg: { box: "h-12 w-12", text: "text-2xl", dot: "h-2.5 w-2.5" },
  };
  const s = sizes[size];
  return (
    <div className={cn("flex items-center gap-2.5", className)} data-testid="nvp-logo">
      <div
        className={cn(
          "relative inline-flex items-center justify-center rounded-xl bg-nvp-black dark:bg-white",
          s.box
        )}
      >
        <span className={cn("font-display font-extrabold text-white dark:text-nvp-black leading-none", s.text)}>
          N
        </span>
        <span
          className={cn(
            "absolute -top-0.5 -right-0.5 rounded-full bg-nvp-red",
            s.dot
          )}
        />
      </div>
      {showText && (
        <div className="flex items-baseline gap-1">
          <span className="font-display font-extrabold tracking-tight text-base sm:text-lg">NVP</span>
          <span className="font-display font-light tracking-wider text-base sm:text-lg text-foreground/70">Labs</span>
        </div>
      )}
    </div>
  );
}
