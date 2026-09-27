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

// ───────── Hero: a gear train driving a sorter ─────────
// Radii are chosen so neighbouring gears mesh (centre distance ≈ 0.9 × (r1 + r2));
// teeth scale with radius and each gear's ratio is −r_prev / r_next.
const GA = 1.25, GB = 0.8, GC = 1.05, GD = 0.6;
const ZG = 4.6; // gear centre height (beam centre), studs
export const HERO_MACHINE: IsoItem[] = [
  { kind: "plate", color: "grey", w: 10, h: 5, x: 0, y: 0, z: 0 },
  // pillars
  ...[1, 4, 7].flatMap((z) => [
    { color: "dark" as BrickColor, w: 1, h: 2, x: 0, y: 1, z },
    { color: "dark" as BrickColor, w: 1, h: 2, x: 9, y: 1, z },
  ]),
  // main beam carrying the gear train
  { kind: "beam", color: "dark", w: 10, h: 1, x: 0, y: 2, z: 10 },
  // sorted output: three bins with their bricks
  { color: "red", w: 2, h: 2, x: 1, y: 3, z: 1 },
  { kind: "round", color: "red", x: 1, y: 3, z: 4 },
  { color: "blue", w: 2, h: 2, x: 4, y: 3, z: 1 },
  { kind: "plate", color: "blue", w: 1, h: 2, x: 4, y: 3, z: 4 },
  { color: "yellow", w: 2, h: 2, x: 7, y: 3, z: 1 },
  { kind: "round", color: "yellow", x: 8, y: 4, z: 4 },
  // the train
  { kind: "gear", color: "yellow", face: "front", at: 3, cx: 2.2, cz: ZG, radius: GA, teeth: 18, ratio: 1 },
  { kind: "gear", color: "grey", face: "front", at: 3, cx: 2.2 + 0.9 * (GA + GB), cz: ZG, radius: GB, teeth: 12, ratio: -GA / GB },
  { kind: "gear", color: "red", face: "front", at: 3, cx: 2.2 + 0.9 * (GA + GB) + 0.9 * (GB + GC), cz: ZG, radius: GC, teeth: 15, ratio: GA / GC },
  { kind: "gear", color: "grey", face: "front", at: 3, cx: 2.2 + 0.9 * (GA + GB) + 0.9 * (GB + GC) + 0.9 * (GC + GD), cz: ZG, radius: GD, teeth: 9, ratio: -GA / GD },
];

// ───────── Box art that shows what each project is ─────────
const ring = (n: number, cx: number, cy: number, r: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 4;
    return { kind: "round" as const, color: (i % 2 ? "white" : "red") as BrickColor, x: cx + Math.cos(a) * r - 0.5, y: cy + Math.sin(a) * r - 0.5, z: 1 };
  });

