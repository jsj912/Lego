import { BriefcaseBusiness, CodeXml } from "lucide-react";

// Generic glyphs (this lucide version ships no brand marks).
export function LinkedinIcon({ size = 18 }: { size?: number }) {
  return <BriefcaseBusiness size={size} aria-hidden />;
}

export function GithubIcon({ size = 18 }: { size?: number }) {
  return <CodeXml size={size} aria-hidden />;
}
