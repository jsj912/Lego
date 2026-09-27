"use client";

import dynamic from "next/dynamic";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useCallback, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Hobby } from "@/content/offTheClock";
import { IsoStack, type IsoItem } from "@/components/ui/IsoStack";
import { useMotionSafe } from "@/hooks/useMotionSafe";
import type { Photo } from "@/lib/assets";
import type { BrickColor } from "@/lib/bricks";
import { Shopfront } from "./Shopfront";
import { BrickCloud, BrickHills, StreetProp } from "./Village";

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

export function Street({ hobbies, photos }: { hobbies: Hobby[]; photos: Record<string, Photo[]> }) {
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
  const hillX = useTransform(scrollYProgress, (p) => -p * travel * 0.45);
  const cloudX = useTransform(scrollYProgress, (p) => -p * travel * 0.2);
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

  const shopEls = hobbies.map((h, i) => (
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
  const shops = shopEls.flatMap((el, i) => (i < shopEls.length - 1 ? [el, <StreetProp key={`prop-${i}`} i={i} />] : [el]));

  const ground = (
    <>
      <div aria-hidden className="grass-plate absolute inset-x-0 bottom-[84px] h-7" />
      <div aria-hidden className="road-plate absolute inset-x-0 bottom-4 h-[68px] rounded-b-md" />
    </>
  );
  const clouds = (
    <>
      <span className="absolute left-[4vw] top-6"><BrickCloud w={130} /></span>
      <span className="absolute left-[34vw] top-16"><BrickCloud w={96} /></span>
      <span className="absolute left-[62vw] top-4"><BrickCloud w={150} /></span>
      <span className="absolute left-[96vw] top-14"><BrickCloud w={110} /></span>
      <span className="absolute left-[130vw] top-8"><BrickCloud w={130} /></span>
    </>
  );

  return (
    <>
      {mode === "scroll" && (
        <div ref={sectionRef} className="relative" style={{ height: travel + dims.vh }} data-street-mode="scroll">
          <div className="village-sky sticky top-0 flex h-dvh flex-col justify-center overflow-hidden">
            <motion.div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40" style={{ x: cloudX }}>
              {clouds}
            </motion.div>
            {/* the track and the walker share this box, so the walker stands on the road */}
            <div className="relative">
              <motion.div aria-hidden className="pointer-events-none absolute bottom-[104px] left-0" style={{ x: hillX }}>
                <BrickHills />
              </motion.div>
              <motion.div ref={trackRef} className="relative flex w-max items-end gap-10 px-10 pb-24" style={{ x: trackX }}>
                {ground}
                <div aria-hidden className="shrink-0 self-end">
                  <IsoStack items={giantBook("blue")} size={34} />
                </div>
                {shops}
                <div aria-hidden className="shrink-0 self-end">
                  <IsoStack items={giantBook("red")} size={34} />
                </div>
              </motion.div>
              {/* the builder walking along the street */}
              <motion.div ref={figRef} aria-hidden className="pointer-events-none absolute bottom-7 left-0 z-10" style={{ x: figX }}>
                <div className="walk-bob">
                  <Minifig height={130} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {mode === "row" && (
        <div className="village-sky relative overflow-x-auto pb-6" data-street-mode="row">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40">{clouds}</div>
          <div className="relative flex w-max items-end gap-10 px-10 pb-24 pt-24">
            <div aria-hidden className="pointer-events-none absolute bottom-[104px] left-0">
              <BrickHills />
            </div>
            {ground}
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
          </div>
        </div>
      )}

      {mode === "stack" && (
        <div className="village-sky relative mx-auto flex flex-col items-center gap-12 px-4 pb-16 pt-6" data-street-mode="stack">
          <div aria-hidden className="flex items-end gap-6">
            <IsoStack items={giantBook("blue")} size={14} />
            <Minifig height={110} />
            <IsoStack items={giantBook("red")} size={14} />
          </div>
          {shopEls}
        </div>
      )}

      {hobby && <HobbyPanel hobby={hobby} photos={photos[hobby.id] ?? []} onClose={close} />}
    </>
  );
}
