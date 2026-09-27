import type { BrickColor } from "./bricks";

/**
 * The eight home sections, in page order. `label` is the plain nav label;
 * `eyebrow` is the themed name shown above each heading. Both are UI copy.
 */
export const SECTIONS = [
  { id: "start", label: "Home", eyebrow: "Build start", color: "red" },
  { id: "journey", label: "Experience", eyebrow: "Conveyor", color: "blue" },
  { id: "builds", label: "Projects", eyebrow: "The sets", color: "yellow" },
  { id: "lab", label: "Research", eyebrow: "Innovation lab", color: "green" },
  { id: "stats", label: "Skills", eyebrow: "Parts bin", color: "red" },
  { id: "trophies", label: "Awards & Leadership", eyebrow: "Trophy shelf", color: "blue" },
  { id: "workshop", label: "Education", eyebrow: "Workshop", color: "yellow" },
  { id: "contact", label: "Contact", eyebrow: "Final brick", color: "green" },
] as const satisfies readonly { id: string; label: string; eyebrow: string; color: BrickColor }[];

export type SectionId = (typeof SECTIONS)[number]["id"];

export const eyebrowOf = (id: SectionId) => SECTIONS.find((s) => s.id === id)?.eyebrow ?? "";
