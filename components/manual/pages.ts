import type { Build, BuildStep } from "@/content/types";

export type ManualPage =
  | { kind: "cover" }
  | { kind: "challenge"; text: string }
  | { kind: "pieces"; pieces: string[] }
  | { kind: "step"; n: number; total: number; step: BuildStep }
  | { kind: "final"; finalModel: string | null; outcome: string }
  | { kind: "lessons"; lessons: string[] }
  | { kind: "back"; note: string | null; links: { label: string; href: string }[] };

const LINK_LABELS = { github: "Source on GitHub", report: "Read the report", demo: "Live demo" } as const;

/** Booklet pages for a build, each only if it has content. */
export function manualPages(b: Build): ManualPage[] {
  const pages: ManualPage[] = [{ kind: "cover" }];
  if (b.challenge) pages.push({ kind: "challenge", text: b.challenge });
  if (b.pieces.length) pages.push({ kind: "pieces", pieces: b.pieces });
  b.steps.forEach((step, i) => pages.push({ kind: "step", n: i + 1, total: b.steps.length, step }));
  if (b.finalModel || b.outcome) pages.push({ kind: "final", finalModel: b.finalModel, outcome: b.outcome });
  if (b.lessons.length) pages.push({ kind: "lessons", lessons: b.lessons });
  const links = (Object.keys(LINK_LABELS) as (keyof typeof LINK_LABELS)[])
    .filter((k) => b.links[k])
    .map((k) => ({ label: LINK_LABELS[k], href: b.links[k] as string }));
  if (b.note || links.length) pages.push({ kind: "back", note: b.note, links });
  return pages;
}

export const PAGE_TITLE: Record<ManualPage["kind"], string> = {
  cover: "Cover",
  challenge: "The Challenge",
  pieces: "Pieces Used",
  step: "Build Process",
  final: "Final Model",
  lessons: "Lessons Learned",
  back: "Back Cover",
};
