import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const PUBLIC = join(process.cwd(), "public");
const LOGO_EXT = ["svg", "png", "webp", "jpg", "jpeg"];
const PHOTO_EXT = /\.(jpe?g|png|webp|avif)$/i;

/** Build-time lookup: /logos/<name>.<ext> if the file exists, else null. */
export function logoPath(name: string): string | null {
  for (const ext of LOGO_EXT) {
    if (existsSync(join(PUBLIC, "logos", `${name}.${ext}`))) return `/logos/${name}.${ext}`;
  }
  return null;
}

export type Photo = { src: string; alt: string; caption?: string };

/**
 * Build-time listing of the photos in /public/interests/<folder>/, sorted by name.
 * Alt text comes from the file name: "03-red-roses.webp" → "red roses".
 */
export function interestPhotos(folder: string): Photo[] {
  const dir = join(PUBLIC, "interests", folder);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => PHOTO_EXT.test(f))
    .sort()
    .map((f) => ({
      src: `/interests/${folder}/${encodeURIComponent(f)}`,
      alt: f.replace(PHOTO_EXT, "").replace(/^\d+[-_ ]*/, "").replace(/[-_]+/g, " ").trim(),
    }));
}
