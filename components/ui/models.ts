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
