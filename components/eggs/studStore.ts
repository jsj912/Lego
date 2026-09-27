"use client";

import { useSyncExternalStore } from "react";

// Found hidden studs, persisted in localStorage (best effort; never required).
const KEY = "brick-portfolio:studs";
export const STUD_IDS = ["hero", "builds", "lab", "stats", "contact"] as const;
export type StudId = (typeof STUD_IDS)[number];

let found: ReadonlySet<StudId> = new Set();
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) found = new Set((JSON.parse(raw) as string[]).filter((id): id is StudId => (STUD_IDS as readonly string[]).includes(id)));
  } catch {
    // storage blocked: the hunt still works for this visit
  }
}

export function findStud(id: StudId) {
  load();
  if (found.has(id)) return;
  found = new Set([...found, id]);
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...found]));
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

export function resetStuds() {
  found = new Set();
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

const EMPTY: ReadonlySet<StudId> = new Set();

export function useFoundStuds(): ReadonlySet<StudId> {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => {
      load();
      return found;
    },
    () => EMPTY,
  );
}