export const BUILD_MODELS: Record<string, IsoItem[]> = {
  // a router block dispatching to three specialist arms
  "moe-appliance-detection": [
    { kind: "plate", color: "grey", w: 7, h: 5, x: 0, y: 0, z: 0 },
    { color: "dark", w: 2, h: 2, x: 0, y: 1.5, z: 1 },
    { color: "dark", w: 2, h: 2, x: 0, y: 1.5, z: 4, decals: [{ face: "front", a: 0.4, z: 0.25, w: 1.2, h: 0.7, fill: "#ffd500", text: "R" }] },
    { kind: "round", color: "yellow", x: 0.5, y: 2, z: 7 },
    { kind: "beam", color: "grey", w: 3, h: 1, x: 2, y: 0, z: 4 },
    { kind: "beam", color: "grey", w: 3, h: 1, x: 2, y: 2, z: 4 },
    { kind: "beam", color: "grey", w: 3, h: 1, x: 2, y: 4, z: 4 },
    { color: "red", w: 1, h: 1, x: 5, y: 0, z: 1 },
    { color: "red", w: 1, h: 1, x: 5, y: 0, z: 4 },
    { color: "blue", w: 1, h: 1, x: 5, y: 2, z: 1 },
    { color: "blue", w: 1, h: 1, x: 5, y: 2, z: 4 },
    { color: "green", w: 1, h: 1, x: 5, y: 4, z: 1 },
    { color: "green", w: 1, h: 1, x: 5, y: 4, z: 4 },
  ],
  // a ring of linked bricks guarding a shield
  ringshield: [
    { kind: "plate", color: "grey", w: 6, h: 6, x: 0, y: 0, z: 0 },
    ...ring(8, 3, 3, 2.3),
    { color: "white", w: 2, h: 1, x: 2, y: 2, z: 1 },
    { color: "white", w: 2, h: 1, x: 2, y: 2, z: 4 },
    {
      color: "white",
      w: 2,
      h: 1,
      x: 2,
      y: 2,
      z: 7,
      // the shield spans the whole wall; it's drawn with the top brick so the lower bricks don't cover it
      decals: [
        { face: "front", a: 0.15, z: -2.3, w: 1.7, h: 3.3, shape: "shield", fill: "#0055BF" },
        { face: "front", a: 0.45, z: -1.75, w: 1.1, h: 2.35, shape: "shield", fill: "#ffd500" },
      ],
    },
    { kind: "tile", color: "white", w: 2, h: 1, x: 2, y: 2, z: 10 },
  ],
  // fast stage → gate → heavy stage
  amsdds: [
    { kind: "plate", color: "grey", w: 7, h: 3, x: 0, y: 0, z: 0 },
    { color: "blue", w: 2, h: 2, x: 0, y: 0.5, z: 1 },
    { kind: "beam", color: "dark", w: 2, h: 1, x: 2, y: 1, z: 1 },
    { color: "red", w: 2, h: 2, x: 4, y: 0.5, z: 1 },
    { color: "red", w: 2, h: 2, x: 4, y: 0.5, z: 4 },
    { color: "red", w: 2, h: 2, x: 4, y: 0.5, z: 7 },
    { kind: "round", color: "white", x: 4.5, y: 1, z: 10 },
    { kind: "gear", color: "yellow", face: "front", at: 2, cx: 3, cz: 1.9, radius: 0.55, spin: true },
  ],
  // a network of nodes with one raised alarm
  "network-anomaly-detection": [
    { kind: "plate", color: "white", w: 6, h: 5, x: 0, y: 0, z: 0 },
    { kind: "beam", color: "grey", w: 5, h: 1, x: 0.5, y: 0.5, z: 1 },
    { kind: "beam", color: "grey", w: 1, h: 3, x: 0.5, y: 1.5, z: 1 },
    ...[[0.5, 4], [2.5, 3.5], [4.5, 2.5]].map(([x, y]) => ({ kind: "round" as const, color: "blue" as BrickColor, x, y, z: 1 })),
    { kind: "round", color: "blue", x: 0.5, y: 0.5, z: 4 },
    { kind: "round", color: "blue", x: 4.5, y: 0.5, z: 4 },
    { kind: "round", color: "red", x: 3, y: 1.5, z: 1, studs: false },
    { kind: "round", color: "red", x: 3, y: 1.5, z: 4, studs: false },
    { kind: "round", color: "yellow", x: 3, y: 1.5, z: 7 },
  ],
  // an always-on rack handing work up to a serverless cloud
  "lambda-migration": [
    { kind: "plate", color: "grey", w: 7, h: 3, x: 0, y: 0, z: 0 },
    ...[1, 4, 7].map((z) => ({
      color: "dark" as BrickColor,
      w: 2,
      h: 2,
      x: 0,
      y: 0.5,
      z,
      decals: [{ face: "front" as const, a: 0.2, z: 0.45, w: 0.25, h: 0.25, fill: "#3ddc84" }],
    })),
    { kind: "beam", color: "grey", w: 2, h: 1, x: 2, y: 1, z: 7 },
    { color: "yellow", w: 2, h: 2, x: 4, y: 0.5, z: 7, decals: [{ face: "front", a: 0.5, z: 0.15, w: 1, h: 0.9, fill: "#ffe34d", text: "λ" }] },
    { kind: "plate", color: "white", w: 3, h: 3, x: 3.5, y: 0, z: 10 },
    { kind: "round", color: "white", x: 3.5, y: 0, z: 11 },
    { kind: "round", color: "white", x: 4.5, y: 1, z: 11 },
    { kind: "round", color: "white", x: 5.5, y: 0, z: 11 },
  ],
  // glasses
  "smart-glasses": [
    { kind: "plate", color: "white", w: 7, h: 5, x: 0, y: 0, z: 0 },
    { kind: "round", color: "grey", x: 0.5, y: 4, z: 1, studs: false },
    { kind: "round", color: "grey", x: 5.5, y: 4, z: 1, studs: false },
    { kind: "beam", color: "dark", w: 1, h: 4, x: 0.5, y: 0, z: 4 },
    { kind: "beam", color: "dark", w: 1, h: 4, x: 5.5, y: 0, z: 4 },
    {
      color: "dark",
      w: 6,
      h: 1,
      x: 0.5,
      y: 4,
      z: 4,
      studs: false,
      decals: [
        { face: "front", a: 0.35, z: 0.08, w: 2.3, h: 1.04, round: true, fill: "#6fb3e8" },
        { face: "front", a: 3.35, z: 0.08, w: 2.3, h: 1.04, round: true, fill: "#6fb3e8" },
      ],
    },
  ],
  // a safe with a dial
  "homomorphic-iot": [
    { kind: "plate", color: "green", w: 4, h: 4, x: 0, y: 0, z: 0 },
    { color: "grey", w: 3, h: 3, x: 0, y: 0.5, z: 1 },
    { color: "grey", w: 3, h: 3, x: 0, y: 0.5, z: 4, decals: [{ face: "front", a: 2.3, z: 0.3, w: 0.35, h: 0.6, fill: "#2a2a2a" }] },
    { color: "grey", w: 3, h: 3, x: 0, y: 0.5, z: 7 },
    { kind: "plate", color: "dark", w: 3, h: 3, x: 0, y: 0.5, z: 10 },
    { kind: "gear", color: "yellow", face: "front", at: 3.5, cx: 1.2, cz: 2.4, radius: 0.75, spin: true },
  ],
};
