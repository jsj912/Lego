// Strict types for everything in content/site.ts.
// Components import these; facts only ever live in site.ts.

export type Person = {
  name: string;
  roles: string[];
  tagline: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  resumePath: string;
  phone: string | null;
};

export type Education = {
  school: string;
  degree: string;
  detail: string | null;
  when: string;
  where: string | null;
};

export type Experience = {
  id: string;
  /** slug of the build whose manual covers this role in depth */
  deepDive?: string;
  org: string;
  role: string;
  start: string;
  end: string;
  where: string;
  bullets: string[];
};

export type BuildKind = "internship" | "flagship" | "hackathon" | "project";

/** An image shown inside a manual page. */
export type Figure = {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
};

/** A labelled link to a document (e.g. a PDF write-up). */
export type DocLink = { label: string; href: string };

export type BuildStep = {
  title: string;
  body: string;
  /** optional labelled paragraphs under the body (e.g. Method / Results / Takeaway) */
  sections?: { heading: string; text: string }[];
  /** optional figure shown on the step page instead of the exploded model */
  figure?: Figure;
  /** optional explicit "N pieces this step" count */
  pieceCount?: number;
  link?: DocLink;
};

export type BuildLinks = {
  github: string | null;
  report: string | null;
  demo: string | null;
};

export type Build = {
  set: string;
  slug: string;
  kind: BuildKind;
  title: string;
  context: string | null;
  when: string | null;
  outcome: string;
  pieces: string[];
  challenge: string | null;
  steps: BuildStep[];
  finalModel: string | null;
  lessons: string[];
  note: string | null;
  /** team size / what I owned, when it was a team build */
  ownership?: string | null;
  /** full write-up, linked from the TL;DR page */
  writeup?: DocLink;
  /** extra figure pages inserted right after the build steps */
  figurePages?: { title: string; figures: Figure[] }[];
  links: BuildLinks;
};

export type PublicationStatus = "In preparation";

export type Publication = {
  authorship: string;
  title: string;
  venue: string | null;
  status: PublicationStatus;
  detail: string | null;
  relatedBuild: string | null;
};

export type Award = {
  title: string;
  detail: string | null;
  relatedBuild?: string;
};

export type Leadership = {
  org: string;
  role: string;
  when: string;
  detail: string | null;
};

export type Skills = Record<string, string[]>;

export type TimelineLane = "work" | "builds" | "campus";

export type TimelineEntry = {
  label: string;
  /** which conveyor belt the entry rides on */
  lane: TimelineLane;
  when: string;
  build?: string;
  experience?: string;
  upcoming?: boolean;
};
