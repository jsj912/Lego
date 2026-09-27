export type BrickColor = "red" | "yellow" | "blue" | "green" | "white" | "dark";

type Shades = { base: string; light: string; dark: string; darker: string; text: string };

/** Face shades for each brick colour (top = light, left = base, right = dark). */
export const BRICK_SHADES: Record<BrickColor, Shades> = {
  red: { base: "#D01012", light: "#E8403F", dark: "#A60B0D", darker: "#7E0809", text: "#FFFFFF" },
  yellow: { base: "#FFD500", light: "#FFE34D", dark: "#DDB400", darker: "#B89500", text: "#111111" },
  blue: { base: "#0055BF", light: "#2A78DA", dark: "#004196", darker: "#003070", text: "#FFFFFF" },
  green: { base: "#237841", light: "#3A9559", dark: "#1A5C32", darker: "#124424", text: "#FFFFFF" },
  white: { base: "#F2F1EC", light: "#FFFFFF", dark: "#D9D7CE", darker: "#BDBBB1", text: "#111111" },
  dark: { base: "#2A2A2A", light: "#3A3A3A", dark: "#1C1C1C", darker: "#111111", text: "#FFFFFF" },
};

export const BRICK_CYCLE: BrickColor[] = ["red", "blue", "yellow", "green"];

export function brickColorAt(i: number): BrickColor {
  return BRICK_CYCLE[((i % BRICK_CYCLE.length) + BRICK_CYCLE.length) % BRICK_CYCLE.length];
}
