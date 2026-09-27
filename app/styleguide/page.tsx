import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { BlueprintGrid } from "@/components/ui/BlueprintGrid";
import { Brick } from "@/components/ui/Brick";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SnapButton } from "@/components/ui/SnapButton";
import { Stud } from "@/components/ui/Stud";
import { TiltCard } from "@/components/ui/TiltCard";
import type { BrickColor } from "@/lib/bricks";
import { PlaceDemo } from "./PlaceDemo";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const COLORS: BrickColor[] = ["red", "yellow", "blue", "green", "white", "dark"];

function Block({ title, children, dark }: { title: string; children: ReactNode; dark?: boolean }) {
  return (
    <section className={dark ? "on-dark relative overflow-hidden rounded-[var(--radius-panel)] bg-surface-dark p-8 text-ink-inverse" : "relative rounded-[var(--radius-panel)] bg-surface p-8 shadow-[var(--shadow-soft)]"}>
      <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] opacity-70">{title}</h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <main id="main" className="mx-auto max-w-6xl space-y-8 px-4 py-16 sm:px-8">
      <h1 className="text-5xl font-semibold">Styleguide</h1>

      <Block title="Palette">
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
          {["bg-bg", "bg-surface", "bg-surface-dark", "bg-brick-red", "bg-brick-yellow", "bg-brick-blue", "bg-brick-green", "bg-ink", "bg-ink-2"].map((c) => (
            <div key={c} className="space-y-2">
              <div className={`${c} h-16 rounded-2xl ring-1 ring-ink/10`} />
              <p className="font-mono text-xs">{c.replace("bg-", "")}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Brick · flat">
        <div className="flex flex-wrap items-end gap-6">
          {COLORS.map((c) => (
            <Brick key={c} color={c} studs={{ w: 4, h: 2 }} size={28} />
          ))}
          <Brick color="red" studs={{ w: 2, h: 1 }} size={28} glow />
          <Brick color="blue" studs={{ w: 3, h: 1 }} size={28} outline />
        </div>
      </Block>

      <Block title="Brick · isometric">
        <div className="flex flex-wrap items-end gap-8">
          {COLORS.map((c) => (
            <Brick key={c} color={c} studs={{ w: 2, h: 2 }} size={26} isometric />
          ))}
          <Brick color="yellow" studs={{ w: 4, h: 2 }} size={22} isometric glow />
          <Brick color="green" studs={{ w: 1, h: 1 }} size={40} isometric />
          <Brick color="blue" studs={{ w: 2, h: 2 }} size={26} isometric outline />
        </div>
      </Block>

      <Block title="Stud">
        <div className="flex items-center gap-4">
          {COLORS.map((c) => (
            <Stud key={c} color={c} size={28} />
          ))}
        </div>
      </Block>

      <Block title="SnapButton">
        <div className="flex flex-wrap items-center gap-5 pt-2">
          <SnapButton>Primary</SnapButton>
          <SnapButton variant="red">Red</SnapButton>
          <SnapButton variant="blue">Blue</SnapButton>
          <SnapButton variant="yellow">Yellow</SnapButton>
          <SnapButton variant="ghost">Ghost</SnapButton>
          <SnapButton size="sm">Small</SnapButton>
          <SnapButton size="lg">Large</SnapButton>
          <SnapButton disabled>Disabled</SnapButton>
          <SnapButton studs={false} variant="ghost">No studs</SnapButton>
        </div>
      </Block>

      <Block title="On dark" dark>
        <BlueprintGrid variant="dark" />
        <div className="relative flex flex-wrap items-center gap-5 pt-2">
          <SnapButton variant="light">Light</SnapButton>
          <SnapButton variant="yellow">Yellow</SnapButton>
          <Badge tone="dark">Dark badge</Badge>
        </div>
      </Block>

      <Block title="Badge">
        <div className="flex flex-wrap gap-3">
          <Badge>Neutral</Badge>
          <Badge tone="red">Red</Badge>
          <Badge tone="blue">Blue</Badge>
          <Badge tone="green">Green</Badge>
          <Badge tone="yellow">Yellow</Badge>
          <Badge tone="outline">Outline</Badge>
        </div>
      </Block>

      <Block title="BlueprintGrid">
        <div className="grid gap-4 sm:grid-cols-3">
          {(["lines", "dots"] as const).map((v) => (
            <div key={v} className="relative h-40 overflow-hidden rounded-2xl bg-bg ring-1 ring-ink/10">
              <BlueprintGrid variant={v} />
              <p className="absolute bottom-3 left-3 font-mono text-xs">{v}</p>
            </div>
          ))}
          <div className="relative h-40 overflow-hidden rounded-2xl bg-surface-dark">
            <BlueprintGrid variant="dark" />
            <p className="absolute bottom-3 left-3 font-mono text-xs text-ink-inverse">dark</p>
          </div>
        </div>
      </Block>

      <Block title="TiltCard">
        <div className="max-w-sm">
          <TiltCard>
            <div className="rounded-[var(--radius-card)] bg-bg p-8 shadow-[var(--shadow-lift)] ring-1 ring-ink/5">
              <Brick color="red" studs={{ w: 2, h: 2 }} size={24} isometric />
              <p className="mt-4 font-display text-xl font-semibold">Hover me</p>
            </div>
          </TiltCard>
        </div>
      </Block>

      <Block title="Place keyframe">
        <PlaceDemo />
      </Block>

      <Block title="SectionHeading">
        <SectionHeading id="sg-heading" eyebrow="Eyebrow label" title="Section title" intro="An optional intro line sits here." />
      </Block>
    </main>
  );
}
