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
  org: string;
  role: string;
  start: string;
  end: string;
  where: string;
  bullets: string[];
};

export type BuildKind = "internship" | "flagship" | "hackathon" | "project";

export type BuildStep = {
  title: string;
  body: string;
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
