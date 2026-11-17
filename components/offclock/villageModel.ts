import type { Decal, IsoItem } from "@/components/ui/IsoStack";
import type { Hobby } from "@/content/offTheClock";

// The /off-the-clock village as one brick model on a 44 × 30 stud baseplate.
// x, y in studs; z in plates (a brick is 3). The viewer sees the +y ("front")
// and +x ("side") faces, so things with a larger x + y are nearer.
// Everything is an original design.

type Shade = { base: string; light: string; dark: string };
const sh = (base: string, light: string, dark: string): Shade => ({ base, light, dark });

const C = {
  teal: sh("#6dbdb8", "#9bd8d4", "#4f9a97"),
  pink: sh("#f0a9bb", "#f8ccd7", "#d98ba0"),
  lavender: sh("#b99adb", "#d6c1ee", "#9a7cc0"),
  butter: sh("#f6dc86", "#fbeab0", "#dcbb52"),
  amber: sh("#eeb04a", "#f6cb7e", "#cf8f2b"),
  mint: sh("#9fd09a", "#c3e6bf", "#79b274"),
  cream: sh("#f6ecd6", "#fffaf0", "#dccfb3"),
  tan: sh("#e3c79a", "#f0dcb8", "#c4a674"),
  barn: sh("#c9744f", "#dd9474", "#a6583a"),
  wood: sh("#8a5a3c", "#a8744f", "#6b4428"),
  stone: sh("#b3aca0", "#cfc9be", "#8f877a"),
  cobble: sh("#c9c1b2", "#ddd6c9", "#a8a092"),
  water: sh("#4aa3df", "#7cc4f4", "#2f7fbd"),
  leaf: sh("#2f8f4f", "#4ea463", "#237841"),
  blossom: sh("#f4b8c8", "#fbd6e0", "#dc92a8"),
  skinA: sh("#f0c8a0", "#f8dcc0", "#d8a87c"),
  skinB: sh("#c68f65", "#d8a882", "#a8744c"),
  skinC: sh("#8a5a3c", "#a8744f", "#6b4428"),
};

const GLASS = "#ffe9a8";
const win = (face: Decal["face"], a: number): Decal => ({ face, a, z: 0.26, w: 0.9, h: 0.7, mullions: true, fill: GLASS });
/** a tall door: drawn on the second course so it spans both */
const door = (face: Decal["face"], a: number, fill: string): Decal[] => [
  { face, a, z: -1.2, w: 1.15, h: 1.95, fill },
  { face, a: a + 0.2, z: 0.05, w: 0.75, h: 0.5, fill: GLASS, round: true },
];
/** a row of n windows along a face, starting at a0 */
const wins = (face: Decal["face"], n: number, a0: number, step: number): Decal[] => Array.from({ length: n }, (_, i) => win(face, a0 + i * step));

export const BASE_W = 44;
export const BASE_H = 30;

type Wall = { x: number; y: number; w: number; h: number };
/** one course of wall, a brick tall */
const course = (b: Wall, n: number, shade: Shade, decals?: Decal[]): IsoItem => ({ color: "white", shade, w: b.w, h: b.h, x: b.x, y: b.y, z: 1 + n * 3, studs: false, decals });
/** a pitched roof that overhangs the walls */
const roof = (b: Wall, courses: number, shade: Shade, ridge: "x" | "y", rise: number, gable: Shade, extra = 0): IsoItem => ({
  kind: "roof", color: "red", shade, gable: { base: gable.base, dark: gable.dark },
  x: b.x - 0.5, y: b.y - 0.5, w: b.w + 1, h: b.h + 1, z: 1 + courses * 3 + extra, rise, ridge,
});
const stack = (x: number, y: number, z0: number, n: number, shade: Shade, w = 1, h = 1): IsoItem[] =>
  Array.from({ length: n }, (_, i) => ({ color: "white" as const, shade, w, h, x, y, z: z0 + i * 3, studs: false }));
const stud1 = (x: number, y: number, z: number, shade: Shade | null, color: IsoItem["color"] = "white"): IsoItem => ({ kind: "round", color, ...(shade ? { shade } : {}), x, y, z });

