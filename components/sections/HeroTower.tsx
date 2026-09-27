import { IsoStack, type IsoItem } from "@/components/ui/IsoStack";

// An original tower, mid-assembly.
const STACK: IsoItem[] = [
  { color: "blue", w: 4, h: 2, x: 0, y: 0, z: 0 },
  { color: "yellow", w: 2, h: 2, x: 0, y: 0, z: 1 },
  { color: "red", w: 2, h: 2, x: 2, y: 0, z: 1 },
  { color: "green", w: 4, h: 2, x: 0, y: 0, z: 2 },
  { color: "white", w: 2, h: 2, x: 1, y: 0, z: 3 },
  { color: "red", w: 2, h: 1, x: 1, y: 1, z: 4 },
];

/** Decorative hero illustration built from the brick primitive. */
export function HeroTower() {
  return (
    <div aria-hidden className="relative mx-auto flex h-[440px] w-full max-w-[420px] items-end justify-center pb-6" data-hero-tower>
      <IsoStack items={STACK} size={40} />
    </div>
  );
}
