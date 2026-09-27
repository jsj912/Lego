"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SECTIONS, type SectionId } from "@/lib/sections";

type Ctx = {
  register: (id: SectionId, el: HTMLElement | null) => void;
  active: SectionId | null;
  placed: ReadonlySet<SectionId>;
  complete: boolean;
};

const SectionProgressContext = createContext<Ctx | null>(null);

/**
 * The single scroll source for the page. Sections register their element;
 * one window scroll subscription decides which section is active and which
 * have been "placed" (≥ half scrolled into view). Placed only ever grows.
 */
export function SectionProgressProvider({ children }: { children: ReactNode }) {
  const els = useRef(new Map<SectionId, HTMLElement>());
  const [active, setActive] = useState<SectionId | null>(null);
  const [placed, setPlaced] = useState<ReadonlySet<SectionId>>(() => new Set());
  const { scrollY } = useScroll();

  const measure = useCallback(() => {
    const vh = window.innerHeight;
    const bottom = window.scrollY + vh;
    const atEnd = bottom >= document.documentElement.scrollHeight - 2;
    const mid = window.scrollY + vh * 0.4;
    let current: SectionId | null = null;
    const newly: SectionId[] = [];

    for (const { id } of SECTIONS) {
      const el = els.current.get(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const h = el.offsetHeight || 1;
      const seen = (bottom - top) / Math.min(h, vh);
      if (seen >= 0.5 || (atEnd && top < bottom)) newly.push(id);
      if (top <= mid) current = id;
    }
    if (atEnd) current = SECTIONS[SECTIONS.length - 1].id;

    setActive((prev) => (prev === current ? prev : current));
    setPlaced((prev) => {
      if (newly.every((id) => prev.has(id))) return prev;
      const next = new Set(prev);
      newly.forEach((id) => next.add(id));
      return next;
    });
  }, []);

  useMotionValueEvent(scrollY, "change", measure);
  useEffect(() => {
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const register = useCallback(
    (id: SectionId, el: HTMLElement | null) => {
      if (el) els.current.set(id, el);
      else els.current.delete(id);
      requestAnimationFrame(measure);
    },
    [measure],
  );

  const value = useMemo<Ctx>(
    () => ({ register, active, placed, complete: placed.size === SECTIONS.length }),
    [register, active, placed],
  );

  return <SectionProgressContext.Provider value={value}>{children}</SectionProgressContext.Provider>;
}

export function useSectionProgress(): Ctx {
  const ctx = useContext(SectionProgressContext);
  if (!ctx) {
    return { register: () => {}, active: null, placed: new Set(), complete: false };
  }
  return ctx;
}