/** a brick tree: trunk, two layers of leaves and a top */
function tree(x: number, y: number, crown: Shade = C.leaf, trunk = 2): IsoItem[] {
  return [
    ...Array.from({ length: trunk }, (_, i): IsoItem => ({ kind: "round", color: "dark", shade: C.wood, x: x + 1, y: y + 1, z: 1 + i * 3, studs: false })),
    { color: "green", shade: crown, w: 3, h: 3, x, y, z: 1 + trunk * 3 },
    { color: "green", shade: crown, w: 2, h: 2, x: x + 0.5, y: y + 0.5, z: 4 + trunk * 3 },
    { kind: "round", color: "green", shade: crown, x: x + 1, y: y + 1, z: 7 + trunk * 3 },
  ];
}

const lamp = (x: number, y: number): IsoItem[] => [
  { kind: "round", color: "dark", x, y, z: 1, studs: false },
  { kind: "disc", color: "yellow", d: 1, x, y, z: 4, cls: "iso-glow" },
];

/** a little brick person: body, head, and a hat or hair plate */
function person(x: number, y: number, shirt: Shade, skin: Shade, hat: Shade, cls?: string): IsoItem[] {
  return [
    { kind: "round", color: "white", shade: shirt, x, y, z: 1, studs: false, cls },
    { kind: "disc", color: "white", shade: skin, d: 1, x, y, z: 4, studs: false, cls },
    { kind: "disc", color: "white", shade: hat, d: 1, x, y, z: 5, cls },
  ];
}

const flowers = (x: number, y: number, n: number, dx: number, dy: number): IsoItem[] =>
  Array.from({ length: n }, (_, i) => stud1(x + i * dx, y + i * dy, 1, i % 3 === 2 ? C.blossom : null, (["red", "yellow", "white", "red", "yellow"] as const)[i % 5]));

// ───────── the five houses, each a different shape ─────────

export type House = { id: Hobby["id"]; box: Wall; top: number };

const LIB: Wall = { x: 3, y: 6, w: 6, h: 6 };
const CLUB: Wall = { x: 11.5, y: 7.5, w: 9, h: 6 };
const FLO: Wall = { x: 26, y: 7.5, w: 7.5, h: 6 };
const BARN: Wall = { x: 35.5, y: 5.5, w: 7, h: 8 };
const STU: Wall = { x: 5, y: 23, w: 6, h: 6 };

/** where each house stands and how tall it is (plates), for click targets and signs */
export const HOUSES: House[] = [
  { id: "books", box: LIB, top: 16 + 12 },
  { id: "running", box: CLUB, top: 11 + 9 },
  { id: "flowers", box: FLO, top: 10 + 10 },
  { id: "scrapbook", box: STU, top: 13 + 13 },
  { id: "build-table", box: BARN, top: 13 + 12 },
];

/** chimney tops (studs, studs, plates) that puff smoke */
export const CHIMNEYS: [number, number, number][] = [[4, 7, 31], [27.5, 8.5, 22], [9.5, 24, 28]];

// a tall, narrow library with a stone ground floor and a steep teal roof
const library: IsoItem[] = [
  course(LIB, 0, C.stone, [win("front", 0.8), win("side", 1), win("side", 4)]),
  course(LIB, 1, C.stone, [...door("front", 3.6, "#2f6f6c"), win("front", 0.8), win("side", 1), win("side", 4)]),
  course(LIB, 2, C.tan, [...wins("front", 3, 0.8, 1.8), ...wins("side", 3, 0.8, 1.8)]),
  course(LIB, 3, C.tan, [...wins("front", 3, 0.8, 1.8), ...wins("side", 3, 0.8, 1.8)]),
  course(LIB, 4, C.tan, [{ face: "front", a: 2.2, z: 0.05, w: 1.6, h: 1.1, round: true, fill: GLASS }, ...wins("side", 2, 1.4, 2.4)]),
  roof(LIB, 5, C.teal, "y", 12, C.tan),
  ...stack(3.5, 6.5, 22, 3, C.stone),
  // a pile of giant books by the door
  { kind: "plate", color: "red", w: 2, h: 1.4, x: 9.6, y: 10.4, z: 1, studs: false },
  { kind: "plate", color: "blue", w: 2, h: 1.4, x: 9.7, y: 10.5, z: 2, studs: false },
  { kind: "plate", color: "green", w: 2, h: 1.4, x: 9.6, y: 10.3, z: 3, studs: false },
  { kind: "plate", color: "yellow", w: 2, h: 1.4, x: 9.7, y: 10.4, z: 4, studs: false },
];

