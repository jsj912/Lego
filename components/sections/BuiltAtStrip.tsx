import { builtAt, education, experience } from "@/content/site";
import { logoPath } from "@/lib/assets";

/** "Where I've built": four flat 2×4 tiles with the organisations' logos (or names). */
export function BuiltAtStrip() {
  const tiles = builtAt.map((t) => {
    const exp = t.experience ? experience.find((e) => e.id === t.experience) : undefined;
    const ed = t.education !== undefined ? education[t.education] : undefined;
    return {
      ...t,
      logo: logoPath(t.logo),
      role: exp?.role ?? ed?.degree ?? null,
      when: exp ? `${exp.start} – ${exp.end}` : ed?.when ?? null,
    };
  });

  return (
    <div className="mt-8" data-built-at>
      <p className="font-mono text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-ink-2">Where I&rsquo;ve built</p>
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => (
          <li key={t.name} tabIndex={0} className="group relative rounded-[7px] outline-none focus-visible:ring-4 focus-visible:ring-brick-blue/60" data-built-tile>
            <div className="flat-tile flex h-16 items-center justify-center rounded-[7px] px-3 transition-transform duration-200 group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
              {t.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.logo} alt={t.name} loading="lazy" decoding="async" className="max-h-9 w-auto max-w-full object-contain" />
              ) : (
                <span className="text-center text-[0.8rem] font-semibold leading-tight text-ink">{t.name}</span>
              )}
            </div>
            {(t.role || t.when) && (
              <div className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-60 translate-y-1 rounded-xl bg-ink px-3 py-2 text-[0.8rem] leading-snug text-white opacity-0 shadow-lg transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                {t.logo && <span className="block font-semibold">{t.name}</span>}
                {t.role && <span className="block">{t.role}</span>}
                {t.when && <span className="mt-0.5 block font-mono text-[0.72rem] text-white/80">{t.when}</span>}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
