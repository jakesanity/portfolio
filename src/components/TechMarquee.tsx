import { skillsData } from "../data/portfolio";

/** Infinite ticker of technologies and tools between the hero and the identity module. */
export default function TechMarquee() {
  const items = [...skillsData.technical.map((s) => s.name), ...skillsData.software];
  const row = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-b border-white/[0.06] bg-ink-900 py-5" aria-hidden="true">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-ink-900 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-ink-900 to-transparent" />
      <div className="marquee flex w-max items-center gap-10">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.14em] text-fg-subtle">
            {t}
            <span className="h-1 w-1 rotate-45 bg-accent/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
