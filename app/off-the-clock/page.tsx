import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { hobbies } from "@/content/offTheClock";
import { person } from "@/content/site";
import { Street } from "@/components/offclock/Street";
import { Footer } from "@/components/sections/Footer";
import { BlueprintGrid } from "@/components/ui/BlueprintGrid";
import { interestPhotos } from "@/lib/assets";

export const metadata: Metadata = {
  title: `Off the clock · ${person.name}`,
  description: `A little street of hobbies, built by ${person.name}.`,
  alternates: { canonical: "/off-the-clock" },
};

export default function OffTheClockPage() {
  const photos = Object.fromEntries(hobbies.map((h) => [h.id, interestPhotos(h.folder)]));
  return (
    <div data-page-root>
      <main id="main" className="relative bg-bg">
        <div className="relative overflow-hidden">
          <BlueprintGrid variant="dots" />
          <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold shadow-[var(--shadow-soft)] ring-1 ring-ink/5 hover:bg-brick-yellow"
              data-back-link
            >
              <ArrowLeft size={16} aria-hidden /> Back to the workshop
            </Link>
            <p className="mt-10 font-mono text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-ink-2">Book nook</p>
            <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Off the clock</h1>
            <p className="mt-3 max-w-xl text-lg text-ink-2">A little street between two books. Scroll to stroll; step into any shop.</p>
          </div>
        </div>
        <Street hobbies={hobbies} photos={photos} />
      </main>
      <Footer offClockLink={false} />
    </div>
  );
}
