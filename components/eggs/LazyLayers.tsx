"use client";

import dynamic from "next/dynamic";

// Lazy-mounted delight layer: none of this is needed to read the page.
const UnboxingIntro = dynamic(() => import("@/components/intro/UnboxingIntro"), { ssr: false });
const EasterEggs = dynamic(() => import("./EasterEggs"), { ssr: false });

export function LazyLayers() {
  return (
    <>
      <UnboxingIntro />
      <EasterEggs />
    </>
  );
}
