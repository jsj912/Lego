"use client";

import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type PointerEvent, type ReactNode } from "react";
import type { Build } from "@/content/types";
import { useMotionSafe } from "@/hooks/useMotionSafe";
import { cn } from "@/lib/cn";
import { ManualPageView } from "./ManualPageView";
import { PAGE_TITLE, type ManualPage } from "./pages";

const SPREAD_QUERY = "(min-width: 1024px)";
const FLIP_MS = 720;

function useSpread(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(SPREAD_QUERY);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(SPREAD_QUERY).matches,
    () => false,
  );
}

type Flip = { dir: 1 | -1; front: ReactNode; back: ReactNode; target: number };

type Props = {
  build: Build;
  index: number;
  pages: ManualPage[];
  /** keyboard arrows are captured on window while true */
  captureKeys?: boolean;
};

/**
 * Instruction manual as a real booklet. Two-page spreads on wide screens,
 * single pages below 1024px. Pages turn with a CSS 3D rotateY flip and a
 * shading sweep; reduced motion swaps the flip for a crossfade.
 */
export function Booklet({ build, index, pages, captureKeys = true }: Props) {
  const spread = useSpread();
  const { reduced } = useMotionSafe();
  const n = pages.length;
  // spread mode: position s shows pages [2s-1, 2s]; single mode: position = page index
  const last = spread ? Math.floor(n / 2) : n - 1;
  const [pos, setPos] = useState(0);
  const [flip, setFlip] = useState<Flip | null>(null);
  const [fadeKey, setFadeKey] = useState(0);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  // keep position valid when switching layouts
  const [prevSpread, setPrevSpread] = useState(spread);
  if (prevSpread !== spread) {
    setPrevSpread(spread);
    setPos((p) => (spread ? Math.ceil(p / 2) : Math.max(0, p * 2 - 1)));
  }

  const page = (i: number, side: "left" | "right" | "single"): ReactNode => {
    if (i < 0 || i >= n) {
      return <div className={cn("bp-dots h-full bg-paper", side === "left" ? "rounded-l-2xl" : side === "right" ? "rounded-r-2xl" : "rounded-2xl")} />;
    }
    return (
      <ManualPageView
        page={pages[i]}
        build={build}
        index={index}
        className={side === "left" ? "rounded-l-2xl rounded-r-none" : side === "right" ? "rounded-r-2xl rounded-l-none" : "rounded-2xl"}
      />
    );
  };

  const visible = spread ? [2 * pos - 1, 2 * pos].filter((i) => i >= 0 && i < n) : [pos];
  const label = visible.length === 2 ? `${visible[0] + 1}–${visible[1] + 1} / ${n}` : `${visible[0] + 1} / ${n}`;
  const announce = visible.map((i) => `Page ${i + 1} of ${n}: ${PAGE_TITLE[pages[i].kind]}`).join(". ");

  const go = useCallback(
    (dir: 1 | -1) => {
      if (flip) return;
      const target = pos + dir;
      if (target < 0 || target > last) return;
      if (reduced) {
        setPos(target);
        setFadeKey((k) => k + 1);
        return;
      }
      if (spread) {
        const s = pos;
        setFlip(
          dir === 1
            ? { dir, front: page(2 * s, "right"), back: page(2 * s + 1, "left"), target }
            : { dir, front: page(2 * s - 2, "right"), back: page(2 * s - 1, "left"), target },
        );
      } else {
        setFlip(dir === 1 ? { dir, front: page(pos, "single"), back: <div className="h-full rounded-2xl bg-paper" />, target } : { dir, front: page(pos - 1, "single"), back: <div className="h-full rounded-2xl bg-paper" />, target });
      }
    },
    // page() closes over stable props
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flip, pos, last, reduced, spread, n],
  );

  useEffect(() => {
    if (!captureKeys) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.metaKey || e.ctrlKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [captureKeys, go]);

  function onDown(e: PointerEvent) {
    if (e.pointerType === "mouse") return;
    swipe.current = { x: e.clientX, y: e.clientY };
  }
  function onUp(e: PointerEvent) {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  }

  // what sits underneath while a leaf turns
  const s = pos;
  let underLeft = 2 * s - 1;
  let underRight = 2 * s;
  let underSingle = pos;
  if (flip) {
    if (flip.dir === 1) {
      underRight = 2 * s + 2;
      underSingle = pos + 1;
    } else {
      underLeft = 2 * s - 3;
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col" data-booklet data-page-pos={pos} data-page-last={last}>
      <div
        className="relative min-h-0 flex-1"
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (swipe.current = null)}
      >
        {spread ? (
          <div className="relative mx-auto grid h-full max-w-[1100px] grid-cols-2 rounded-2xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)] [perspective:2200px]">
            <div key={`l${fadeKey}`} className={cn("relative min-h-0", reduced && "animate-[fade-in_200ms_ease-out]")}>
              {page(underLeft, "left")}
            </div>
            <div key={`r${fadeKey}`} className={cn("relative min-h-0", reduced && "animate-[fade-in_200ms_ease-out]")}>
              {page(underRight, "right")}
            </div>
            {/* spine */}
            <div aria-hidden className="book-spine pointer-events-none absolute inset-y-0 left-1/2 w-16 -translate-x-1/2" />
            {flip && <Leaf flip={flip} spread onDone={() => { setPos(flip.target); setFlip(null); }} />}
          </div>
        ) : (
          <div className="relative mx-auto h-full max-w-[640px] rounded-2xl shadow-[0_30px_60px_-30px_rgba(0,0,0,0.55)] [perspective:1600px]">
            <div key={`s${fadeKey}`} className={cn("h-full", reduced && "animate-[fade-in_200ms_ease-out]")}>
              {page(underSingle, "single")}
            </div>
            {flip && <Leaf flip={flip} onDone={() => { setPos(flip.target); setFlip(null); }} />}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={pos === 0}
          aria-label="Previous page"
          data-manual-prev
          className="inline-flex h-11 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-ink shadow ring-1 ring-ink/10 disabled:opacity-40"
        >
          <ChevronLeft size={18} aria-hidden /> Prev
        </button>
        <p className="font-mono text-sm font-semibold text-current" data-page-indicator>
          {label}
        </p>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={pos === last}
          aria-label="Next page"
          data-manual-next
          className="inline-flex h-11 items-center gap-1.5 rounded-full bg-brick-yellow px-4 text-sm font-semibold text-ink shadow disabled:opacity-40"
        >
          Next <ChevronRight size={18} aria-hidden />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}

/** One turning leaf: front face on the right, back face revealed on the left. */
function Leaf({ flip, spread, onDone }: { flip: Flip; spread?: boolean; onDone: () => void }) {
  const from = flip.dir === 1 ? 0 : -180;
  const to = flip.dir === 1 ? -180 : 0;
  return (
    <motion.div
      className={cn("absolute inset-y-0 z-10 origin-left [transform-style:preserve-3d]", spread ? "left-1/2 right-0" : "inset-x-0")}
      initial={{ rotateY: from }}
      animate={{ rotateY: to }}
      transition={{ duration: FLIP_MS / 1000, ease: [0.45, 0.05, 0.25, 1] }}
      onAnimationComplete={onDone}
      data-leaf
    >
      <div className="absolute inset-0 shadow-[0_0_40px_rgba(0,0,0,0.25)] [backface-visibility:hidden]">
        {flip.front}
        <motion.div
          aria-hidden
          className={cn("pointer-events-none absolute inset-0 bg-gradient-to-l from-black/30 via-black/10 to-transparent", spread ? "rounded-r-2xl" : "rounded-2xl")}
          initial={{ opacity: flip.dir === 1 ? 0 : 0.8 }}
          animate={{ opacity: flip.dir === 1 ? 0.8 : 0 }}
          transition={{ duration: FLIP_MS / 1000 }}
        />
      </div>
      <div className="absolute inset-0 shadow-[0_0_40px_rgba(0,0,0,0.25)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
        {flip.back}
        <motion.div
          aria-hidden
          className={cn("pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent", spread ? "rounded-l-2xl" : "rounded-2xl")}
          initial={{ opacity: flip.dir === 1 ? 0.8 : 0 }}
          animate={{ opacity: flip.dir === 1 ? 0 : 0.8 }}
          transition={{ duration: FLIP_MS / 1000 }}
        />
      </div>
    </motion.div>
  );
}
