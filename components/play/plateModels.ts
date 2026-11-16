import type { Decal } from "@/components/ui/IsoStack";
import type { BrickColor } from "@/lib/bricks";

/** One brick on the free-build baseplate. x, y in studs; l = level (0 sits on the plate). */
export type Piece = { x: number; y: number; l: number; w: number; h: number; color: BrickColor; round?: boolean; decals?: Decal[] };

const b = (color: BrickColor, x: number, y: number, l: number, w = 1, h = 1): Piece => ({ color, x, y, l, w, h });
const EYE = "#111111";

// Original little models, listed in the order they get built (bottom up).

const DUCK: Piece[] = [
  b("yellow", 3, 4, 0, 3, 2),
  b("yellow", 2, 4, 1, 4, 2),
  b("yellow", 5, 4, 2, 2, 2),
  b("red", 7, 4, 2, 1, 2),
  {
    ...b("yellow", 5, 4, 3, 2, 2),
    decals: [
      { face: "front", a: 1.2, z: 0.45, w: 0.4, h: 0.4, round: true, fill: EYE },
      { face: "side", a: 0.3, z: 0.45, w: 0.4, h: 0.4, round: true, fill: EYE },
      { face: "side", a: 1.3, z: 0.45, w: 0.4, h: 0.4, round: true, fill: EYE },
    ],
  },
];

const ROCKET: Piece[] = [
  b("dark", 4, 4, 0, 2, 2),
  b("red", 3, 4, 0, 1, 2),
  b("red", 6, 4, 0, 1, 2),
  b("red", 4, 3, 0, 2, 1),
  b("red", 4, 6, 0, 2, 1),
  b("white", 4, 4, 1, 2, 2),
  {
    ...b("white", 4, 4, 2, 2, 2),
    decals: [
      { face: "front", a: 0.55, z: 0.2, w: 0.9, h: 0.8, round: true, fill: "#2a78da" },
      { face: "side", a: 0.55, z: 0.2, w: 0.9, h: 0.8, round: true, fill: "#2a78da" },
    ],
  },
  b("blue", 4, 4, 3, 2, 2),
  b("red", 4, 4, 4, 2, 2),
  { ...b("red", 4.5, 4.5, 5), round: true },
];

const ROBOT: Piece[] = [
  b("dark", 4, 4, 0, 1, 2),
  b("dark", 6, 4, 0, 1, 2),
  { ...b("blue", 4, 4, 1, 3, 2), decals: [{ face: "front", a: 0.9, z: 0.25, w: 1.2, h: 0.7, fill: "#ffd500" }] },
  b("blue", 4, 4, 2, 3, 2),
  b("red", 3, 4, 2, 1, 1),
  b("red", 7, 4, 2, 1, 1),
  {
    ...b("white", 4, 4, 3, 3, 2),
    decals: [
      { face: "front", a: 0.55, z: 0.5, w: 0.5, h: 0.5, round: true, fill: EYE },
      { face: "front", a: 1.95, z: 0.5, w: 0.5, h: 0.5, round: true, fill: EYE },
      { face: "front", a: 0.9, z: 0.15, w: 1.2, h: 0.16, fill: "#d01012" },
    ],
  },
  { ...b("red", 5, 4, 4), round: true },
  { ...b("yellow", 5, 4, 5), round: true },
];

const TREE_HOUSE: Piece[] = [
  // house
  { ...b("white", 1, 3, 0, 4, 3), decals: [{ face: "front", a: 1.5, z: 0, w: 1, h: 1.05, fill: "#6b4f35" }] },
  {
    ...b("white", 1, 3, 1, 4, 3),
    decals: [
      { face: "front", a: 0.5, z: 0.25, w: 0.9, h: 0.65, mullions: true, fill: "#2d5a86" },
      { face: "front", a: 2.6, z: 0.25, w: 0.9, h: 0.65, mullions: true, fill: "#2d5a86" },
      { face: "side", a: 1, z: 0.25, w: 0.9, h: 0.65, mullions: true, fill: "#2d5a86" },
    ],
  },
  b("red", 1, 3, 2, 4, 3),
  b("red", 1, 4, 3, 4, 1),
  // tree
  b("dark", 7, 6, 0),
  b("dark", 7, 6, 1),
  b("green", 6, 5, 2, 3, 3),
  b("green", 6, 6, 3, 3, 1),
  b("green", 7, 5, 3, 1, 1),
  b("green", 7, 7, 3, 1, 1),
  b("green", 7, 6, 4),
  // path
  b("yellow", 2, 7, 0, 2, 1),
];

export const STARTER = DUCK;

export const PLATE_MODELS: { name: string; pieces: Piece[] }[] = [
  { name: "rocket", pieces: ROCKET },
  { name: "robot", pieces: ROBOT },
  { name: "house and tree", pieces: TREE_HOUSE },
  { name: "duck", pieces: DUCK },
];
