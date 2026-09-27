import { Brick } from "@/components/ui/Brick";
import type { BrickColor } from "@/lib/bricks";

/** An original trophy assembled from bricks. Decorative. */
export function Trophy({ variant }: { variant: 0 | 1 }) {
  const cup: BrickColor = variant === 0 ? "yellow" : "white";
  return (
    <div aria-hidden className="relative flex flex-col items-center">
      {/* cup */}
      <div className="flex items-end gap-1">
        <Brick color={cup} studs={{ w: 1, h: 1 }} size={22} className="-mb-1" />
        <Brick color={cup} studs={{ w: 4, h: 1 }} size={22} />
        <Brick color={cup} studs={{ w: 1, h: 1 }} size={22} className="-mb-1" />
      </div>
      <Brick color={cup} studs={{ w: 3, h: 1 }} size={22} className="-mt-2" />
      <Brick color={cup} studs={{ w: 2, h: 1 }} size={22} className="-mt-2" />
      {/* stem */}
      <Brick color="dark" studs={{ w: 1, h: 1 }} size={22} className="-mt-2" />
      <Brick color="dark" studs={{ w: 1, h: 1 }} size={22} className="-mt-2" />
      {/* base */}
      <Brick color={variant === 0 ? "red" : "blue"} studs={{ w: 3, h: 1 }} size={22} className="-mt-2" />
      <Brick color="dark" studs={{ w: 4, h: 1 }} size={22} className="-mt-2" />
    </div>
  );
}
