"use client";

import dynamic from "next/dynamic";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useCallback, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Hobby } from "@/content/offTheClock";
import { IsoStack, type IsoItem } from "@/components/ui/IsoStack";
import { useMotionSafe } from "@/hooks/useMotionSafe";
import type { BrickColor } from "@/lib/bricks";
import { Shopfront } from "./Shopfront";

const HobbyPanel = dynamic(() => import("./HobbyPanel"), { ssr: false });

const DESKTOP = "(min-width: 1024px)";
function useDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(DESKTOP);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(DESKTOP).matches,
    () => true,
  );
}

/** A giant brick-built book standing at the end of the street. */
function giantBook(color: BrickColor): IsoItem[] {
  const levels = [0, 3, 6, 9, 12, 15, 18];
  return levels.map((z, i) => ({
    color,
    w: 2,
    h: 6,
    x: 0,
    y: 0,
    z,
    studs: i === levels.length - 1,
    decals:
      i === 0 || i === levels.length - 1
        ? [{ face: "front" as const, a: 0.12, z: i === 0 ? 0.35 : 0.5, w: 1.76, h: 0.18, fill: "#d4a72c" }]
        : i === 3
          ? [{ face: "front" as const, a: 0.35, z: 0.2, w: 1.3, h: 0.8, fill: "#d4a72c" }]
          : [],
  }));
}

function Minifig({ height = 120 }: { height?: number }) {
  return (
    <picture>
      <source srcSet="/minifig.webp" type="image/webp" />
      <img src="/minifig.png" alt="" aria-hidden width={Math.round((height * 472) / 900)} height={height} loading="lazy" decoding="async" className="block select-none" draggable={false} />
    </picture>
  );
}

export function Street({ hobbies, photos }: { hobbies: Hobby[]; photos: Record<string, string[]> }) {
  const desktop = useDesktop();
  const { reduced } = useMotionSafe();
  const mode = desktop ? (reduced ? "row" : "scroll") : "stack";

  const [open, setOpen] = useState<Hobby["id"] | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const openHobby = (id: Hobby["id"], el: HTMLElement) => {
    trigger.current = el;
    setOpen(id);
  };
  const close = useCallback(() => {
    setOpen(null);
    requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
  }, []);

  // ── scroll-driven street (desktop, motion allowed) ──
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const figRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ track: 2400, vw: 1440, vh: 900 });
  useLayoutEffect(() => {
    if (mode !== "scroll") return;
    const measure = () =>
      setDims({ track: trackRef.current?.scrollWidth ?? 2400, vw: window.innerWidth, vh: window.innerHeight });
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [mode]);
  const travel = Math.max(0, dims.track - dims.vw);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const trackX = useTransform(scrollYProgress, (p) => -p * travel);
  const figX = useTransform(scrollYProgress, (p) => 60 + p * Math.max(0, dims.vw - 220));
  const stopTimer = useRef<number | undefined>(undefined);
  useMotionValueEvent(scrollYProgress, "change", () => {
    const el = figRef.current;
    if (!el) return;
    el.style.setProperty("--walk", "running");
    window.clearTimeout(stopTimer.current);
    stopTimer.current = window.setTimeout(() => el.style.setProperty("--walk", "paused"), 160);
  });

  const hobby = hobbies.find((h) => h.id === open);

  const shops = hobbies.map((h, i) => (
    <motion.div
      key={h.id}
      className="shrink-0"
      initial={mode === "scroll" ? false : { opacity: 0, y: reduced ? 0 : 16 }}
      whileInView={mode === "scroll" ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: mode === "row" ? i * 0.05 : 0 }}
    >
      <Shopfront hobby={h} photoCount={photos[h.id]?.length ?? 0} onOpen={(el) => openHobby(h.id, el)} />
    </motion.div>
  ));

  return (
    <>
      {mode === "scroll" && (
        <div ref={sectionRef} className="relative" style={{ height: travel + dims.vh }} data-street-mode="scroll">
          <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden">
            {/* the track and the walker share this box, so the walker stands on the road */}
            <div className="relative">
              <motion.div ref={trackRef} className="relative flex w-max items-end gap-10 px-10 pb-24" style={{ x: trackX }}>
                <div aria-hidden className="shrink-0 self-end">
                  <IsoStack items={giantBook("blue")} size={34} />
                </div>
                {shops}
                <div aria-hidden className="shrink-0 self-end">
                  <IsoStack items={giantBook("red")} size={34} />
                </div>
                {/* the street */}
                <div aria-hidden className="street-road absolute inset-x-0 bottom-6 h-16 rounded-md" />
              </motion.div>
              {/* the builder walking along the street */}
              <motion.div ref={figRef} aria-hidden className="pointer-events-none absolute bottom-9 left-0 z-10" style={{ x: figX }}>
                <div className="walk-bob">
                  <Minifig height={130} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {mode === "row" && (
        <div className="relative overflow-x-auto pb-6" data-street-mode="row">
          <div className="relative flex w-max items-end gap-10 px-10 pb-24">
            <div aria-hidden className="shrink-0">
              <IsoStack items={giantBook("blue")} size={30} />
            </div>
            <div aria-hidden className="shrink-0 self-end pb-2">
              <Minifig height={130} />
            </div>
            {shops}
            <div aria-hidden className="shrink-0">
              <IsoStack items={giantBook("red")} size={30} />
            </div>
            <div aria-hidden className="street-road absolute inset-x-0 bottom-6 h-16 rounded-md" />
          </div>
        </div>
      )}

      {mode === "stack" && (
        <div className="relative mx-auto flex max-w-md flex-col items-center gap-12 px-4 pb-16" data-street-mode="stack">
          <div aria-hidden className="flex items-end gap-6">
            <IsoStack items={giantBook("blue")} size={14} />
            <Minifig height={110} />
            <IsoStack items={giantBook("red")} size={14} />
          </div>
          {shops}
        </div>
      )}

      {hobby && <HobbyPanel hobby={hobby} photos={photos[hobby.id] ?? []} onClose={close} />}
    </>
  );
}
