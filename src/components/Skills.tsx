import { motion } from "framer-motion";
import { Code, Database, FileText, Image, Palette, Settings, type LucideIcon } from "lucide-react";
import { skillsData } from "../data/portfolio";
import { sections } from "../lib/sections";
import SectionHeader from "./ui/SectionHeader";

const meta = sections.find((s) => s.id === "stack")!;

const ICONS: Record<string, LucideIcon> = { Code, Palette, Database, FileText, Settings, Image };

const SEGMENTS = 24;

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
} as const;

function SegmentBar({ level, delay }: { level: number; delay: number }) {
  const filled = Math.round((level / 100) * SEGMENTS);
  return (
    <div className="flex h-3 flex-1 gap-[3px]" aria-hidden="true">
      {Array.from({ length: SEGMENTS }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.08 }}
          whileInView={{ opacity: i < filled ? 1 : 0.08 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: delay + i * 0.022 }}
          className={`flex-1 rounded-[1px] ${i < filled ? (i >= filled - 2 ? "bg-accent" : "bg-fg/70") : "bg-white"}`}
        />
      ))}
    </div>
  );
}

export default function Skills() {
  const avg = Math.round(skillsData.technical.reduce((a, s) => a + s.level, 0) / skillsData.technical.length);

  return (
    <section id="stack" className="relative border-t border-white/[0.05] py-28 lg:py-36">
      <div className="absolute inset-0 -z-10 bg-dots opacity-40 mask-fade-b" />
      <div className="shell">
        <SectionHeader
          meta={meta}
          title={
            <>
              The stack,
              <span className="text-fg-subtle"> monitored live.</span>
            </>
          }
          description="Technical proficiency, tools and working traits, presented the way a system reports its own processes."
          aside={
            <div className="flex gap-8 font-mono">
              <div>
                <p className="label">Modules</p>
                <p className="mt-1 text-2xl text-fg">{skillsData.technical.length}</p>
              </div>
              <div>
                <p className="label">Avg load</p>
                <p className="mt-1 text-2xl text-accent">{avg}%</p>
              </div>
            </div>
          }
        />

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Process monitor */}
          <motion.div {...reveal} className="panel overflow-hidden lg:col-span-7">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3.5">
              <p className="font-mono text-[11px] text-fg-subtle">
                <span className="text-accent">$</span> top --skills
              </p>
              <span className="flex items-center gap-2 font-mono text-[11px] text-fg-subtle">
                <span className="status-dot" /> running
              </span>
            </div>
            <div className="grid grid-cols-[44px_1fr_auto] gap-x-4 border-b border-white/[0.07] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint sm:grid-cols-[44px_170px_1fr_52px]">
              <span>pid</span>
              <span>process</span>
              <span className="hidden sm:block">proficiency</span>
              <span className="text-right">lvl</span>
            </div>
            <ul>
              {skillsData.technical.map((s, i) => (
                <li
                  key={s.name}
                  className="group grid grid-cols-[44px_1fr_auto] items-center gap-x-4 gap-y-2 border-b border-white/[0.04] px-5 py-3.5 transition-colors last:border-0 hover:bg-white/[0.02] sm:grid-cols-[44px_170px_1fr_52px]"
                >
                  <span className="font-mono text-[11px] text-fg-faint">{String(1024 + i * 7)}</span>
                  <span className="truncate text-sm text-fg transition-colors group-hover:text-accent">{s.name}</span>
                  <span className="col-span-3 row-start-2 sm:col-span-1 sm:row-start-auto">
                    <SegmentBar level={s.level} delay={i * 0.05} />
                  </span>
                  <span className="text-right font-mono text-[12px] text-fg-muted sm:row-start-auto">{s.level}%</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.06 }} className="panel p-6">
              <div className="mb-5 flex items-center justify-between">
                <p className="label">Installed tools</p>
                <span className="font-mono text-[11px] text-fg-faint">{skillsData.software.length} pkgs</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillsData.software.map((s) => (
                  <span key={s} className="chip transition-colors hover:border-accent/40 hover:text-fg">
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.12 }} className="panel flex-1 p-6">
              <div className="mb-5 flex items-center justify-between">
                <p className="label">Runtime traits</p>
                <span className="font-mono text-[11px] text-fg-faint">soft skills</span>
              </div>
              <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.06]">
                {skillsData.soft.map((s, i) => (
                  <li key={s} className="flex items-center gap-3 bg-ink-850 px-3.5 py-3 text-sm text-fg-muted">
                    <span className="font-mono text-[10px] text-fg-faint">{String(i + 1).padStart(2, "0")}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Capabilities */}
        <div className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="label mb-3">Capabilities</p>
              <h3 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">What I can deliver</h3>
            </div>
            <p className="hidden max-w-xs text-right text-sm text-fg-subtle md:block">
              Services available for internships, freelance engagements and collaborations.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
            {skillsData.services.map((s, i) => {
              const Icon = ICONS[s.icon] ?? Code;
              return (
                <motion.article
                  key={s.title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group relative bg-ink-850 p-7 transition-colors duration-300 hover:bg-ink-800"
                >
                  <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
                  <div className="mb-10 flex items-start justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-ink-900 text-fg-muted transition-colors group-hover:border-accent/40 group-hover:text-accent">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                    </span>
                    <span className="font-mono text-[11px] text-fg-faint">/{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h4 className="text-lg font-medium text-fg">{s.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{s.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