// a long, low clubhouse with a pink band, an attic and a flag
const clubhouse: IsoItem[] = [
  course(CLUB, 0, C.cream, [...wins("front", 2, 0.8, 1.7), ...wins("front", 2, 6.2, 1.5), ...wins("side", 2, 1.2, 2.6)]),
  course(CLUB, 1, C.cream, [...door("front", 4.1, "#b85c75"), ...wins("front", 2, 0.8, 1.7), ...wins("front", 2, 6.2, 1.5), ...wins("side", 2, 1.2, 2.6)]),
  { kind: "plate", color: "white", shade: C.pink, w: 9.4, h: 6.4, x: CLUB.x - 0.2, y: CLUB.y - 0.2, z: 7, studs: false },
  { color: "white", shade: C.cream, w: 9, h: 6, x: CLUB.x, y: CLUB.y, z: 8, studs: false, decals: [...wins("front", 4, 1, 2.1), ...wins("side", 2, 1.2, 2.6)] },
  roof(CLUB, 3, C.pink, "x", 9, C.cream, 1),
  // a strip of running track out front
  { kind: "tile", color: "red", shade: C.barn, w: 9, h: 0.9, x: 11.5, y: 13.6, z: 1 },
];

// a flower cottage with a lavender roof, an awning and beds along the front
const flowerCottage: IsoItem[] = [
  course(FLO, 0, C.cream, [...wins("front", 2, 0.7, 1.6), ...wins("side", 2, 1.2, 2.6)]),
  course(FLO, 1, C.cream, [...door("front", 5.4, "#7a5aa6"), ...wins("front", 2, 0.7, 1.6), ...wins("side", 2, 1.2, 2.6)]),
  course(FLO, 2, C.cream, [...wins("front", 3, 1, 2.3), ...wins("side", 2, 1.2, 2.6)]),
  roof(FLO, 3, C.lavender, "x", 10, C.cream),
  ...stack(27, 8, 16, 2, C.stone),
  { kind: "plate", color: "white", shade: C.lavender, w: 4, h: 1.2, x: 26.3, y: 13.5, z: 6, studs: false },
  ...flowers(26.2, 13.7, 5, 0.95, 0),
  ...flowers(33.7, 9, 4, 0, 1.1),
];

// a red barn workshop with a big door and a mint roof
const barn: IsoItem[] = [
  course(BARN, 0, C.barn, [...wins("side", 3, 1.2, 2.4)]),
  course(BARN, 1, C.barn, [{ face: "front", a: 2, z: -1.2, w: 3, h: 2.1, fill: "#8a5a3c", mullions: true }, ...wins("side", 3, 1.2, 2.4)]),
  course(BARN, 2, C.barn, [...wins("side", 3, 1.2, 2.4)]),
  course(BARN, 3, C.barn, [{ face: "front", a: 2.7, z: 0.1, w: 1.6, h: 1, fill: "#6b4428" }]),
  roof(BARN, 4, C.mint, "y", 12, C.barn),
  // crates outside
  { color: "yellow", w: 1, h: 1, x: 34.2, y: 13.6, z: 1 },
  { color: "red", w: 1, h: 1, x: 35.5, y: 13.8, z: 1 },
  { color: "yellow", w: 1, h: 1, x: 34.8, y: 13.7, z: 4 },
  { color: "blue", w: 2, h: 1, x: 40.6, y: 13.7, z: 1 },
];

