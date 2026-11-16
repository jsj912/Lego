"use client";

import { useEffect } from "react";

const MAX_STAGGER = 6;

/**
 * Page-wide, DOM-only effects (renders nothing):
 *  - cursor light: `[data-cursor-light]` layers follow the pointer through --lx / --ly
 *  - snap-in: `[data-reveal]` elements below the fold drop into place when scrolled to
 * Both are skipped for reduced motion; without JS everything is simply visible.
 */
export function PageEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cleanups: (() => void)[] = [];

    // cursor light (mouse / trackpad only)
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const layers = [...document.querySelectorAll<HTMLElement>("[data-cursor-light]")];
      let raf = 0;
      let px = 0;
      let py = 0;
      const paint = () => {
        raf = 0;
        for (const el of layers) {
          const b = el.getBoundingClientRect();
          if (b.bottom < 0 || b.top > window.innerHeight) continue;
          el.style.setProperty("--lx", `${Math.round(px - b.left)}px`);
          el.style.setProperty("--ly", `${Math.round(py - b.top)}px`);
        }
      };
      const onMove = (e: PointerEvent) => {
        px = e.clientX;
        py = e.clientY;
        if (!raf) raf = requestAnimationFrame(paint);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("pointermove", onMove);
        if (raf) cancelAnimationFrame(raf);
      });
    }

    // snap-in on scroll
    if (typeof IntersectionObserver !== "undefined") {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            io.unobserve(el);
            el.dataset.reveal = "in";
            el.addEventListener("animationend", () => (el.dataset.reveal = "done"), { once: true });
          }
        },
        { rootMargin: "0px 0px -60px 0px", threshold: 0.12 },
      );
      const counts = new Map<Element | null, number>();
      for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
        // already on screen at load: leave it alone, no flash
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) continue;
        const i = counts.get(el.parentElement) ?? 0;
        counts.set(el.parentElement, i + 1);
        el.style.setProperty("--reveal-i", String(i % MAX_STAGGER));
        el.dataset.reveal = "pending";
        io.observe(el);
      }
      // jumped past (nav link, End key): show it without the drop, so nothing animates on the way back up
      let sraf = 0;
      const sweep = () => {
        sraf = 0;
        for (const el of document.querySelectorAll<HTMLElement>('[data-reveal="pending"]')) {
          if (el.getBoundingClientRect().bottom < 0) {
            io.unobserve(el);
            el.dataset.reveal = "done";
          }
        }
      };
      const onScroll = () => {
        if (!sraf) sraf = requestAnimationFrame(sweep);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        if (sraf) cancelAnimationFrame(sraf);
        io.disconnect();
        for (const el of document.querySelectorAll<HTMLElement>('[data-reveal="pending"]')) el.dataset.reveal = "done";
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
