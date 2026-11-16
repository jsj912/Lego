import { IsoStack, type IsoItem } from "@/components/ui/IsoStack";
import type { BrickColor } from "@/lib/bricks";

/**
 * An original brick-built trophy: a stepped plinth with a plaque, a column,
 * a two-handled cup that widens to its rim, and a jewel on top.
 * Variant 0 is the gold cup, variant 1 the silver one. Decorative.
 */
function trophy(cup: BrickColor, rim: BrickColor, plinth: BrickColor, jewel: BrickColor): IsoItem[] {
  const plaque = { a: 1, z: 0.22, w: 2, h: 0.76, fill: "#ffd500", text: "★" };
  return [
    // plinth
    { color: "dark", w: 5, h: 5, x: 0, y: 0, z: 0, studs: false },
    {
      color: plinth, w: 4, h: 4, x: 0.5, y: 0.5, z: 3, studs: false,
      decals: [{ face: "front", ...plaque }, { face: "side", ...plaque }],
    },
    { kind: "plate", color: "dark", w: 3, h: 3, x: 1, y: 1, z: 6, studs: false },
    // column
    { kind: "round", color: rim, x: 2, y: 2, z: 7, studs: false },
    { kind: "round", color: cup, x: 2, y: 2, z: 10, studs: false },
    { kind: "plate", color: rim, w: 2, h: 2, x: 1.5, y: 1.5, z: 13, studs: false },
    // cup
    { color: cup, w: 3, h: 3, x: 1, y: 1, z: 14, studs: false },
    { color: cup, w: 4, h: 4, x: 0.5, y: 0.5, z: 17, studs: false },
    { color: cup, w: 4, h: 4, x: 0.5, y: 0.5, z: 20, studs: false },
    // handles
    { color: cup, w: 1, h: 1, x: -0.5, y: 3.5, z: 20, studs: false },
    { kind: "plate", color: rim, w: 1, h: 1, x: -0.5, y: 3.5, z: 23, studs: false },
    { color: cup, w: 1, h: 1, x: 3.5, y: -0.5, z: 20, studs: false },
    { kind: "plate", color: rim, w: 1, h: 1, x: 3.5, y: -0.5, z: 23, studs: false },
    // rim and jewel
    { kind: "plate", color: rim, w: 5, h: 5, x: 0, y: 0, z: 23 },
    { kind: "round", color: jewel, x: 2, y: 2, z: 24 },
  ];
}

const GOLD = trophy("yellow", "yellow", "red", "red");
const SILVER = trophy("grey", "white", "blue", "blue");

export function Trophy({ variant }: { variant: 0 | 1 }) {
  return (
    <div aria-hidden className="relative">
      <IsoStack items={variant === 0 ? GOLD : SILVER} size={14} />
      {variant === 0 && (
        <>
          <span className="sparkle absolute -left-2 top-6" />
          <span className="sparkle absolute -right-1 top-16" style={{ animationDelay: "-1.1s" }} />
          <span className="sparkle absolute left-6 -top-2" style={{ animationDelay: "-2s" }} />
        </>
      )}
    </div>
  );
}
