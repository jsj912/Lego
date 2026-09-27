import type { BrickColor } from "@/lib/bricks";
import type { IsoItem } from "./IsoStack";

// Original brick models. Coordinates: x, y in studs; z in plates (a brick = 3).
// Gear cx / cz / radius are in stud units.

const Z = (bricks: number, plates = 0) => bricks * 3 + plates;

/** The hero monument: a clockwork pavilion on a baseplate. */
export const MONUMENT: IsoItem[] = [
  { kind: "plate", color: "green", w: 8, h: 6, x: 0, y: 0, z: 0 },
  { kind: "tile", color: "grey", w: 2, h: 1, x: 3, y: 5, z: 1 },
  { color: "white", w: 6, h: 4, x: 1, y: 1, z: 1 },
  // central core, three bricks tall
  { color: "grey", w: 2, h: 2, x: 3, y: 2, z: Z(1, 1) },
  { color: "grey", w: 2, h: 2, x: 3, y: 2, z: Z(2, 1) },
  { color: "grey", w: 2, h: 2, x: 3, y: 2, z: Z(3, 1) },
  // four round columns
  ...[[1, 1], [6, 1], [1, 4], [6, 4]].flatMap(([x, y]) =>
    [1, 2, 3].map((b) => ({ kind: "round" as const, color: (b === 2 ? "red" : "white") as BrickColor, x, y, z: Z(b, 1), studs: false })),
  ),
  // roof
  { kind: "plate", color: "blue", w: 6, h: 4, x: 1, y: 1, z: Z(4, 1) },
  { kind: "beam", color: "dark", w: 6, h: 1, x: 1, y: 4, z: Z(4, 2) },
  { kind: "beam", color: "dark", w: 1, h: 3, x: 6, y: 1, z: Z(4, 2) },
  { color: "red", w: 4, h: 2, x: 2, y: 2, z: Z(4, 2) },
  { color: "yellow", w: 2, h: 2, x: 3, y: 2, z: Z(5, 2) },
  { kind: "round", color: "white", x: 3, y: 2, z: Z(6, 2) },
  // clockwork
  { kind: "gear", color: "yellow", face: "front", at: 4, cx: 4, cz: 3.4, radius: 0.95, spin: true },
  { kind: "gear", color: "grey", face: "side", at: 5, cx: 3, cz: 4.2, radius: 0.55, spin: true },
];

/** Box-art models, one per set (cycled). `accent` fills the secondary colour. */
export function boxModel(index: number, main: BrickColor, accent: BrickColor): IsoItem[] {
  const models: IsoItem[][] = [
    // 0 · gate with a beam lintel
    [
      { kind: "plate", color: "grey", w: 5, h: 2, x: 0, y: 0, z: 0 },
      { color: main, w: 1, h: 2, x: 0, y: 0, z: 1 },
      { color: main, w: 1, h: 2, x: 4, y: 0, z: 1 },
      { color: accent, w: 1, h: 2, x: 0, y: 0, z: 4 },
      { color: accent, w: 1, h: 2, x: 4, y: 0, z: 4 },
      { kind: "beam", color: "dark", w: 5, h: 1, x: 0, y: 1, z: 7 },
      { kind: "plate", color: main, w: 5, h: 1, x: 0, y: 0, z: 7 },
      { kind: "round", color: "white", x: 2, y: 0, z: 8 },
    ],
    // 1 · clockwork tower
    [
      { kind: "plate", color: "grey", w: 3, h: 3, x: 0, y: 0, z: 0 },
      { color: main, w: 2, h: 2, x: 0, y: 0, z: 1 },
      { color: "grey", w: 2, h: 2, x: 0, y: 0, z: 4 },
      { color: main, w: 2, h: 2, x: 0, y: 0, z: 7 },
      { kind: "plate", color: accent, w: 2, h: 2, x: 0, y: 0, z: 10 },
      { kind: "round", color: "white", x: 0, y: 0, z: 11 },
      { kind: "gear", color: "yellow", face: "front", at: 2, cx: 1, cz: 2.2, radius: 0.8, spin: true },
      { kind: "gear", color: "grey", face: "side", at: 2, cx: 1, cz: 3.4, radius: 0.45, spin: true },
    ],
    // 2 · stepped pyramid
    [
      { color: main, w: 4, h: 4, x: 0, y: 0, z: 0 },
      { color: accent, w: 3, h: 3, x: 0.5, y: 0.5, z: 3 },
      { color: main, w: 2, h: 2, x: 1, y: 1, z: 6 },
      { kind: "round", color: "white", x: 1.5, y: 1.5, z: 9 },
    ],
    // 3 · lighthouse
    [
      { kind: "plate", color: "blue", w: 3, h: 3, x: 0, y: 0, z: 0 },
      { kind: "round", color: main, x: 1, y: 1, z: 1, studs: false },
      { kind: "round", color: "white", x: 1, y: 1, z: 4, studs: false },
      { kind: "round", color: main, x: 1, y: 1, z: 7, studs: false },
      { kind: "plate", color: "dark", w: 3, h: 3, x: 0, y: 0, z: 10 },
      { kind: "round", color: "yellow", x: 1, y: 1, z: 11 },
    ],
    // 4 · crane arm
    [
      { color: main, w: 3, h: 2, x: 0, y: 0, z: 0 },
      { color: "grey", w: 1, h: 1, x: 0, y: 0, z: 3 },
      { color: "grey", w: 1, h: 1, x: 0, y: 0, z: 6 },
      { color: "grey", w: 1, h: 1, x: 0, y: 0, z: 9 },
      { kind: "beam", color: accent, w: 5, h: 1, x: 0, y: 0, z: 12 },
      { color: "dark", w: 1, h: 1, x: 0, y: 1, z: 3 },
      { kind: "gear", color: "yellow", face: "side", at: 3, cx: 1, cz: 0.6, radius: 0.5, spin: true },
    ],
    // 5 · bridge
    [
      { color: main, w: 1, h: 2, x: 0, y: 0, z: 0 },
      { color: main, w: 1, h: 2, x: 4, y: 0, z: 0 },
      { color: accent, w: 1, h: 2, x: 0, y: 0, z: 3 },
      { color: accent, w: 1, h: 2, x: 4, y: 0, z: 3 },
      { kind: "plate", color: "grey", w: 5, h: 2, x: 0, y: 0, z: 6 },
      { kind: "beam", color: "dark", w: 5, h: 1, x: 0, y: 1, z: 7 },
      { kind: "round", color: "white", x: 0, y: 0, z: 7 },
      { kind: "round", color: "white", x: 4, y: 0, z: 7 },
    ],
    // 6 · workshop house
    [
      { kind: "plate", color: "green", w: 4, h: 3, x: 0, y: 0, z: 0 },
      { color: "white", w: 3, h: 2, x: 0, y: 0, z: 1 },
      { color: main, w: 3, h: 2, x: 0, y: 0, z: 4 },
      { kind: "plate", color: accent, w: 3, h: 2, x: 0, y: 0, z: 7 },
      { color: accent, w: 3, h: 1, x: 0, y: 0, z: 8 },
      { kind: "round", color: "grey", x: 2, y: 1, z: 8 },
      { kind: "tile", color: "yellow", w: 1, h: 1, x: 3, y: 2, z: 1 },
    ],
  ];
  return models[index % models.length];
}

