import { useEffect, useRef, useState } from "react";

export function CursorFollower() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) return;
    setEnabled(true);

    let dotX = 0, dotY = 0, ringX = 0, ringY = 0;
    let mx = 0, my = 0;
    let raf;

    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove);

    const onOver = (e) => {
      const t = e.target;
      const interactive = t.closest?.("a, button, input, textarea, [role='button']");
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0) scale(${interactive ? 1.6 : 1})`;
        ringRef.current.style.borderColor = interactive ? "#E10600" : "currentColor";
      }
    };
    document.addEventListener("mouseover", onOver);

    const tick = () => {
      dotX += (mx - dotX) * 0.85;
      dotY += (my - dotY) * 0.85;
      ringX += (mx - ringX) * 0.18;
      ringY += (my - ringY) * 0.18;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${dotX - 3}px, ${dotY - 3}px, 0)`;
      if (ringRef.current) {
        const scale = ringRef.current.style.transform.match(/scale\(([^)]+)\)/)?.[1] || "1";
        ringRef.current.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0) scale(${scale})`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="custom-cursor fixed top-0 left-0 h-9 w-9 rounded-full border-2 pointer-events-none opacity-70"
        style={{ borderColor: "#E10600", transition: "transform 0.18s, border-color 0.2s" }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="custom-cursor fixed top-0 left-0 h-1.5 w-1.5 rounded-full bg-white pointer-events-none"
      />
    </>
  );
}
