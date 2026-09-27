import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HouseAssembly } from "@/components/eggs/HouseAssembly";
import { BlueprintGrid } from "@/components/ui/BlueprintGrid";

export const metadata: Metadata = {
  title: "Build incomplete",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
      <BlueprintGrid variant="lines" />
      <div className="relative">
        <p className="font-mono text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-ink-2">Error 404 · missing piece</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-0.03em] sm:text-7xl">BUILD INCOMPLETE</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-ink-2">This page isn&rsquo;t in any of the instruction manuals. The bricks are putting something else together instead.</p>
        <div className="mt-8">
          <HouseAssembly />
        </div>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-[var(--radius-brick)] bg-brick-red px-6 font-semibold text-white shadow-[var(--shadow-lift)] hover:-translate-y-0.5"
        >
          <ArrowLeft size={18} aria-hidden /> Back to the workshop
        </Link>
      </div>
    </main>
  );
}
