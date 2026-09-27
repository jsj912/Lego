"use client";

import { ArrowUpRight } from "lucide-react";
import { builds as allBuilds } from "@/content/site";
import type { Build } from "@/content/types";
import { useManual } from "@/components/manual/ManualController";
import { SetCard } from "./SetCard";

function OpenLink({ b, compact }: { b: Build; compact?: boolean }) {
  return (
    <a
      href={`/builds/${b.slug}`}
      data-set-card={b.slug}
      className={
        compact
          ? "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-[0.8rem] font-semibold text-white after:absolute after:inset-0 after:rounded-2xl after:content-['']"
          : "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-ink px-3.5 py-2 text-sm font-semibold text-white after:absolute after:inset-0 after:rounded-[var(--radius-card)] after:content-['']"
      }
      aria-label={`Open the instruction manual for ${b.title}`}
    >
      Manual <ArrowUpRight size={15} aria-hidden />
    </a>
  );
}

export function BuildGrid({ featured, more }: { featured: Build[]; more: Build[] }) {
  const { opening, open } = useManual();
  const idx = (b: Build) => allBuilds.indexOf(b);
  return (
    <>
      <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((b) => (
          <li key={b.slug}>
            <SetCard build={b} index={idx(b)} lidOpen={opening === b.slug || open === b.slug} action={<OpenLink b={b} />} />
          </li>
        ))}
      </ul>
      {more.length > 0 && (
        <div className="mt-12">
          <h3 className="font-mono text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-ink-2">More sets</h3>
          <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {more.map((b) => (
              <li key={b.slug}>
                <SetCard variant="compact" build={b} index={idx(b)} action={<OpenLink b={b} compact />} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
