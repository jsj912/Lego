// Roof colours of the five houses in the /off-the-clock village: used for each
// house's card and for the room you step into.

export type RoofTone = { base: string; dark: string; light: string };
export const ROOF_TONES = {
  teal: { base: "#7cc4c0", dark: "#4f9a97", light: "#a9dedb" },
  pink: { base: "#f2b5c4", dark: "#d98ba0", light: "#f9d3dc" },
  lavender: { base: "#c3a6e0", dark: "#9a7cc0", light: "#dcc8f0" },
  yellow: { base: "#f3d36b", dark: "#d2ad3c", light: "#f9e59d" },
  mint: { base: "#a8d5a2", dark: "#79b274", light: "#c9e8c4" },
} satisfies Record<string, RoofTone>;
