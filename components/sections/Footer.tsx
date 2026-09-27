import { person } from "@/content/site";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { Brick } from "@/components/ui/Brick";
import { Mail } from "lucide-react";
import type { ReactNode } from "react";

export const TRADEMARK_DISCLAIMER =
  "LEGO® is a trademark of the LEGO Group, which does not sponsor, authorize or endorse this site.";

export function Footer({ egg }: { egg?: ReactNode }) {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative bg-surface-dark text-ink-inverse">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Brick color="red" studs={{ w: 2, h: 2 }} size={14} isometric />
              <p className="font-display text-xl font-semibold">{person.name}</p>
            </div>
            <p className="mt-3 max-w-sm text-sm text-ink-inverse-2">{person.tagline}</p>
          </div>

          <div className="flex items-center gap-3" data-egg-slot>
            {egg}
          </div>

          <ul className="flex gap-3" aria-label="Social links">
            <li>
              <a href={`mailto:${person.email}`} aria-label="Email" className="inline-flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-white/15 hover:bg-white/10">
                <Mail size={18} aria-hidden />
              </a>
            </li>
            <li>
              <a href={person.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="inline-flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-white/15 hover:bg-white/10">
                <LinkedinIcon />
              </a>
            </li>
            <li>
              <a href={person.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="inline-flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-white/15 hover:bg-white/10">
                <GithubIcon />
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line-dark pt-6 text-xs text-ink-inverse-2 md:flex-row md:justify-between">
          <p>
            © {year} {person.name}
          </p>
          <p data-disclaimer>{TRADEMARK_DISCLAIMER}</p>
        </div>
      </div>
    </footer>
  );
}
