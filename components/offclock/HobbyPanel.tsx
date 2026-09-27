"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Hobby } from "@/content/offTheClock";
import { IsoStack } from "@/components/ui/IsoStack";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Detail panel for one hobby: blurb, extras from data, and its photos (lazy). */
export default function HobbyPanel({ hobby, photos, onClose }: { hobby: Hobby; photos: string[]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !ref.current) return;
      const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-modal flex items-end justify-center bg-ink/60 p-3 backdrop-blur-sm sm:items-center sm:p-6" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hobby-title"
        data-hobby-panel={hobby.id}
        className="max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-[var(--radius-panel)] bg-bg p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink-2">Off the clock</p>
            <h2 id="hobby-title" className="mt-1 text-3xl font-semibold">
              {hobby.title}
            </h2>
            {hobby.blurb && <p className="mt-2 text-lg text-ink-2">{hobby.blurb}</p>}
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface ring-1 ring-ink/10 hover:bg-brick-yellow">
            <X size={20} aria-hidden />
          </button>
        </div>

        {hobby.currentlyReading && (
          <p className="mt-5 inline-block rounded-lg bg-brick-yellow px-3 py-2 text-sm font-semibold">
            <span className="mr-2 font-mono text-[0.68rem] uppercase tracking-[0.14em]">Currently reading</span>
            {hobby.currentlyReading}
          </p>
        )}
        {hobby.books && hobby.books.length > 0 && (
          <div className="mt-6">
            <h3 className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink-2">On the shelf</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {hobby.books.map((b) => (
                <li key={b.title} className="flex items-baseline gap-2 rounded-lg bg-surface px-3 py-2 ring-1 ring-ink/10">
                  <span className="font-semibold">{b.title}</span>
                  {b.author && <span className="text-sm text-ink-2">{b.author}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        {hobby.runStats && hobby.runStats.length > 0 && (
          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {hobby.runStats.map((s) => (
              <div key={s.label} className="rounded-xl bg-surface p-3 ring-1 ring-ink/10">
                <dt className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-2">{s.label}</dt>
                <dd className="mt-1 text-lg font-semibold">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {photos.length > 0 ? (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((src, i) => (
              <li key={src} className="overflow-hidden rounded-xl bg-surface ring-1 ring-ink/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${hobby.title}, photo ${i + 1}`} loading="lazy" decoding="async" className="aspect-square h-full w-full object-cover" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-ink/20 bg-surface/60 px-6 py-10 text-center" data-photos-placeholder>
            <IsoStack items={[{ color: "white", w: 2, h: 2, outline: true }]} size={20} shadow={false} />
            <p className="font-semibold">Photos on the way</p>
            <p className="text-sm text-ink-2">This shelf is waiting for its first snapshots.</p>
          </div>
        )}
      </div>
    </div>
  );
}
