import type { Build, BuildStep, DocLink, Figure } from "@/content/types";

export type ManualPage =
  | { kind: "cover" }
  | {
      kind: "tldr";
      problem: string | null;
      approach: string[];
      result: string;
      stack: string[];
      ownership: string | null;
      links: { label: string; href: string }[];
      writeup: DocLink | null;
    }
  | { kind: "challenge"; text: string }
  | { kind: "pieces"; pieces: string[] }
  /** a long step is split: "main" (text + model), "more" (labelled paragraphs), then its figure on a page of its own */
  | { kind: "step"; n: number; total: number; step: BuildStep; part?: "main" | "more" }
  | { kind: "figures"; title: string; figures: Figure[]; n: number; count: number }
  | { kind: "final"; finalModel: string | null; outcome: string }
  | { kind: "lessons"; lessons: string[] }
  | { kind: "back"; note: string | null; links: { label: string; href: string }[] };

const LINK_LABELS = { github: "Source on GitHub", report: "Read the report", demo: "Live demo" } as const;

/** Booklet pages for a build, each only if it has content. */
export function manualPages(b: Build): ManualPage[] {
  const links = (Object.keys(LINK_LABELS) as (keyof typeof LINK_LABELS)[])
    .filter((k) => b.links[k])
    .map((k) => ({ label: LINK_LABELS[k], href: b.links[k] as string }));
  const pages: ManualPage[] = [
    { kind: "cover" },
    { kind: "tldr", problem: b.challenge, approach: b.steps.map((s) => s.title), result: b.outcome, stack: b.pieces, ownership: b.ownership ?? null, links, writeup: b.writeup ?? null },
  ];
  if (b.challenge) pages.push({ kind: "challenge", text: b.challenge });
  if (b.pieces.length) pages.push({ kind: "pieces", pieces: b.pieces });
  b.steps.forEach((step, i) => {
    const base = { kind: "step" as const, n: i + 1, total: b.steps.length, step };
    if (step.sections?.length) {
      pages.push({ ...base, part: "main" }, { ...base, part: "more" });
      if (step.figure) pages.push({ kind: "figures", title: step.title, figures: [step.figure], n: 1, count: 1 });
    } else pages.push(base);
  });
  // one figure per page, so each gets the whole page
  (b.figurePages ?? []).forEach((f) => f.figures.forEach((fig, i) => pages.push({ kind: "figures", title: f.title, figures: [fig], n: i + 1, count: f.figures.length })));
  if (b.finalModel || b.outcome) pages.push({ kind: "final", finalModel: b.finalModel, outcome: b.outcome });
  if (b.lessons.length) pages.push({ kind: "lessons", lessons: b.lessons });
  if (b.note || links.length) pages.push({ kind: "back", note: b.note, links });
  return pages;
}

export const PAGE_TITLE: Record<ManualPage["kind"], string> = {
  cover: "Cover",
  tldr: "TL;DR",
  challenge: "The Challenge",
  pieces: "Pieces Used",
  step: "Build Process",
  figures: "Evidence",
  final: "Final Model",
  lessons: "Lessons Learned",
  back: "Back Cover",
};
