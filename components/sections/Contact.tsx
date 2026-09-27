import { FileText, Mail } from "lucide-react";
import { person } from "@/content/site";
import { BlueprintGrid } from "@/components/ui/BlueprintGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { eyebrowOf } from "@/lib/sections";
import { ContactForm } from "./ContactForm";
import { CopyEmail } from "./CopyEmail";

export function Contact({ resumeHref }: { resumeHref: string | null }) {
  return (
    <SectionShell id="contact" labelledBy="contact-title" className="overflow-hidden py-28 sm:py-36">
      <BlueprintGrid variant="dots" />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
        <div>
          <SectionHeading
            id="contact-title"
            eyebrow={eyebrowOf("contact")}
            title="Let's build something incredible together."
            titleClassName="md:text-5xl"
            intro="Email is fastest. Or fill in the form: each field snaps a brick into place and the last brick sends it."
          />
          <ul className="mt-10 space-y-3">
            <li className="flex flex-wrap items-center gap-3">
              <a href={`mailto:${person.email}`} className="inline-flex items-center gap-3 font-medium hover:text-brick-blue">
                <Mail size={18} aria-hidden /> {person.email}
              </a>
              <CopyEmail email={person.email} />
            </li>
            {resumeHref && (
              <li>
                <a href={resumeHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 font-medium hover:text-brick-blue">
                  <FileText size={18} aria-hidden /> Résumé (PDF)
                </a>
              </li>
            )}
            <li>
              <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 font-medium hover:text-brick-blue">
                <LinkedinIcon size={18} /> LinkedIn
              </a>
            </li>
            <li>
              <a href={person.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 font-medium hover:text-brick-blue">
                <GithubIcon size={18} /> GitHub
              </a>
            </li>
          </ul>
        </div>
        <div className="rounded-[var(--radius-panel)] bg-bg/80 p-6 shadow-[var(--shadow-lift)] ring-1 ring-ink/5 backdrop-blur-sm sm:p-10">
          <ContactForm to={person.email} />
        </div>
      </div>
    </SectionShell>
  );
}
