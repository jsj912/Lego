"use client";

import { useEffect, useRef } from "react";
import { IsoStack } from "@/components/ui/IsoStack";
import { HERO_MACHINE } from "@/components/ui/models";

/** Hero illustration: a meshing gear train that turns as the page scrolls. */
export function HeroTower() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      el.style.setProperty("--gear-rot", `${window.scrollY * 0.35}deg`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="relative mx-auto flex w-full max-w-[520px] items-end justify-center" data-hero-machine>
      <IsoStack items={HERO_MACHINE} size={30} />
    </div>
  );
}
