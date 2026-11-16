import { BuildPlate } from "./BuildPlate";

/** "Your turn": a free-build baseplate between Education and Contact. Not a nav section. */
export function Playground() {
  return (
    <section id="playground" aria-labelledby="playground-title" className="relative bg-surface/60 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-mono text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-ink-2">
            <span aria-hidden className="mr-2 inline-block h-2 w-2 translate-y-[-1px] rounded-[2px] bg-brick-red" />
            Free build
          </p>
          <h2 id="playground-title" className="mt-3 text-4xl font-semibold leading-[1.05] sm:text-5xl">
            Your turn.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
            The duck is mine. Pick a colour and a brick, then click any stud to drop it on; bricks stack on whatever is underneath.
          </p>
        </header>
        <div className="mt-12">
          <BuildPlate />
        </div>
      </div>
    </section>
  );
}
