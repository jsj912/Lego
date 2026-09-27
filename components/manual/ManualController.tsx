"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionSafe } from "@/hooks/useMotionSafe";
import { buildBySlug } from "@/lib/derive";

const ManualOverlay = dynamic(() => import("./ManualOverlay"), { ssr: false });

type Ctx = { opening: string | null; open: string | null };
const ManualContext = createContext<Ctx>({ opening: null, open: null });
export const useManual = () => useContext(ManualContext);

const ROUTE = /^\/builds\/([^/?#]+)\/?$/;

/**
 * Opens the instruction manual over the home page. Any in-page link to
 * /builds/[slug] is intercepted: the box lid lifts, the manual opens and the
 * URL becomes /builds/[slug] via the History API (Back closes it). Direct
 * visits to that URL render the standalone route instead.
 */
export function ManualController({ children }: { children: ReactNode }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [opening, setOpening] = useState<string | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const pushed = useRef(false);
  const { reduced } = useMotionSafe();

  const openManual = useCallback(
    (slug: string, from: HTMLElement) => {
      trigger.current = from;
      setOpening(slug);
      window.setTimeout(
        () => {
          setOpenSlug(slug);
          setOpening(null);
          window.history.pushState({ manual: slug }, "", `/builds/${slug}`);
          pushed.current = true;
        },
        reduced ? 0 : 340,
      );
    },
    [reduced],
  );

  const close = useCallback(() => {
    if (pushed.current) {
      window.history.back();
    } else {
      setOpenSlug(null);
      window.history.replaceState(window.history.state, "", "/");
    }
  }, []);

  // intercept in-page links to manuals
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const m = ROUTE.exec(url.pathname);
      if (!m || !buildBySlug(m[1])) return;
      e.preventDefault();
      openManual(m[1], a);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [openManual]);

  // Back / Forward
  useEffect(() => {
    const onPop = () => {
      const m = ROUTE.exec(window.location.pathname);
      if (m && buildBySlug(m[1])) {
        setOpenSlug(m[1]);
      } else {
        pushed.current = false;
        setOpenSlug(null);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // return focus to the originating link when the manual closes
  const wasOpen = useRef(false);
  useEffect(() => {
    if (openSlug) {
      wasOpen.current = true;
    } else if (wasOpen.current) {
      wasOpen.current = false;
      const el = trigger.current;
      // Next's router may run its own hash scroll/focus after Back, so re-assert briefly.
      const restore = () => {
        if (el && document.contains(el) && document.activeElement !== el) el.focus({ preventScroll: true });
      };
      restore();
      requestAnimationFrame(restore);
      const timers = [60, 180, 400].map((ms) => window.setTimeout(restore, ms));
      return () => timers.forEach(window.clearTimeout);
    }
  }, [openSlug]);

  return (
    <ManualContext.Provider value={{ opening, open: openSlug }}>
      {children}
      {openSlug && <ManualOverlay key={openSlug} slug={openSlug} onClose={close} />}
    </ManualContext.Provider>
  );
}
