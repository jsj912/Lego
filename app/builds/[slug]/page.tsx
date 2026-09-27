import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { builds } from "@/content/site";
import { ManualPageView } from "@/components/manual/ManualPageView";
import { manualPages } from "@/components/manual/pages";
import { buildBySlug } from "@/lib/derive";

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
    <main id="main" className="bp-lines min-h-dvh px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/#builds" className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold shadow-[var(--shadow-soft)] ring-1 ring-ink/5">
          <ArrowLeft size={16} aria-hidden /> All builds
        </Link>
        <h1 className="sr-only">{build.title}</h1>
        <ol className="mt-8 space-y-6">
          {pages.map((p, i) => (
            <li key={i} className="min-h-[420px] shadow-[var(--shadow-lift)] rounded-[var(--radius-card)]">
              <ManualPageView page={p} build={build} index={index} />
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
