import { awards, builds, experience, skillLinks, skills } from "@/content/site";
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

/** Wall height = number of explicitly linked builds + 1. Nothing else. */
export function skillWalls(): { category: string; walls: SkillWall[] }[] {
  return Object.entries(skills).map(([category, list]) => ({
    category,
    walls: list.map((name) => {
      const linked = (skillLinks[name] ?? [])
        .map(buildBySlug)
        .filter((b): b is Build => Boolean(b));
      return { name, height: linked.length + 1, builds: linked };
    }),
  }));
}

export function awardBuild(i: number): Build | undefined {
  const slug = awards[i]?.relatedBuild;
  return slug ? buildBySlug(slug) : undefined;
}

export function publicationBuild(p: Publication): Build | undefined {
  return p.relatedBuild ? buildBySlug(p.relatedBuild) : undefined;
}

