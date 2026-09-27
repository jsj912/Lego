"use client";

import { FileText, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Brick } from "@/components/ui/Brick";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { cn } from "@/lib/cn";
import { SECTIONS } from "@/lib/sections";

const LINKS = SECTIONS.filter((s) => s.id !== "start");

export function Nav({ name, resumeHref }: { name: string; resumeHref: string | null }) {
  const { active } = useSectionProgress();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      data-site-nav
      className={cn(
        "fixed inset-x-0 top-0 z-nav h-[var(--nav-h)] transition-[background-color,box-shadow] duration-300",
        scrolled || open ? "bg-bg/85 shadow-[0_1px_0_rgb(17_17_17/0.06)] backdrop-blur-md" : "bg-transparent",
      )}
    >
      <nav aria-label="Primary" className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <a href="#start" className="flex items-center gap-2.5 rounded-md font-display text-[0.95rem] font-semibold tracking-tight">
          <Brick color="red" studs={{ w: 2, h: 2 }} size={11} isometric />
          <span>{name}</span>
        </a>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                data-nav={s.id}
                aria-current={active === s.id ? "location" : undefined}
                className={cn(
                  "rounded-full px-2.5 py-1.5 text-[0.84rem] font-medium transition-colors xl:px-3",
                  active === s.id ? "bg-ink text-white" : "text-ink-2 hover:bg-ink/[0.05] hover:text-ink",
                )}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
        {resumeHref && (
          <a
            href={resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            data-nav-resume
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-3.5 text-[0.84rem] font-semibold text-white hover:bg-brick-red"
          >
            <FileText size={15} aria-hidden /> Résumé
          </a>
        )}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-ink/10 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
        </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-bg/95 px-4 pb-6 pt-2 backdrop-blur-md lg:hidden">
          <ul className="grid grid-cols-2 gap-2">
            {LINKS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === s.id ? "location" : undefined}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-sm font-medium ring-1 ring-ink/10",
                    active === s.id ? "bg-ink text-white" : "bg-surface",
                  )}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
