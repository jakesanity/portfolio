import { useActiveSection, useScrollProgress } from "../lib/hooks";
import { scrollToSection, sections } from "../lib/sections";

/**
 * Fixed vertical "circuit trace" on the left edge (desktop only).
 * The trace fills with signal as you scroll; each module is a node.
 */
export default function CircuitRail() {
  const active = useActiveSection();
  const progress = useScrollProgress();
  const activeIndex = sections.findIndex((s) => s.id === active);

  return (
    <aside className="pointer-events-none fixed left-0 top-0 z-40 hidden h-screen w-16 lg:block" aria-label="Section progress">
      <div className="absolute left-8 top-28 bottom-24 w-px bg-white/[0.07]">
        <div
          className="absolute inset-x-0 top-0 origin-top bg-gradient-to-b from-accent/0 via-accent/70 to-accent"
          style={{ height: `${progress * 100}%` }}
        />
        <div
          className="absolute -left-[3px] h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_14px_2px_rgba(198,255,61,0.6)]"
          style={{ top: `calc(${progress * 100}% - 3px)` }}
        />

        {sections.map((s, i) => {
          const pos = (i / (sections.length - 1)) * 100;
          const lit = i <= activeIndex;
          const isActive = i === activeIndex;
          return (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className="group pointer-events-auto absolute -left-[7px] flex items-center"
              style={{ top: `calc(${pos}% - 7px)` }}
              aria-label={`Go to ${s.label}`}
            >
              <span
                className={`grid h-[15px] w-[15px] place-items-center rounded-[3px] border transition-colors duration-300 ${
                  lit ? "border-accent/70 bg-ink-900" : "border-white/15 bg-ink-900"
                }`}
              >
                <span
                  className={`h-[5px] w-[5px] rounded-[1px] transition-colors duration-300 ${
                    isActive ? "bg-accent" : lit ? "bg-accent/40" : "bg-white/15"
                  }`}
                />
              </span>
              <span
                className={`ml-3 whitespace-nowrap rounded border border-white/10 bg-ink-850 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-all duration-200 ${
                  isActive
                    ? "translate-x-0 text-fg opacity-100"
                    : "-translate-x-1 text-fg-subtle opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                }`}
              >
                {s.index} {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
