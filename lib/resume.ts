import { existsSync } from "node:fs";
import { join } from "node:path";
import { person } from "@/content/site";

/** Evaluated at build time: hide the resume button when the file is missing. */
export function resumeHref(): string | null {
  const file = join(process.cwd(), "public", person.resumePath.replace(/^\//, ""));
  return existsSync(file) ? person.resumePath : null;
}
