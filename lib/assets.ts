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

/** Build-time listing of the photos in /public/interests/<folder>/, sorted by name. */
export function interestPhotos(folder: string): string[] {
  const dir = join(PUBLIC, "interests", folder);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => PHOTO_EXT.test(f))
    .sort()
    .map((f) => `/interests/${folder}/${encodeURIComponent(f)}`);
}
