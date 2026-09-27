"use client";

import { cn } from "@/lib/cn";
import { findStud, useFoundStuds, type StudId } from "./studStore";

/** A tiny, keyboard-focusable stud tucked into a section corner. */
export function HiddenStud({ id, className }: { id: StudId; className?: string }) {
  const found = useFoundStuds().has(id);
  return (
    <button
      type="button"
      aria-label="Hidden stud"
      aria-pressed={found}
      data-hidden-stud={id}
      onClick={() => findStud(id)}
      className={cn(
        "group absolute z-20 flex h-6 w-6 items-center justify-center rounded-full transition-transform hover:scale-125 focus-visible:scale-125",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "block h-3 w-3 rounded-full shadow-[inset_0_-1px_0_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.6)] transition-colors",
          found ? "bg-brick-yellow" : "bg-current/20 group-hover:bg-brick-yellow/70",
        )}
      />
    </button>
  );
}
