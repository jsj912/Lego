import { builds, focusAreas, publications } from "@/content/site";
import { Badge } from "@/components/ui/Badge";
import { IsoStack } from "@/components/ui/IsoStack";
import { BLUEPRINT_RIG, BUILD_MODELS, boxModel } from "@/components/ui/models";
import { eyebrowOf } from "@/lib/sections";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { publicationBuild } from "@/lib/derive";
import { BlueprintLines } from "./BlueprintLines";

const LINE = { stroke: "#dce9ff", fill: "#0d4288" };
const CALLOUTS = [
  ["left-6 top-6", "A"],
  ["right-6 top-14", "B"],
  ["left-10 bottom-12", "C"],
] as const;

function Callouts() {
  return (
    <>
      {CALLOUTS.map(([pos, letter]) => (
        <span key={letter} aria-hidden className={`callout absolute ${pos} flex h-6 w-6 items-center justify-center rounded-full border border-blueprint-line/80 font-mono text-[0.65rem] text-blueprint-line`}>
          {letter}
        </span>
      ))}
    </>
  );
}

export function Lab() {
  return (
    <SectionShell id="lab" labelledBy="lab-title" dark className="bp-blueprint overflow-hidden py-28 sm:py-36">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end gap-10">
        <SectionHeading
          id="lab-title"
          eyebrow={eyebrowOf("lab")}
          title="Research"
          intro="Papers on the drafting table, all in preparation, plus the threads they come from."
          dark
          className="shrink-0"
        />
          <div aria-hidden className="relative hidden h-40 min-w-0 flex-1 lg:block">
            <BlueprintLines variant="header" />
          </div>
        </div>

        <ol className="mt-16 grid gap-7 lg:grid-cols-3">
          {publications.map((p, i) => {
            const related = publicationBuild(p);
            const model = related ? (BUILD_MODELS[related.slug] ?? boxModel(builds.indexOf(related), "grey", "grey")) : BLUEPRINT_RIG;
            return (
              <li key={p.title} className="relative flex flex-col bg-[#0a3068] p-2 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]">
                {/* drawing frame */}
                <div className="flex flex-1 flex-col border border-blueprint-line/60 p-1">
                  <div className="flex flex-1 flex-col border border-blueprint-line/30">
                    {/* drawing area */}
                    <div className="relative flex h-56 items-center justify-center border-b border-blueprint-line/30">
                      <Callouts />
                      <div className="relative">
                        <IsoStack items={model} size={17} line={LINE} />
                      </div>
                      {/* dimension line */}
                      <div aria-hidden className="absolute inset-x-10 bottom-4 flex items-center text-blueprint-line/80">
                        <span className="h-3 border-l border-current" />
                        <span className="dim-arrow-l" />
                        <span className="h-px flex-1 bg-current" />
                        <span className="dim-arrow-r" />
                        <span className="h-3 border-l border-current" />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-semibold leading-snug text-white">{p.title}</h3>
                      {p.detail && <p className="mt-3 text-[0.95rem] leading-relaxed text-blueprint-line/85">{p.detail}</p>}
                      {related && (
                        <a
                          href={`/builds/${related.slug}`}
                          className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-brick-yellow underline-offset-4 hover:underline"
                        >
                          Related build: SET {related.set} · {related.title}
                        </a>
                      )}
                    </div>

                    {/* title block */}
                    <dl className="mt-auto grid grid-cols-2 border-t border-blueprint-line/30 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-blueprint-line">
                      <div className="border-r border-blueprint-line/30 px-3 py-2">
                        <dt className="opacity-70">Sheet</dt>
                        <dd className="mt-0.5 text-white">
                          {String(i + 1).padStart(2, "0")} / {String(publications.length).padStart(2, "0")}
                        </dd>
                      </div>
                      <div className="px-3 py-2">
                        <dt className="opacity-70">Role</dt>
                        <dd className="mt-0.5 normal-case tracking-normal text-white">{p.authorship}</dd>
                      </div>
                      <div className="col-span-2 flex flex-wrap items-center justify-between gap-2 border-t border-blueprint-line/30 px-3 py-2">
                        <div>
                          <dt className="opacity-70">Status</dt>
                          <dd className="mt-1">
                            <Badge tone="yellow">{p.status}</Badge>
                          </dd>
                        </div>
                        {p.venue && (
                          <div className="text-right">
                            <dt className="opacity-70">Target venue</dt>
                            <dd className="mt-1 normal-case tracking-normal text-white">{p.venue}</dd>
                          </div>
                        )}
                      </div>
                    </dl>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* parts list */}
        <div className="mt-20 flex gap-10">
        <div className="w-full max-w-3xl">
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-blueprint-line/80">Parts list · research threads</h3>
          <table className="mt-5 w-full border border-blueprint-line/40 bg-[#0a3068] text-left">
            <thead className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-blueprint-line/80">
              <tr className="border-b border-blueprint-line/40">
                <th scope="col" className="w-20 border-r border-blueprint-line/40 px-4 py-2 font-medium">No.</th>
                <th scope="col" className="px-4 py-2 font-medium">Thread</th>
              </tr>
            </thead>
            <tbody>
              {focusAreas.map((area, i) => (
                <tr key={area} className="border-b border-blueprint-line/20 last:border-0">
                  <td className="border-r border-blueprint-line/40 px-4 py-3 font-mono text-sm text-brick-yellow">T{String(i + 1).padStart(2, "0")}</td>
                  <td className="px-4 py-3 text-white">{area}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          <div aria-hidden className="relative hidden min-w-0 flex-1 lg:block">
            <BlueprintLines variant="table" />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