// a small studio with butter walls and a very steep amber roof
const studio: IsoItem[] = [
  course(STU, 0, C.butter, [win("front", 3.6), ...wins("side", 2, 1.2, 2.6)]),
  course(STU, 1, C.butter, [...door("front", 0.9, "#b8862b"), win("front", 3.6), ...wins("side", 2, 1.2, 2.6)]),
  course(STU, 2, C.butter, [...wins("front", 2, 1.2, 2.6), ...wins("side", 2, 1.2, 2.6)]),
  course(STU, 3, C.butter, [{ face: "front", a: 2.2, z: 0.05, w: 1.6, h: 1.1, round: true, fill: GLASS }]),
  roof(STU, 4, C.amber, "y", 13, C.butter),
  ...stack(9, 23.5, 19, 3, C.stone),
];

// ───────── the rest of the village ─────────

const ground: IsoItem[] = [
  { kind: "plate", color: "green", w: BASE_W, h: BASE_H, x: 0, y: 0, z: 0 },
  // cobbled lane along the canal, the paths to each door, and the south path
  { kind: "tile", color: "grey", shade: C.cobble, w: BASE_W, h: 2.5, x: 0, y: 14.5, z: 1 },
  { kind: "tile", color: "grey", shade: C.cobble, w: 3, h: 9, x: 21.5, y: 21, z: 1 },
  { kind: "tile", color: "grey", shade: C.cobble, w: 21, h: 1.6, x: 11, y: 27.4, z: 1 },
  // stone banks and the canal
  { kind: "plate", color: "white", shade: C.stone, w: BASE_W, h: 0.6, x: 0, y: 17, z: 1, studs: false },
  { kind: "tile", color: "blue", shade: C.water, w: BASE_W, h: 3.4, x: 0, y: 17.6, z: 1 },
  { kind: "plate", color: "white", shade: C.stone, w: BASE_W, h: 0.6, x: 0, y: 21, z: 1, studs: false },
];

const bridge: IsoItem[] = [
  { color: "white", shade: C.stone, w: 3, h: 1, x: 21.5, y: 16.6, z: 1, studs: false },
  { color: "white", shade: C.stone, w: 3, h: 1, x: 21.5, y: 20.9, z: 1, studs: false },
  { kind: "plate", color: "white", shade: C.wood, w: 3, h: 5.8, x: 21.5, y: 16.4, z: 4, studs: false },
  { color: "white", shade: C.wood, w: 0.3, h: 5.8, x: 21.5, y: 16.4, z: 5, studs: false },
  { color: "white", shade: C.wood, w: 0.3, h: 5.8, x: 24.2, y: 16.4, z: 5, studs: false },
];

/** hub of the windmill's sails: x, y in studs, z in plates */
export const MILL_HUB: [number, number, number] = [33, 27.15, 15.5];

const windmill: IsoItem[] = [
  ...stack(31, 23.5, 1, 4, C.cream, 4, 4),
  { color: "white", shade: C.cream, w: 3, h: 3, x: 31.5, y: 24, z: 13, studs: false, decals: [win("front", 1.05), win("side", 1.05)] },
  { color: "white", shade: C.cream, w: 3, h: 3, x: 31.5, y: 24, z: 16, studs: false },
  { kind: "roof", color: "red", shade: C.lavender, gable: { base: C.cream.base, dark: C.cream.dark }, x: 31.2, y: 23.7, w: 3.6, h: 3.6, z: 19, rise: 6, ridge: "y" },
  // door
  { color: "white", shade: C.wood, w: 1.2, h: 0.2, x: 32.4, y: 27.5, z: 1, studs: false },
];

const well: IsoItem[] = [
  { kind: "disc", color: "white", shade: C.stone, d: 2.4, x: 26, y: 24, z: 1, studs: false },
  { kind: "disc", color: "blue", shade: C.water, d: 1.6, x: 26.4, y: 24.4, z: 2, studs: false },
];

const stall: IsoItem[] = [
  { color: "white", shade: C.wood, w: 4, h: 1.4, x: 14, y: 24.4, z: 1, studs: false },
  stud1(14.2, 24.6, 4, null, "red"),
  stud1(15.2, 24.6, 4, null, "yellow"),
  stud1(16.2, 24.6, 4, null, "green"),
  stud1(17, 24.6, 4, C.amber),
  ...[14, 17.4].flatMap((x): IsoItem[] => [0, 1, 2].map((i): IsoItem => ({ color: "white", shade: C.wood, w: 0.5, h: 0.5, x, y: 23.6, z: 1 + i * 3, studs: false }))),
  { kind: "plate", color: "red", w: 4.4, h: 2.6, x: 13.8, y: 23.3, z: 10, studs: false },
  { kind: "plate", color: "white", w: 1.1, h: 2.6, x: 14.9, y: 23.3, z: 11, studs: false },
  { kind: "plate", color: "white", w: 1.1, h: 2.6, x: 17.1, y: 23.3, z: 11, studs: false },
];

