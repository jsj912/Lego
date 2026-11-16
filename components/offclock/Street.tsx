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
import { Balloon, Birds, BrickCar, BrickSun, Bush, Cat, Flowers, Pond } from "./VillageLife";

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
      <Shopfront hobby={h} photos={(photos[h.id] ?? []).map((p) => p.src)} onOpen={(el) => openHobby(h.id, el)} />
    </motion.div>
  ));
  const shops = shopEls.flatMap((el, i) => (i < shopEls.length - 1 ? [el, <StreetProp key={`prop-${i}`} i={i} />] : [el]));

  // ground, back to front: grass verge, road with traffic, then a meadow that fills the rest of the view
  const ground = (
    <>
      <div aria-hidden className="grass-plate absolute inset-x-0 bottom-[calc(var(--meadow)+68px)] h-7" />
      <div aria-hidden className="road-plate absolute inset-x-0 bottom-[var(--meadow)] h-[68px] overflow-hidden">
        <span className="car-drive absolute bottom-1 left-0"><BrickCar color="red" /></span>
        <span className="car-drive car-drive-back absolute bottom-6 left-0"><BrickCar color="blue" flip /></span>
        <span className="car-drive absolute bottom-1 left-0" style={{ animationDelay: "-19s" }}><BrickCar color="yellow" /></span>
      </div>
      <div aria-hidden className="meadow-plate absolute inset-x-0 bottom-0 h-[var(--meadow)] overflow-hidden">
        <div className="picket absolute inset-x-0 top-0 h-6" />
        <span className="absolute bottom-3 left-[300px]"><Pond width={230} /></span>
        <span className="absolute bottom-6 left-[120px]"><Bush /></span>
        <span className="absolute bottom-10 left-[620px]"><Flowers /></span>
        <span className="absolute bottom-4 left-[760px]"><Cat /></span>
        <span className="absolute bottom-8 left-[980px]"><Bush size={80} /></span>
        <span className="absolute bottom-5 left-[1120px]"><Flowers colors={["#0055bf", "#ffffff", "#ffd500"]} /></span>
        <span className="absolute bottom-3 left-[1500px]"><Pond width={190} /></span>
        <span className="absolute bottom-9 left-[1380px]"><Flowers colors={["#ffd500", "#d01012", "#ffd500"]} /></span>
        <span className="absolute bottom-6 left-[1800px]"><Bush /></span>
        <span className="absolute bottom-8 left-[2040px]"><Flowers /></span>
        <span className="absolute bottom-3 left-[2260px]"><Pond width={220} /></span>
        <span className="absolute bottom-7 left-[2560px]"><Bush size={76} /></span>
        <span className="absolute bottom-5 left-[2720px]"><Flowers colors={["#ffffff", "#d01012", "#0055bf"]} /></span>
      </div>
    </>
  );
  const clouds = (
    <>
      <span className="absolute left-[4vw] top-6"><BrickCloud w={130} /></span>
      <span className="absolute left-[34vw] top-16"><BrickCloud w={96} /></span>
      <span className="absolute left-[62vw] top-4"><BrickCloud w={150} /></span>
      <span className="absolute left-[96vw] top-14"><BrickCloud w={110} /></span>
      <span className="absolute left-[130vw] top-8"><BrickCloud w={130} /></span>
      <span className="balloon-drift absolute left-[48vw] top-10"><Balloon /></span>
    </>
  );
  // things that stay put in the sky while the street moves
  const sky = (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="absolute right-[6vw] top-6"><BrickSun /></span>
      <span className="bird-fly absolute left-0 top-24"><Birds /></span>
    </div>
  );
  const meadowVar = { ["--meadow" as string]: "clamp(96px, 20vh, 210px)" };

  return (
    <>
      {mode === "scroll" && (
        <div ref={sectionRef} className="relative" style={{ height: travel + dims.vh }} data-street-mode="scroll">
          <div className="village-sky sticky top-0 flex h-dvh flex-col justify-end overflow-hidden" style={meadowVar}>
            {sky}
            <motion.div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40" style={{ x: cloudX }}>
              {clouds}
            </motion.div>
            {/* the track and the walker share this box, so the walker stands on the road */}
            <div className="relative">
              <motion.div aria-hidden className="pointer-events-none absolute bottom-[calc(var(--meadow)+88px)] left-0" style={{ x: hillX }}>
                <BrickHills />
                <div className="hill-fill h-[130px]" />
              </motion.div>
              <motion.div ref={trackRef} className="relative flex w-max items-end gap-10 px-10 pb-[calc(var(--meadow)+80px)]" style={{ x: trackX }}>
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
              <motion.div ref={figRef} aria-hidden className="pointer-events-none absolute bottom-[calc(var(--meadow)+12px)] left-0 z-10" style={{ x: figX }}>
                <div className="walk-bob">
                  <Minifig height={130} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {mode === "row" && (
        <div className="village-sky relative overflow-x-auto" style={meadowVar} data-street-mode="row">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40">{clouds}</div>
          <div className="relative flex w-max items-end gap-10 px-10 pb-[calc(var(--meadow)+80px)] pt-24">
            <div aria-hidden className="pointer-events-none absolute bottom-[calc(var(--meadow)+88px)] left-0">
              <BrickHills />
              <div className="hill-fill h-[130px]" />
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
        <div className="village-sky relative overflow-hidden" data-street-mode="stack">
          {/* the village on the hill, the sun, and the two books that bracket the street */}
          <div aria-hidden className="relative h-56 overflow-hidden">
            <span className="absolute right-4 top-3"><BrickSun size={70} /></span>
            <span className="absolute left-4 top-4"><BrickCloud w={90} /></span>
            <span className="bird-fly absolute left-0 top-16"><Birds /></span>
            <div className="absolute bottom-0 left-0">
              <BrickHills width={900} />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-6">
              <IsoStack items={giantBook("blue")} size={12} />
              <Minifig height={104} />
              <IsoStack items={giantBook("red")} size={12} />
            </div>
          </div>
          <div className="grass-plate h-5" aria-hidden />
          <div className="flex flex-col items-center gap-10 bg-[#e9f3e4] px-4 pb-12 pt-10">
            {shopEls.flatMap((el, i) =>
              i < shopEls.length - 1
                ? [el, <div key={`prop-${i}`} className="flex justify-center"><StreetProp i={i} bunting={false} /></div>]
                : [el],
            )}
          </div>
          {/* the road and the meadow at the end of the village */}
          <div aria-hidden className="road-plate relative h-[68px] overflow-hidden" style={{ ["--drive-to" as string]: "110vw", ["--drive-time" as string]: "9s" }}>
            <span className="car-drive absolute bottom-1 left-0"><BrickCar color="red" /></span>
            <span className="car-drive car-drive-back absolute bottom-6 left-0" style={{ animationDelay: "-4s" }}><BrickCar color="blue" flip /></span>
          </div>
          <div aria-hidden className="meadow-plate relative h-36 overflow-hidden">
            <div className="picket absolute inset-x-0 top-0 h-6" />
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2"><Pond width={210} /></span>
            <span className="absolute bottom-6 left-2"><Flowers /></span>
            <span className="absolute bottom-5 right-2"><Cat /></span>
          </div>
        </div>
      )}

      {hobby && <HobbyPanel hobby={hobby} photos={photos[hobby.id] ?? []} onClose={close} />}
    </>
  );
}
