import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { builds } from "@/content/site";
import { ManualPageView } from "@/components/manual/ManualPageView";
import { manualPages } from "@/components/manual/pages";
import { Booklet } from "@/components/manual/Booklet";
import { buildBySlug, KIND_LABEL } from "@/lib/derive";

export const dynamicParams = false;

export function generateStaticParams() {
  return builds.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata(props: PageProps<"/builds/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const build = buildBySlug(slug);
  if (!build) return {};
  return {
    title: `${build.title} · SET ${build.set}`,
    description: build.outcome,
    alternates: { canonical: `/builds/${build.slug}` },
  };
}

export default async function BuildPage(props: PageProps<"/builds/[slug]">) {
  const { slug } = await props.params;
  const build = buildBySlug(slug);
  if (!build) notFound();
  const index = builds.indexOf(build);
  const pages = manualPages(build);

  return (
    <main id="main" className="on-dark bp-dark flex min-h-dvh flex-col bg-surface-dark px-3 py-5 text-ink-inverse sm:px-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-xs tracking-[0.18em] text-ink-inverse-2">
              SET {build.set} · {KIND_LABEL[build.kind].toUpperCase()} · INSTRUCTION MANUAL
            </p>
            <h1 className="text-xl font-semibold sm:text-2xl">{build.title}</h1>
          </div>
          <Link
            href="/#builds"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/20"
          >
            <ArrowLeft size={16} aria-hidden /> All builds
          </Link>
        </div>
        <div className="h-[min(760px,82dvh)]">
          <Booklet build={build} index={index} pages={pages} />
        </div>

        <details className="mt-10 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
          <summary className="cursor-pointer font-semibold">Read the whole manual as text</summary>
          <ol className="mt-5 space-y-5">
            {pages.map((p, i) => (
              <li key={i} className="min-h-[420px] overflow-hidden rounded-2xl text-ink">
                <ManualPageView page={p} build={build} index={index} />
              </li>
            ))}
          </ol>
        </details>
      </div>
    </main>
  );
}
