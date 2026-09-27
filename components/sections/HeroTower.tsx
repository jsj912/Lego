import { IsoStack } from "@/components/ui/IsoStack";
import { MONUMENT } from "@/components/ui/models";

/** Decorative hero illustration: an original brick-built monument. */
export function HeroTower() {
  return (
    <div aria-hidden className="group relative mx-auto flex h-[480px] w-full max-w-[460px] items-end justify-center pb-6" data-hero-tower>
      <IsoStack items={MONUMENT} size={32} />
    </div>
  );
}
