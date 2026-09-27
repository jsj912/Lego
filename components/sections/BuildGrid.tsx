"use client";

import { ArrowUpRight } from "lucide-react";
import type { Build } from "@/content/types";
import { useManual } from "@/components/manual/ManualController";
import { SetCard } from "./SetCard";

export function BuildGrid({ builds }: { builds: Build[] }) {
  const { opening, open } = useManual();
  return (
    <ul className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {builds.map((b, i) => (
        <li key={b.slug}>
          <SetCard
            build={b}
            index={i}
            lidOpen={opening === b.slug || open === b.slug}
            action={
              <a
                href={`/builds/${b.slug}`}
                data-set-card={b.slug}
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-ink px-3.5 py-2 text-sm font-semibold text-white after:absolute after:inset-0 after:rounded-[var(--radius-card)] after:content-['']"
                aria-label={`Open the instruction manual for ${b.title}`}
              >
                Open manual <ArrowUpRight size={15} aria-hidden />
              </a>
            }
          />
        </li>
      ))}
    </ul>
  );
}