// ───────── Campus buildings (generic, original; not replicas of real campuses) ─────────

const row = (n: number, a0: number, step: number, z: number, w = 0.6, h = 0.7) =>
  Array.from({ length: n }, (_, i) => ({ face: "front" as const, a: a0 + i * step, z, w, h, mullions: true, fill: "#2d5a86" }));

/** A classical college hall with a stepped pediment and a clock tower. */
export const CAMPUS_HALL: IsoItem[] = [
  { kind: "plate", color: "green", w: 10, h: 6, x: 0, y: 0, z: 0 },
  { kind: "tile", color: "grey", w: 4, h: 1, x: 3, y: 5, z: 1 },
  { color: "white", w: 8, h: 4, x: 1, y: 1, z: 1, decals: [...row(3, 0.5, 1, 0.25), { face: "front", a: 3.4, z: 0, w: 1.2, h: 1.05, fill: "#3a2a1c" }, ...row(3, 4.9, 1, 0.25)] },
  { color: "white", w: 8, h: 4, x: 1, y: 1, z: 4, decals: row(7, 0.5, 1.03, 0.25) },
  { color: "white", w: 8, h: 4, x: 1, y: 1, z: 7, decals: row(7, 0.5, 1.03, 0.25) },
  { kind: "plate", color: "red", w: 8, h: 4, x: 1, y: 1, z: 10 },
  // clock tower (behind the pediment)
  { color: "grey", w: 2, h: 2, x: 4, y: 1, z: 11 },
  { color: "grey", w: 2, h: 2, x: 4, y: 1, z: 14 },
  { color: "grey", w: 2, h: 2, x: 4, y: 1, z: 17 },
  { color: "grey", w: 2, h: 2, x: 4, y: 1, z: 20, decals: [{ face: "front", a: 0.5, z: 0.15, w: 1, h: 0.95, round: true, fill: "#fbfaf4" }, { face: "side", a: 0.5, z: 0.15, w: 1, h: 0.95, round: true, fill: "#fbfaf4" }] },
  { kind: "plate", color: "dark", w: 2, h: 2, x: 4, y: 1, z: 23 },
  { kind: "round", color: "yellow", x: 4.5, y: 1.5, z: 24 },
  // stepped pediment on the front row
  { color: "white", w: 6, h: 1, x: 2, y: 4, z: 11 },
  { color: "white", w: 4, h: 1, x: 3, y: 4, z: 14 },
  { kind: "plate", color: "red", w: 4, h: 1, x: 3, y: 4, z: 17 },
];

