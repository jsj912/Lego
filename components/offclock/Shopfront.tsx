import type { ReactNode } from "react";
import type { Hobby } from "@/content/offTheClock";
import type { BrickColor } from "@/lib/bricks";
import { FlowerDisplay, HangingBasket } from "./FlowerDisplay";
import { AFrame, FlatRoofFlag, PitchedRoof, SawtoothRoof, StepGable } from "./Buildings";
import { ClubhouseInterior, FloristInterior, StudioInterior, WorkshopInterior } from "./Interiors";
import { LibraryWindow } from "./LibraryWindow";

export const HOBBY_COLOR: Record<Hobby["id"], BrickColor> = {
  books: "red",
  running: "blue",
  flowers: "green",
  scrapbook: "yellow",
  "build-table": "grey",
};



function Display({ hobby, photos }: { hobby: Hobby; photos: string[] }) {
  switch (hobby.id) {
    case "books":
      return <LibraryWindow books={hobby.books ?? []} current={hobby.currentlyReading} />;
    case "running":
      return (
        <>
          <ClubhouseInterior />
          {hobby.runStats && hobby.runStats.length > 0 && (
            <dl className="absolute left-2 top-2 grid grid-cols-2 gap-1.5">
              {hobby.runStats.map((st) => (
                <div key={st.label} className="rounded-md bg-white/90 px-2 py-1 shadow-sm">
                  <dt className="font-mono text-[0.56rem] uppercase tracking-[0.12em] text-ink-2">{st.label}</dt>
                  <dd className="text-[0.8rem] font-semibold">{st.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </>
      );
    case "flowers":
      return <FloristInterior />;
    case "scrapbook":
      return <StudioInterior photos={photos} />;
    case "build-table":
      return <WorkshopInterior />;
  }
}

type BuildingSpec = {
  width: number;
  roof: (w: number) => ReactNode;
  wall: string;
  frame: string;
  sign: "board" | "scoreboard" | "painted" | "taped" | "hazard";
  doorSide: "left" | "right";
  door: "wood" | "glass" | "garage";
  awning?: string;
};

const BUILDINGS: Record<Hobby["id"], BuildingSpec> = {
  books: { width: 300, roof: (w) => <StepGable w={w} />, wall: "wall-redbrick", frame: "#5a1010", sign: "painted", doorSide: "right", door: "wood" },
  running: { width: 410, roof: (w) => <FlatRoofFlag w={w} />, wall: "wall-panel", frame: "#003f8f", sign: "scoreboard", doorSide: "left", door: "glass" },
  flowers: { width: 350, roof: (w) => <PitchedRoof w={w} />, wall: "wall-plaster", frame: "#1a5c32", sign: "board", doorSide: "right", door: "wood", awning: "#237841" },
  scrapbook: { width: 270, roof: (w) => <AFrame w={w} />, wall: "wall-siding", frame: "#3a3a3a", sign: "taped", doorSide: "left", door: "wood" },
  "build-table": { width: 400, roof: (w) => <SawtoothRoof w={w} />, wall: "wall-corrugated", frame: "#3f4347", sign: "hazard", doorSide: "right", door: "garage" },
};

function Sign({ kind, title }: { kind: BuildingSpec["sign"]; title: string }) {
  switch (kind) {
    case "scoreboard":
      return (
        <div className="mx-auto mb-2 w-fit rounded-md border-[3px] border-[#1f2d3a] bg-[#101418] px-3 py-1.5 shadow-md">
          <span className="font-mono text-[0.85rem] font-bold uppercase tracking-[0.12em] text-brick-yellow">{title}</span>
        </div>
      );
    case "painted":
      return (
        <div className="mx-3 mb-2 rounded-sm border-2 border-[#5a1010] bg-[#fbf3dc] px-2 py-1.5 text-center shadow">
          <span className="font-display text-[0.9rem] font-semibold text-[#5a1010]">{title}</span>
        </div>
      );
    case "taped":
      return (
        <div className="relative mx-4 mb-2 rotate-[-2deg] bg-white px-2 py-1.5 text-center shadow">
          <span aria-hidden className="washi absolute -left-2 -top-1.5 h-3 w-8 -rotate-[30deg]" />
          <span aria-hidden className="washi absolute -right-2 -top-1.5 h-3 w-8 rotate-[30deg]" />
          <span className="font-display text-[0.88rem] font-semibold text-ink">{title}</span>
        </div>
      );
    case "hazard":
      return (
        <div className="hazard-band mx-2 mb-2 rounded-sm p-[4px] shadow">
          <div className="bg-[#1f2226] px-2 py-1 text-center">
            <span className="font-mono text-[0.82rem] font-bold uppercase tracking-[0.1em] text-white">{title}</span>
          </div>
        </div>
      );
    default:
      return (
        <div className="mx-4 mb-2 rounded-md bg-[#1a5c32] px-3 py-1.5 text-center shadow-md">
          <span className="font-display text-[0.92rem] font-semibold text-white">{title}</span>
        </div>
      );
  }
}

function Door({ kind, frame, isFlowers }: { kind: BuildingSpec["door"]; frame: string; isFlowers: boolean }) {
  if (kind === "garage") {
    return (
      <div className="relative flex w-[92px] flex-col justify-end">
        <div className="garage-door relative h-[150px] rounded-t-sm border-[4px]" style={{ borderColor: frame }} />
      </div>
    );
  }
  return (
    <div className="relative flex w-16 flex-col justify-end">
      <div className={`relative h-[150px] rounded-t-md border-[5px] ${kind === "glass" ? "bg-[#bfe1fb]/80" : "bg-[#6b4f35]"}`} style={{ borderColor: frame }}>
        <span className="absolute right-1.5 top-1/2 h-2 w-2 rounded-full bg-brick-yellow" />
        {kind === "wood" && <span className="absolute inset-x-1.5 top-2 h-8 rounded-sm bg-[#dbeafe]/70" />}
        {kind === "glass" && <span className="absolute inset-y-2 left-1/2 w-[3px] -translate-x-1/2 bg-[#003f8f]" />}
        {isFlowers && (
          <span aria-hidden className="absolute left-1/2 top-12 -translate-x-1/2 rounded-[2px] bg-[#fbf3dc] px-1 py-0.5 font-mono text-[0.46rem] font-bold tracking-[0.12em] text-brick-red shadow">
            OPEN
          </span>
        )}
      </div>
    </div>
  );
}

/** One shop on the street: a distinct building per hobby. The whole front is a button. */
export function Shopfront({ hobby, photos, onOpen }: { hobby: Hobby; photoCount?: number; photos?: string[]; onOpen: (el: HTMLElement) => void }) {
  const b = BUILDINGS[hobby.id];
  const isFlowers = hobby.id === "flowers";
  const windowEl = (
    <div
      className={
        hobby.id === "books"
          ? "relative h-[190px] flex-1 overflow-hidden rounded-b-md rounded-t-[80px] border-[6px]"
          : "relative h-[190px] flex-1 overflow-hidden rounded-md border-[6px] bg-[#f4ede2]"
      }
      style={{ borderColor: b.frame }}
    >
      <Display hobby={hobby} photos={photos ?? []} />
      <span aria-hidden className="window-glass pointer-events-none absolute inset-0" />
    </div>
  );
  const doorEl = <Door kind={b.door} frame={b.frame} isFlowers={isFlowers} />;

  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget)}
      data-shopfront={hobby.id}
      aria-label={`${hobby.title}: open`}
      className="group relative flex max-w-[92vw] shrink-0 flex-col text-left transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1"
      style={{ width: b.width }}
    >
      {/* roof */}
      <div className="relative -mb-px overflow-hidden">{b.roof(b.width)}</div>
      {/* building body */}
      <div className={`relative flex flex-1 flex-col pt-3 shadow-[inset_0_0_0_2px_rgba(0,0,0,0.06)] ${b.wall}`}>
        <Sign kind={b.sign} title={hobby.title} />
        {b.awning && <div className="awning -mx-1 mb-1 h-7" style={{ ["--aw" as string]: b.awning }} />}
        <div className="flex gap-3 px-4 pb-4">
          {b.doorSide === "left" ? (
            <>
              {doorEl}
              {windowEl}
            </>
          ) : (
            <>
              {windowEl}
              {doorEl}
            </>
          )}
        </div>
      </div>
      {isFlowers && (
        <>
          <HangingBasket className="pointer-events-none absolute left-2 top-[150px] z-[2] h-[58px] w-[44px]" />
          <FlowerDisplay className="pointer-events-none absolute inset-x-0 bottom-[38px] z-[2] w-full" />
        </>
      )}
      {/* sidewalk */}
      <div className="h-3 rounded-b bg-[#b8b3a7]" />
      <span className="mt-3 inline-flex items-center gap-1.5 self-center rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white opacity-80 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        Step inside
      </span>
    </button>
  );
}
