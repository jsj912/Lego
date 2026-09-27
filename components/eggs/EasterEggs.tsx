"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IsoStack, type IsoItem } from "@/components/ui/IsoStack";
import { useMotionSafe } from "@/hooks/useMotionSafe";
import { BRICK_SHADES, brickColorAt } from "@/lib/bricks";
import { STUD_IDS, useFoundStuds } from "./studStore";

// A tiny original castle, the reward for finding every hidden stud.
const CASTLE: IsoItem[] = [
  { kind: "plate", color: "green", w: 6, h: 4, x: 0, y: 0, z: 0 },
  { color: "grey", w: 4, h: 1, x: 1, y: 2.5, z: 1 },
  { color: "grey", w: 4, h: 1, x: 1, y: 2.5, z: 4, decals: [{ face: "front", a: 1.55, z: 0, w: 0.9, h: 1.1, fill: "#3a2a1c" }] },
  { color: "grey", w: 1, h: 1, x: 1, y: 2.5, z: 7 },
  { color: "grey", w: 1, h: 1, x: 2.5, y: 2.5, z: 7 },
  { color: "grey", w: 1, h: 1, x: 4, y: 2.5, z: 7 },
  ...[0, 5].flatMap((x) => [1, 4, 7, 10].map((z) => ({ color: "grey" as const, w: 1, h: 1, x, y: 2.5, z }))),
  { kind: "round", color: "red", x: 0, y: 2.5, z: 13 },
  { kind: "round", color: "blue", x: 5, y: 2.5, z: 13 },
];

function CastlePanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      role="status"
      data-castle-panel
      className="fixed bottom-4 right-4 z-toast flex w-72 items-end gap-3 rounded-2xl bg-surface p-4 shadow-[var(--shadow-deep)] ring-1 ring-ink/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <IsoStack items={CASTLE} size={11} />
      <div className="min-w-0 pb-1">
        <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink-2">All five studs found</p>
        <p className="mt-1 font-display font-semibold leading-snug">You built a castle. Nice eye.</p>
      </div>
      <button type="button" onClick={onClose} aria-label="Close" className="absolute right-2 top-2 rounded-full p-1 text-ink-2 hover:bg-bg">
        <X size={16} aria-hidden />
      </button>
    </motion.div>
  );
}

type Drop = { id: number; x: number; delay: number; color: string; w: number; spin: number; fall: number };

/** Typing BUILD (outside a text field) rains bricks that stack into a tower, then fade. */
function BrickRain({ onDone }: { onDone: () => void }) {
  const { reduced } = useMotionSafe();
  const [drops] = useState<Drop[]>(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      color: BRICK_SHADES[brickColorAt(i)].base,
      w: 28 + (i % 3) * 10,
      spin: (Math.random() - 0.5) * 90,
      fall: 1.6 + Math.random(),
    })),
  );
  useEffect(() => {
    const t = window.setTimeout(onDone, reduced ? 1600 : 3600);
    return () => window.clearTimeout(t);
  }, [onDone, reduced]);

  if (reduced) {
    return (
      <div role="status" data-brick-rain className="fixed inset-x-0 top-24 z-toast mx-auto w-fit rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-lg">
        BUILD mode unlocked.
      </div>
    );
  }
  const tower = drops.slice(0, 12);
  return (
    <div aria-hidden data-brick-rain className="pointer-events-none fixed inset-0 z-toast overflow-hidden">
      {drops.map((d, i) => {
        const inTower = i < tower.length;
        return (
          <motion.span
            key={d.id}
            className="absolute top-0 block h-4 rounded-[3px] shadow-[inset_0_-3px_0_rgba(0,0,0,0.2)]"
            style={{ width: d.w, background: d.color, left: `calc(${d.x}vw - ${d.w / 2}px)` }}
            initial={{ y: -40, rotate: d.spin, opacity: 1 }}
            animate={
              inTower
                ? { y: ["-5vh", "70vh", `calc(88vh - ${i * 17}px)`], x: ["0vw", "0vw", `${50 - d.x}vw`], rotate: [0, 30, 0], opacity: [1, 1, 1, 0] }
                : { y: ["-5vh", "105vh"], rotate: [0, 180], opacity: [1, 1] }
            }
            transition={
              inTower
                ? { duration: 3.2, delay: d.delay, times: [0, 0.35, 0.7], opacity: { duration: 3.4, delay: d.delay, times: [0, 0.3, 0.85, 1] } }
                : { duration: d.fall, delay: d.delay, ease: "easeIn" }
            }
          />
        );
      })}
    </div>
  );
}

/** Mounted once on the home page: castle reward panel + BUILD keyword listener. */
export default function EasterEggs() {
  const found = useFoundStuds();
  const complete = STUD_IDS.every((id) => found.has(id));
  const [dismissed, setDismissed] = useState(false);
  const [raining, setRaining] = useState(false);
  const buffer = useRef("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key.length !== 1) return;
      buffer.current = (buffer.current + e.key.toUpperCase()).slice(-5);
      if (buffer.current === "BUILD") {
        buffer.current = "";
        setRaining(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <span hidden data-eggs-ready />
      <AnimatePresence>{complete && !dismissed && <CastlePanel onClose={() => setDismissed(true)} />}</AnimatePresence>
      {raining && <BrickRain onDone={() => setRaining(false)} />}
    </>
  );
}
