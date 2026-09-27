import type { BrickColor } from "./bricks";

/** The eight home sections, in page order. Labels are UI copy. */
export const SECTIONS = [
  { id: "start", label: "Build Start", color: "red" },
  { id: "workshop", label: "Workshop", color: "blue" },
  { id: "builds", label: "Builds", color: "yellow" },
  { id: "lab", label: "Innovation Lab", color: "green" },
  { id: "journey", label: "Conveyor", color: "red" },
  { id: "stats", label: "Brick Stats", color: "blue" },
  { id: "trophies", label: "Trophy Shelf", color: "yellow" },
  { id: "contact", label: "Contact", color: "green" },
] as const satisfies readonly { id: string; label: string; color: BrickColor }[];

export type SectionId = (typeof SECTIONS)[number]["id"];
