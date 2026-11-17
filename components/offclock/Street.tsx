"use client";

import dynamic from "next/dynamic";
import { DoorOpen } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import type { Hobby } from "@/content/offTheClock";
import { IsoStack, PLATE, type IsoProject } from "@/components/ui/IsoStack";
import type { Photo } from "@/lib/assets";
import { ROOF_TONES } from "./Buildings";
import { BrickCloud } from "./Village";
import { Balloon, Birds, BrickSun } from "./VillageLife";
import { CHIMNEYS, HOUSES, MILL_HUB, VILLAGE, VILLAGE_BOUNDS } from "./villageModel";

const HobbyPanel = dynamic(() => import("./HobbyPanel"), { ssr: false });

const ROOF: Record<Hobby["id"], string> = {
  books: ROOF_TONES.teal.base,
  running: ROOF_TONES.pink.base,
  flowers: ROOF_TONES.lavender.base,
  scrapbook: ROOF_TONES.yellow.base,
  "build-table": ROOF_TONES.mint.base,
};

/**
 * The off-the-clock village: one brick-built model on a baseplate, seen from
 * above. Every house is a door into a hobby: click a house (or its card below).
 */
export function Street({ hobbies, photos }: { hobbies: Hobby[]; photos: Record<string, Photo[]> }) {
  const [open, setOpen] = useState<Hobby["id"] | null>(null);
  const [hot, setHot] = useState<Hobby["id"] | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const cards = useRef(new Map<Hobby["id"], HTMLButtonElement>());

  const openHobby = (id: Hobby["id"]) => {
    trigger.current = cards.current.get(id) ?? null;
    setOpen(id);
  };
  const close = useCallback(() => {
    setOpen(null);
    requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
  }, []);

  const hobby = hobbies.find((h) => h.id === open);
  const titleOf = (id: Hobby["id"]) => hobbies.find((h) => h.id === id)?.title ?? "";

  // drawn over the model, in its own space: smoke, the builder, house signs and click targets
  const overlay = (P: IsoProject) => {
    const poly = (...p: (readonly [number, number])[]) => p.map((q) => q.join(",")).join(" ");
    const [jx, jy] = P(23, 28.8, PLATE);
    const [mx, my] = P(MILL_HUB[0], MILL_HUB[1], MILL_HUB[2] * PLATE);
    return (
      <>
        <g fill="#ffffff" style={{ pointerEvents: "none" }}>
          {CHIMNEYS.map(([x, y, z], i) => {
            const [cx, cy] = P(x, y, z * PLATE);
            return [0, 1, 2].map((k) => (
              <circle key={`${i}-${k}`} className="smoke-puff" cx={cx} cy={cy - 8} r={7 - k * 1.5} opacity={0} style={{ animationDelay: `${-k * 1.2 - i * 0.5}s` }} />
            ));
          })}
        </g>
        {/* the windmill's sails */}
        <g className="windmill-spin" style={{ pointerEvents: "none" }}>
          {[0, 90, 180, 270].map((a) => (
            <g key={a} transform={`rotate(${a + 20} ${mx} ${my})`}>
              <rect x={mx - 2} y={my - 74} width={4} height={74} fill="#5a3a20" />
              <rect x={mx + 2} y={my - 72} width={17} height={50} fill="#fffaf0" stroke="#8a5a3c" strokeWidth={1.5} />
              <path d={`M${mx + 2} ${my - 55} h17 M${mx + 2} ${my - 38} h17`} stroke="#8a5a3c" strokeWidth={1} />
            </g>
          ))}
          <circle cx={mx} cy={my} r={6} fill="#5a3a20" />
        </g>
        {/* the builder, visiting */}
        <image href="/minifig.webp" x={jx - 17} y={jy - 64} width={34} height={64} style={{ pointerEvents: "none" }} />
        {HOUSES.map(({ id, box: b, top }) => {
          const zb = PLATE;
          const zt = top * PLATE;
          const [sx, sy] = P(b.x + b.w / 2, b.y + b.h / 2, zt + 0.9);
          const title = titleOf(id);
          const w = title.length * 6.6 + 22;
          return (
            <g
              key={id}
              data-house={id}
              className={`house-hit ${hot === id ? "is-hot" : ""}`}
              onClick={() => openHobby(id)}
              onPointerEnter={() => setHot(id)}
              onPointerLeave={() => setHot(null)}
            >
              <polygon
                points={poly(P(b.x, b.y + b.h, zb), P(b.x + b.w, b.y + b.h, zb), P(b.x + b.w, b.y, zb), P(b.x + b.w, b.y, zt), P(b.x, b.y, zt), P(b.x, b.y + b.h, zt))}
                className="house-hit-area"
              />
              {/* sign board on a post above the roof */}
              <g className="house-sign">
                <rect x={sx - 1.5} y={sy + 10} width={3} height={14} fill="#5a3a20" />
                <rect x={sx - w / 2} y={sy - 12} width={w} height={23} rx={5} fill="#fff7e0" stroke="#7a5230" strokeWidth={2.5} />
                <text x={sx} y={sy + 4} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="ui-sans-serif, system-ui, sans-serif" fill="#5a3a20">
                  {title}
                </text>
              </g>
            </g>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div className="village-sky relative overflow-hidden" data-street-mode="diorama">
        {/* sky */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="absolute right-[6vw] top-6"><BrickSun /></span>
          <span className="absolute left-[4vw] top-8"><BrickCloud w={130} /></span>
          <span className="absolute left-[34vw] top-20"><BrickCloud w={96} /></span>
          <span className="absolute left-[64vw] top-6"><BrickCloud w={150} /></span>
          <span className="balloon-drift absolute left-[20vw] top-28"><Balloon /></span>
          <span className="bird-fly absolute left-0 top-24"><Birds /></span>
        </div>

        {/* the village; on a narrow screen it scrolls sideways */}
        <div className="relative overflow-x-auto px-3 pb-2 pt-16 sm:px-6" tabIndex={0} role="group" aria-label="The village from above. On a small screen, scroll sideways to look around." data-village-scroll>
          <div className="mx-auto w-[980px] max-w-none lg:w-full lg:max-w-[1240px]" aria-hidden data-village>
            <IsoStack items={VILLAGE} boundsItems={VILLAGE_BOUNDS} size={16} shadow={false} overlay={overlay} className="h-auto w-full" />
          </div>
        </div>
        <p className="relative px-4 pb-4 text-center font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink-2 lg:hidden" aria-hidden>
          Swipe sideways to look around
        </p>

        {/* every house has a door */}
        <ul className="relative mx-auto grid max-w-7xl gap-3 px-4 pb-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:px-8" aria-label="Houses in the village">
          {hobbies.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                ref={(el) => {
                  if (el) cards.current.set(h.id, el);
                  else cards.current.delete(h.id);
                }}
                onClick={() => openHobby(h.id)}
                onPointerEnter={() => setHot(h.id)}
                onPointerLeave={() => setHot(null)}
                onFocus={() => setHot(h.id)}
                onBlur={() => setHot(null)}
                data-shopfront={h.id}
                aria-label={`${h.title}: open`}
                className={`house-card group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-surface text-left shadow-[var(--shadow-soft)] ring-1 ring-ink/10 transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1 ${hot === h.id ? "-translate-y-1 ring-2 ring-brick-yellow" : ""}`}
              >
                <span aria-hidden className="room-roof block h-6 w-full" style={{ ["--rt" as string]: ROOF[h.id], ["--rt-d" as string]: ROOF[h.id] }} />
                <span className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3">
                  <span className="font-display text-[1.02rem] font-semibold leading-snug">{h.title}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 group-hover:text-ink">
                    <DoorOpen size={16} aria-hidden /> Step inside
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {hobby && <HobbyPanel hobby={hobby} photos={photos[hobby.id] ?? []} onClose={close} />}
    </>
  );
}
