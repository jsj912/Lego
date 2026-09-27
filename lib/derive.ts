import { awards, builds, experience, skillAliases, skills } from "@/content/site";
import type { Build, BuildKind, Publication } from "@/content/types";

export function buildBySlug(slug: string): Build | undefined {
  return builds.find((b) => b.slug === slug);
}

export function experienceById(id: string) {
  return experience.find((e) => e.id === id);
}

export const KIND_LABEL: Record<BuildKind, string> = {
  internship: "Internship",
  flagship: "Flagship",
  hackathon: "Hackathon",
  project: "Project",
};

export const KIND_COLOR: Record<BuildKind, "red" | "blue" | "yellow" | "green"> = {
  internship: "blue",
  flagship: "red",
  hackathon: "yellow",
  project: "green",
};

/** "Target venue: X" only; papers are never rendered as accepted. */
export function venueLabel(p: Publication): string | null {
  return p.venue ? `Target venue: ${p.venue}` : null;
}

export type SkillWall = { name: string; height: number; builds: Build[] };

/** Does set tag `tag` count for `skill` (exact name, or via the alias map)? */
function tagCounts(tag: string, skill: string): boolean {
  return tag === skill || (skillAliases[tag] ?? []).includes(skill);
}

/** Studs = number of sets whose tags count for the skill, + 1. Nothing else. */
export function skillWalls(): { category: string; walls: SkillWall[] }[] {
  return Object.entries(skills).map(([category, list]) => ({
    category,
    walls: list.map((name) => {
      const linked = builds.filter((b) => b.pieces.some((t) => tagCounts(t, name)));
      return { name, height: linked.length + 1, builds: linked };
    }),
  }));
}

/** Set tags that don't count for any skill in the bins (for review, not rendered). */
export function unmatchedTags(): string[] {
  const all = Object.values(skills).flat();
  const tags = new Set(builds.flatMap((b) => b.pieces));
  return [...tags].filter((t) => !all.some((skill) => tagCounts(t, skill)));
}

export function awardBuild(i: number): Build | undefined {
  const slug = awards[i]?.relatedBuild;
  return slug ? buildBySlug(slug) : undefined;
}

export function publicationBuild(p: Publication): Build | undefined {
  return p.relatedBuild ? buildBySlug(p.relatedBuild) : undefined;
}

