import { AnimatePresence, motion } from "framer-motion";
import { Award, BadgeCheck, GraduationCap } from "lucide-react";
import { useState } from "react";
import { aboutData, personalInfo } from "../data/portfolio";
import { sections } from "../lib/sections";
import SectionHeader from "./ui/SectionHeader";

const meta = sections.find((s) => s.id === "about")!;

const TABS = [
  { id: "background", label: "Background", body: aboutData.background },
  { id: "mission", label: "Mission", body: aboutData.mission },
  { id: "vision", label: "Vision", body: aboutData.vision },
  { id: "goals", label: "Goals", body: aboutData.goals },
  { id: "motivation", label: "Motivation", body: aboutData.motivation },
] as const;

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
} as const;

export default function About() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("background");
  const current = TABS.find((t) => t.id === tab)!;

  const readout = [
    ["name", personalInfo.name],
    ["role", personalInfo.title],
    ["focus", "Full-stack development"],
    ["location", personalInfo.location],
    ["status", "Available"],
  ];

  return (
    <section id="about" className="relative py-28 lg:py-36">
      <div className="shell">
        <SectionHeader
          meta={meta}
          title={
            <>
              Engineer by curiosity,
              <br />
              <span className="text-fg-subtle">designer by habit.</span>
            </>
          }
          description="A quick read of who I am, what I am working toward, and the foundations behind it."
        />

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Profile scanner */}
          <motion.div {...reveal} className="lg:col-span-4">
            <div className="panel overflow-hidden p-3">
              <div className="brackets relative aspect-[4/5] overflow-hidden rounded-lg bg-ink-800">
                <span className="br-b" />
                <img
                  src={personalInfo.photo}
                  alt={`Portrait of ${personalInfo.name}`}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale transition-all duration-700 hover:scale-[1.02] hover:grayscale-0"
                />
                <div className="scanline" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-muted">
                  <span>id / ajb-0001</span>
                  <span className="flex items-center gap-2 text-accent">
                    <span className="status-dot" /> verified
                  </span>
                </div>
              </div>

              <dl className="mt-3 divide-y divide-white/[0.06] rounded-lg border border-white/[0.06] bg-ink-900/60 font-mono text-[12px]">
                {readout.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-4 px-4 py-2.5">
                    <dt className="text-fg-subtle">{k}</dt>
                    <dd className={`truncate text-right ${k === "status" ? "text-accent" : "text-fg"}`}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>

          {/* Document viewer */}
          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.08 }} className="flex flex-col gap-6 lg:col-span-8">
            <div className="panel flex flex-1 flex-col overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                </div>
                <span className="font-mono text-[11px] text-fg-subtle">~/identity/{current.id}.md</span>
                <span className="font-mono text-[11px] text-fg-faint">utf-8</span>
              </div>

              <div className="flex gap-1 overflow-x-auto border-b border-white/[0.07] px-2 py-2" role="tablist">
                {TABS.map((t) => {
                  const active = t.id === tab;
                  return (
                    <button
                      key={t.id}
                      id={`about-tab-${t.id}`}
                      role="tab"
                      aria-selected={active}
                      onClick={() => setTab(t.id)}
                      className={`relative shrink-0 rounded-md px-3.5 py-2 text-[13px] transition-colors ${
                        active ? "text-fg" : "text-fg-subtle hover:text-fg"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="about-tab"
                          className="absolute inset-0 rounded-md bg-white/[0.06] ring-1 ring-white/10"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span className="relative">{t.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative flex-1 p-6 sm:p-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-6"
                  >
                    <div className="hidden select-none flex-col pt-1 text-right font-mono text-[11px] leading-[2.05rem] text-fg-faint sm:flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{String(i + 1).padStart(2, "0")}</span>
                      ))}
                    </div>
                    <div>
                      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-accent"># {current.label}</p>
                      <p className="text-lg leading-[2.05rem] text-fg/90 sm:text-xl sm:leading-[2.2rem]">{current.body}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Education / certs / achievements */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <motion.div {...reveal} className="panel p-6 lg:col-span-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="label">Education</p>
              <GraduationCap className="h-4 w-4 text-fg-subtle" />
            </div>
            <ol className="relative space-y-7 border-l border-white/10 pl-5">
              {aboutData.education.map((e, i) => (
                <li key={e.degree} className="relative">
                  <span
                    className={`absolute -left-[25px] top-1.5 h-2 w-2 rounded-full ring-4 ring-ink-850 ${i === 0 ? "bg-accent" : "bg-white/25"}`}
                  />
                  <p className="font-mono text-[11px] text-fg-subtle">{e.year}</p>
                  <p className="mt-1 font-medium text-fg">{e.degree}</p>
                  <p className="mt-0.5 text-sm text-fg-subtle">{e.school}</p>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{e.description}</p>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.06 }} className="panel p-6">
            <div className="mb-6 flex items-center justify-between">
              <p className="label">Certifications</p>
              <BadgeCheck className="h-4 w-4 text-fg-subtle" />
            </div>
            <ul className="divide-y divide-white/[0.06]">
              {aboutData.certifications.map((c, i) => {
                const [name, issuer] = c.split(" – ");
                return (
                  <li key={c} className="flex items-start gap-4 py-3.5 first:pt-0 last:pb-0">
                    <span className="mt-0.5 font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="text-sm text-fg">{name}</p>
                      {issuer && <p className="mt-0.5 font-mono text-[11px] text-fg-subtle">{issuer}</p>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.12 }} className="panel p-6">
            <div className="mb-6 flex items-center justify-between">
              <p className="label">Achievements</p>
              <Award className="h-4 w-4 text-fg-subtle" />
            </div>
            <ul className="space-y-4">
              {aboutData.achievements.map((a) => (
                <li key={a.title} className="rounded-lg border border-white/[0.06] bg-ink-900/60 p-4">
                  <p className="font-medium text-fg">{a.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{a.description}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
