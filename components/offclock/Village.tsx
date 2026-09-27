import { IsoStack, type IsoItem } from "@/components/ui/IsoStack";
import type { BrickColor } from "@/lib/bricks";

// Original brick-village props for the /off-the-clock street. Decorative.

const TREE: IsoItem[] = [
  { kind: "plate", color: "green", w: 3, h: 3, x: 0, y: 0, z: 0 },
  { kind: "round", color: "dark", x: 1, y: 1, z: 1, studs: false },
  { kind: "round", color: "dark", x: 1, y: 1, z: 4, studs: false },
  { color: "green", w: 3, h: 3, x: 0, y: 0, z: 7 },
  { color: "green", w: 3, h: 3, x: 0, y: 0, z: 10 },
  { color: "green", w: 2, h: 2, x: 0.5, y: 0.5, z: 13 },
  { kind: "round", color: "green", x: 1, y: 1, z: 16 },
];

const flowerBed = (a: BrickColor, b: BrickColor): IsoItem[] => [
  { color: "white", w: 4, h: 2, x: 0, y: 0, z: 0, studs: false },
  { kind: "plate", color: "green", w: 4, h: 2, x: 0, y: 0, z: 3 },
  { kind: "round", color: a, x: 0.2, y: 0.4, z: 4 },
  { kind: "round", color: b, x: 1.3, y: 0.6, z: 4 },
  { kind: "round", color: a, x: 2.4, y: 0.3, z: 4 },
  { kind: "round", color: b, x: 3, y: 0.9, z: 4 },
];

const LAMP: IsoItem[] = [
  { kind: "plate", color: "dark", w: 2, h: 2, x: 0, y: 0, z: 0 },
  ...[1, 4, 7, 10, 13].map((z) => ({ kind: "round" as const, color: "dark" as BrickColor, x: 0.5, y: 0.5, z, studs: false })),
  { kind: "plate", color: "dark", w: 2, h: 2, x: 0, y: 0, z: 16 },
  { kind: "round", color: "yellow", x: 0.5, y: 0.5, z: 17, studs: false },
  { kind: "plate", color: "dark", w: 2, h: 2, x: 0, y: 0, z: 20 },
];

/** A prop that stands between two shops. */
export function StreetProp({ i }: { i: number }) {
  const kind = i % 3;
  return (
    <div aria-hidden className="flex shrink-0 items-end gap-2 self-end pb-[34px]">
      {kind === 0 && <IsoStack items={TREE} size={16} />}
      {kind === 1 && (
        <>
          <IsoStack items={LAMP} size={13} />
          <IsoStack items={flowerBed("red", "yellow")} size={12} />
        </>
      )}
      {kind === 2 && (
        <>
          <IsoStack items={flowerBed("blue", "white")} size={12} />
          <IsoStack items={TREE} size={13} />
        </>
      )}
    </div>
  );
}

/** A cloud of white round plates. */
export function BrickCloud({ w = 120 }: { w?: number }) {
  const puffs = [
    [20, 34, 16], [40, 24, 20], [64, 20, 22], [88, 28, 18], [104, 36, 14], [60, 38, 18], [34, 40, 14],
  ];
  return (
    <svg viewBox="0 0 124 56" width={w} height={(w * 56) / 124} aria-hidden>
      {puffs.map(([cx, cy, r], i) => (
        <g key={i}>
          <ellipse cx={cx} cy={cy + 4} rx={r} ry={r * 0.72} fill="#d9e4ee" />
          <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.72} fill="#ffffff" />
          <ellipse cx={cx - r * 0.3} cy={cy - r * 0.25} rx={r * 0.35} ry={r * 0.2} fill="#ffffff" opacity={0.9} />
        </g>
      ))}
      {[[40, 16], [64, 11], [88, 19]].map(([x, y], i) => (
        <g key={`s${i}`}>
          <ellipse cx={x} cy={y + 2} rx={5} ry={3} fill="#d9e4ee" />
          <ellipse cx={x} cy={y} rx={5} ry={3} fill="#ffffff" />
        </g>
      ))}
    </svg>
  );
}

/** Rolling studded hills: a long strip meant to sit behind the street. */
export function BrickHills({ width = 3200 }: { width?: number }) {
  const h = 150;
  const hills = [
    `M0 ${h} L0 90 Q 160 20 340 80 T 700 70 T 1060 60 T 1420 84 T 1780 58 T 2140 76 T 2500 62 T 2860 80 T ${width} 70 L ${width} ${h} Z`,
    `M0 ${h} L0 118 Q 220 70 460 110 T 940 100 T 1420 112 T 1900 96 T 2380 114 T 2860 100 T ${width} 108 L ${width} ${h} Z`,
  ];
  return (
    <svg viewBox={`0 0 ${width} ${h}`} width={width} height={h} aria-hidden className="block">
      <defs>
        <pattern id="hill-studs-a" width="18" height="14" patternUnits="userSpaceOnUse">
          <ellipse cx="9" cy="7" rx="4" ry="2.6" fill="rgb(255 255 255 / 0.16)" />
        </pattern>
        <pattern id="hill-studs-b" width="18" height="14" patternUnits="userSpaceOnUse" patternTransform="translate(9 0)">
          <ellipse cx="9" cy="7" rx="4" ry="2.6" fill="rgb(255 255 255 / 0.14)" />
        </pattern>
      </defs>
      <path d={hills[0]} fill="#6fae6a" />
      <path d={hills[0]} fill="url(#hill-studs-a)" />
      <path d={hills[1]} fill="#3f8f4f" />
      <path d={hills[1]} fill="url(#hill-studs-b)" />
    </svg>
  );
}
