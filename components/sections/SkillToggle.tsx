"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

type Linked = { slug: string; set: string; title: string };

/** Skill name. When linked builds exist it becomes a disclosure (hover, focus or tap). */
export function SkillToggle({ name, builds }: { name: string; builds: Linked[] }) {
  const [pinned, setPinned] = useState(false);
  const id = useId();

  if (builds.length === 0) {
    return <p className="mt-3 text-sm font-medium leading-snug">{name}</p>;
  }

  return (
    <div className="group relative mt-3 w-full">
      <button
        type="button"
        aria-expanded={pinned}
        aria-controls={id}
        onClick={() => setPinned((v) => !v)}
        className="w-full rounded-md text-sm font-semibold leading-snug underline decoration-ink/25 decoration-dashed underline-offset-4 hover:decoration-ink"
      >
        {name}
      </button>
      <ul
        id={id}
        className={cn(
          "mt-2 space-y-1 text-left text-[0.8rem]",
          pinned ? "block" : "hidden group-hover:block group-focus-within:block",
        )}
      >
        {builds.map((b) => (
          <li key={b.slug}>
            <a href={`/builds/${b.slug}`} className="block rounded-md bg-bg px-2 py-1.5 leading-snug ring-1 ring-ink/8 hover:bg-brick-yellow">
              <span className="font-mono text-[0.7rem] text-ink-2">SET {b.set}</span>
              <span className="block">{b.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