const boat: IsoItem[] = [
  { color: "white", shade: C.wood, w: 2.4, h: 1.2, x: 5, y: 18.8, z: 2, studs: false, cls: "iso-boat" },
  { kind: "disc", color: "white", shade: C.skinA, d: 1, x: 5.7, y: 18.9, z: 5, studs: false, cls: "iso-boat" },
  { kind: "disc", color: "white", shade: C.butter, d: 1, x: 5.7, y: 18.9, z: 6, cls: "iso-boat" },
];

export const VILLAGE: IsoItem[] = [
  ...ground,
  ...library,
  ...clubhouse,
  ...flowerCottage,
  ...barn,
  ...studio,
  ...bridge,
  ...windmill,
  ...well,
  ...stall,
  ...boat,
  // trees: an orchard behind the houses, blossom by the water
  ...tree(0.3, 1),
  ...tree(9.5, 1.5, C.blossom),
  ...tree(15, 2),
  ...tree(21.5, 2.5, C.blossom, 3),
  ...tree(29, 2),
  ...tree(39, 0.6),
  ...tree(0.5, 22.5, C.blossom),
  ...tree(38, 22.5, C.leaf, 3),
  ...tree(40.5, 26.5, C.blossom),
  ...tree(17, 28.6),
  // lanterns along the lane and at the bridge
  ...lamp(1.5, 14),
  ...lamp(10, 14),
  ...lamp(20.8, 16),
  ...lamp(24.8, 16),
  ...lamp(34.5, 14.2),
  ...lamp(20.8, 21.8),
  ...lamp(24.8, 21.8),
  // ducks and lily pads on the canal
  stud1(12, 19.6, 2, C.cream),
  stud1(13.2, 18.4, 2, C.cream),
  stud1(29, 19, 2, C.cream),
  { kind: "disc", color: "green", shade: C.leaf, d: 1, x: 35, y: 19.6, z: 2, studs: false },
  { kind: "disc", color: "green", shade: C.leaf, d: 1, x: 36.4, y: 18.2, z: 2, studs: false },
  { kind: "disc", color: "white", shade: C.blossom, d: 0.5, x: 36.6, y: 18.4, z: 3, studs: false },
  { kind: "disc", color: "green", shade: C.leaf, d: 1, x: 17, y: 19.2, z: 2, studs: false },
  // flowers along the south bank
  ...flowers(1, 21.8, 4, 1, 0),
  ...flowers(12, 21.8, 5, 1, 0),
  ...flowers(27, 21.8, 4, 1, 0),
  // villagers: on the lane, at the stall, on the bridge, by the well
  ...person(5, 15.3, C.pink, C.skinA, C.wood, "iso-walk-a"),
  ...person(30, 15.2, C.teal, C.skinC, C.amber, "iso-walk-b"),
  ...person(38, 15.6, C.butter, C.skinB, C.barn),
  ...person(18, 15.6, C.mint, C.skinA, C.stone),
  ...person(22.6, 18.6, C.lavender, C.skinA, C.butter),
  ...person(15.6, 26, C.mint, C.skinB, C.wood),
  ...person(27.6, 26.6, C.barn, C.skinA, C.stone),
  ...person(13, 27.6, C.teal, C.skinC, C.pink, "iso-walk-c"),
];

/** baseplate bounds plus the tallest thing, so the drawing never changes size */
export const VILLAGE_BOUNDS: IsoItem[] = [
  { kind: "plate", color: "green", w: BASE_W, h: BASE_H, x: 0, y: 0, z: 0 },
  { color: "white", w: 1, h: 1, x: 0, y: 0, z: 30 },
];
