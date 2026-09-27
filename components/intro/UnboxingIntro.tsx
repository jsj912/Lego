"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { IsoStack } from "@/components/ui/IsoStack";

const KEY = "brick-portfolio:intro-seen";
const DURATION = 2400; // ms, ≤ 2.5s

function shouldPlay(): boolean {
  if (typeof window === "undefined") return false;
  if (window.location.pathname !== "/" || window.location.hash) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    if (window.sessionStorage.getItem(KEY)) return false;
    window.sessionStorage.setItem(KEY, "1");
  } catch {
    // storage blocked: still play once for this page view
  }
  return true;
}

const BRICKS = [
  { color: "red", x: -150, y: -120, r: -30 },
  { color: "blue", x: 140, y: -140, r: 25 },
  { color: "yellow", x: -120, y: 90, r: 40 },
  { color: "green", x: 160, y: 80, r: -20 },
  { color: "white", x: 0, y: -170, r: 15 },
] as const;

/**
 * Plays once per session on "/": a sealed box, the lid lifts, bricks fly out.
 * The hero is already rendered underneath; this overlay never takes pointer
 * events except for its Skip button, and ends on its own, on Skip, Esc or scroll.
 */
export default function UnboxingIntro() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!shouldPlay()) return;
    const start = window.setTimeout(() => setOpen(true), 0);
    const end = window.setTimeout(() => setOpen(false), DURATION);
    const stop = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && stop();
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchmove", stop, { passive: true });
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(end);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="intro"
          data-intro
          className="pointer-events-none fixed inset-0 z-intro flex items-center justify-center bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div aria-hidden className="relative flex h-72 w-72 items-center justify-center">
            {/* bricks flying out */}
            {BRICKS.map((b, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ x: 0, y: 30, scale: 0.4, opacity: 0 }}
                animate={{ x: b.x, y: b.y, scale: 1, opacity: 1, rotate: b.r }}
                transition={{ delay: 0.9 + i * 0.08, type: "spring", stiffness: 140, damping: 14 }}
              >
                <IsoStack items={[{ color: b.color, w: 2, h: 2 }]} size={18} shadow={false} />
              </motion.div>
            ))}
            {/* the box */}
            <div className="relative h-36 w-44">
              <div className="absolute inset-x-0 bottom-0 h-28 rounded-md bg-brick-red shadow-[var(--shadow-deep)]">
                <div className="absolute inset-x-4 top-5 h-10 rounded bg-white/90" />
                <p className="absolute inset-x-0 top-8 text-center font-mono text-[0.7rem] font-bold tracking-[0.2em] text-brick-red">SET 000</p>
                <p className="absolute inset-x-0 bottom-3 text-center font-display text-sm font-semibold text-white">The Builder</p>
              </div>
              <motion.div
                className="absolute inset-x-[-6px] top-0 h-9 origin-bottom-left rounded-md bg-[#a60b0d] shadow-md"
                initial={{ rotate: 0, y: 0 }}
                animate={{ rotate: -38, y: -24, x: -10 }}
                transition={{ delay: 0.55, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            data-intro-skip
            className="pointer-events-auto absolute bottom-8 right-8 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-lg"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