/** A research block with a tall tower and a tree. */
export const CAMPUS_TOWER: IsoItem[] = [
  { kind: "plate", color: "green", w: 10, h: 6, x: 0, y: 0, z: 0 },
  { kind: "tile", color: "grey", w: 2, h: 2, x: 2, y: 4, z: 1 },
  { color: "white", w: 6, h: 3, x: 0, y: 1, z: 1, decals: [...row(2, 0.4, 1, 0.25), { face: "front", a: 2.4, z: 0, w: 1.2, h: 1.05, fill: "#3a2a1c" }, ...row(2, 4, 1, 0.25)] },
  { color: "white", w: 6, h: 3, x: 0, y: 1, z: 4, decals: [{ face: "front", a: 0.4, z: 0.3, w: 5.2, h: 0.6, fill: "#2d5a86" }] },
  { kind: "plate", color: "blue", w: 6, h: 3, x: 0, y: 1, z: 7 },
  // tower
  ...[1, 4, 7, 10, 13].map((z) => ({ color: "red" as BrickColor, w: 2, h: 2, x: 6, y: 1, z, decals: [{ face: "front" as const, a: 0.6, z: 0.3, w: 0.8, h: 0.6, fill: "#2d5a86" }] })),
  { kind: "plate", color: "dark", w: 2, h: 2, x: 6, y: 1, z: 16 },
  { kind: "round", color: "white", x: 6.5, y: 1.5, z: 17 },
  { kind: "gear", color: "yellow", face: "front", at: 3, cx: 7, cz: 5.6, radius: 0.55, spin: true },
  // tree
  { kind: "round", color: "dark", x: 8, y: 4, z: 1, studs: false },
  { color: "green", w: 2, h: 2, x: 7.5, y: 3.5, z: 4 },
  { kind: "round", color: "green", x: 8, y: 4, z: 7 },
];

// ───────── Focus-area mini models ─────────

export const FOCUS_MODELS: IsoItem[][] = [
  // camera
  [
    { color: "dark", w: 3, h: 2, x: 0, y: 0, z: 0, decals: [{ face: "front", a: 0.9, z: 0.1, w: 1.2, h: 1, round: true, fill: "#2d5a86" }] },
    { kind: "plate", color: "grey", w: 2, h: 1, x: 0, y: 0, z: 3 },
    { kind: "round", color: "red", x: 2, y: 0, z: 3 },
  ],
  // graph of nodes
  [
    { kind: "plate", color: "white", w: 4, h: 4, x: 0, y: 0, z: 0 },
    { kind: "beam", color: "grey", w: 4, h: 1, x: 0, y: 0, z: 1 },
    { kind: "beam", color: "grey", w: 1, h: 3, x: 3, y: 1, z: 1 },
    { kind: "round", color: "blue", x: 0, y: 3, z: 1 },
    { kind: "round", color: "red", x: 0, y: 0, z: 4 },
    { kind: "round", color: "yellow", x: 3, y: 0, z: 4 },
    { kind: "round", color: "green", x: 3, y: 3, z: 4 },
  ],
  // calibrated gear rig
  [
    { kind: "beam", color: "dark", w: 4, h: 1, x: 0, y: 0, z: 0 },
    { kind: "beam", color: "dark", w: 4, h: 1, x: 0, y: 0, z: 3 },
    { kind: "gear", color: "yellow", face: "front", at: 1, cx: 1.2, cz: 2.3, radius: 0.75, spin: true },
    { kind: "gear", color: "grey", face: "front", at: 1, cx: 2.75, cz: 2.3, radius: 0.55, spin: true },
  ],
  // server rack
  [
    ...[0, 3, 6].map((z) => ({
      color: "dark" as BrickColor,
      w: 2,
      h: 2,
      x: 0,
      y: 0,
      z,
      decals: [
        { face: "front" as const, a: 0.2, z: 0.45, w: 0.25, h: 0.25, fill: "#3ddc84" },
        { face: "front" as const, a: 0.6, z: 0.5, w: 1.1, h: 0.14, fill: "#6b7280" },
      ],
    })),
    { kind: "plate", color: "green", w: 2, h: 2, x: 0, y: 0, z: 9 },
  ],
];

/** Blueprint drawing for a research sheet with no related build. */
export const BLUEPRINT_RIG: IsoItem[] = [
  { kind: "plate", color: "grey", w: 5, h: 3, x: 0, y: 0, z: 0 },
  { kind: "beam", color: "grey", w: 1, h: 3, x: 0, y: 0, z: 1 },
  { kind: "beam", color: "grey", w: 1, h: 3, x: 4, y: 0, z: 1 },
  { kind: "beam", color: "grey", w: 5, h: 1, x: 0, y: 2, z: 4 },
  { kind: "gear", color: "grey", face: "front", at: 3, cx: 2.5, cz: 1.2, radius: 0.8 },
];
