"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { builds } from "@/content/site";
import { useMotionSafe } from "@/hooks/useMotionSafe";
import { buildBySlug, KIND_LABEL } from "@/lib/derive";
import { Booklet } from "./Booklet";
import { manualPages } from "./pages";

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

/** Full-screen manual dialog: focus trapped, body scroll locked, Esc closes. */
export default function ManualOverlay({ slug, onClose }: { slug: string; onClose: () => void }) {
  const build = buildBySlug(slug);
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { reduced } = useMotionSafe();

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      html.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;
      const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !ref.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !ref.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!build) return null;
  const pages = manualPages(build);

  return (
    <motion.div
      className="fixed inset-0 z-modal flex items-center justify-center bg-[#141413]/80 p-3 backdrop-blur-sm sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manual-title"
        data-manual-dialog={slug}
        className="on-dark bp-dark flex h-[min(820px,94dvh)] w-[min(1180px,96vw)] flex-col rounded-[var(--radius-panel)] bg-surface-dark p-4 text-ink-inverse shadow-2xl ring-1 ring-white/10 sm:p-6"
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.88, y: 30, rotateX: 8 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        transition={reduced ? { duration: 0.15 } : { type: "spring", stiffness: 260, damping: 26 }}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-xs tracking-[0.18em] text-ink-inverse-2">
              SET {build.set} · {KIND_LABEL[build.kind].toUpperCase()} · INSTRUCTION MANUAL
            </p>
            <h2 id="manual-title" className="truncate text-lg font-semibold sm:text-xl">
              {build.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close manual"
            data-manual-close
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/20"
          >
            <X size={20} aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1">
          <Booklet build={build} index={builds.indexOf(build)} pages={pages} />
        </div>
      </motion.div>
    </motion.div>
  );
}
