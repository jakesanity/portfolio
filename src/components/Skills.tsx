import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpDown,
  ChevronRight,
  Code,
  Database,
  FileText,
  Image,
  Palette,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { projectsData, skillsData } from "../data/portfolio";
import { sections, selectProject } from "../lib/sections";
import { sfx } from "../lib/system";
import SectionHeader from "./ui/SectionHeader";
import XRaySlider from "./ui/XRaySlider";

const meta = sections.find((s) => s.id === "stack")!;

const ICONS: Record<string, LucideIcon> = { Code, Palette, Database, FileText, Settings, Image };

const SEGMENTS = 24;

const SKILL_META: Record<
  string,
  { summary: string; tools: string[]; projects: string[] }
> = {
  "HTML / CSS / Tailwind": {
    summary: "Semantic markup, responsive grid layouts, design token systems, and accessible high-contrast interfaces.",
    tools: ["Tailwind CSS", "CSS Grid / Flexbox", "Figma Tokens", "Responsive UI"],
    projects: ["recheck", "elderlycare"],
  },
  "JavaScript / TypeScript": {
    summary: "Type-safe application logic, asynchronous REST API integration, state management, and interactive DOM systems.",
    tools: ["TypeScript", "ES2024+", "REST APIs", "Async Workflows"],
    projects: ["recheck", "elderlycare"],
  },
  "React.js": {
    summary: "Component-driven SPA architecture, custom hooks, Framer Motion animations, and real-time dashboard interfaces.",
    tools: ["React 18", "Hooks", "Framer Motion", "Vite"],
    projects: ["recheck", "elderlycare"],
  },
  Python: {
    summary: "Data preprocessing, RFM feature engineering, unsupervised K-Means clustering, and demand trend forecasting.",
    tools: ["Scikit-Learn", "Pandas", "NumPy", "Data Pipelines"],
    projects: ["insightai"],
  },
  "PHP / Laravel": {
    summary: "Server-side MVC architecture, role-based access control (RBAC), authentication, and governance workflow backends.",
    tools: ["Laravel", "MVC", "RBAC Auth", "REST Controllers"],
    projects: ["recheck"],
  },
  "MySQL / PostgreSQL": {
    summary: "Relational schema normalization, foreign-key integrity, audit log tables, and analytical SQL queries.",
    tools: ["MySQL Workbench", "ER Modeling", "Indexing", "Audit Logs"],
    projects: ["recheck", "elderlycare", "insightai"],
  },
  Java: {
    summary: "Object-oriented programming fundamentals, data structures, desktop/console systems, and strongly typed design patterns.",
    tools: ["OOP", "Data Structures", "Algorithms", "JVM"],
    projects: [],
  },
  "Git & Linux CLI": {
    summary: "Branch-based version control, collaborative repository workflows, shell scripting, and local server administration.",
    tools: ["Git", "GitHub", "Bash / Zsh", "Apache / XAMPP"],
    projects: ["recheck", "elderlycare", "insightai"],
  },
};

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
  const [expanded, setExpanded] = useState<string | null>("React.js");
  const [sortBy, setSortBy] = useState<"pid" | "name" | "level">("pid");
  const [sortAsc, setSortAsc] = useState(true);

  const avg = Math.round(skillsData.technical.reduce((a, s) => a + s.level, 0) / skillsData.technical.length);

  const indexedSkills = skillsData.technical.map((s, i) => ({
    ...s,
    pid: 1024 + i * 7,
  }));

  const sortedSkills = [...indexedSkills].sort((a, b) => {
    const dir = sortAsc ? 1 : -1;
    if (sortBy === "pid") return (a.pid - b.pid) * dir;
    if (sortBy === "name") return a.name.localeCompare(b.name) * dir;
    return (b.level - a.level) * dir;
  });

  const handleSort = (col: "pid" | "name" | "level") => {
    sfx.tick();
    if (sortBy === col) setSortAsc((v) => !v);
    else {
      setSortBy(col);
      setSortAsc(true);
    }
  };

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
          description="Technical proficiency, tools and working traits, presented the way a system reports its own processes. Click any process row to inspect it."
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
                <span className="text-accent">$</span> top --skills --interactive
              </p>
              <span className="flex items-center gap-2 font-mono text-[11px] text-fg-subtle">
                <span className="status-dot" /> click row to inspect
              </span>
            </div>

            <div className="grid grid-cols-[54px_1fr_auto] gap-x-4 border-b border-white/[0.07] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint sm:grid-cols-[54px_180px_1fr_58px]">
              <button
                type="button"
                onClick={() => handleSort("pid")}
                className="flex items-center gap-1 text-left transition-colors hover:text-fg"
              >
                pid <ArrowUpDown className="h-2.5 w-2.5" />
              </button>
              <button
                type="button"
                onClick={() => handleSort("name")}
                className="flex items-center gap-1 text-left transition-colors hover:text-fg"
              >
                process <ArrowUpDown className="h-2.5 w-2.5" />
              </button>
              <span className="hidden sm:block">proficiency</span>
              <button
                type="button"
                onClick={() => handleSort("level")}
                className="flex items-center justify-end gap-1 text-right transition-colors hover:text-fg"
              >
                lvl <ArrowUpDown className="h-2.5 w-2.5" />
              </button>
            </div>

            <ul>
              {sortedSkills.map((s, i) => {
                const isOpen = expanded === s.name;
                const detail = SKILL_META[s.name];
                return (
                  <li key={s.name} className="border-b border-white/[0.04] last:border-0">
                    <button
                      type="button"
                      onClick={() => {
                        sfx.tick();
                        setExpanded(isOpen ? null : s.name);
                      }}
                      className={`group grid w-full grid-cols-[54px_1fr_auto] items-center gap-x-4 gap-y-2 px-5 py-3.5 text-left transition-colors sm:grid-cols-[54px_180px_1fr_58px] ${
                        isOpen ? "bg-white/[0.035]" : "hover:bg-white/[0.02]"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 font-mono text-[11px] text-fg-faint">
                        <ChevronRight
                          className={`h-3 w-3 transition-transform ${isOpen ? "rotate-90 text-accent" : "text-fg-faint"}`}
                        />
                        {s.pid}
                      </span>
                      <span
                        className={`truncate text-sm font-medium transition-colors ${
                          isOpen ? "text-accent" : "text-fg group-hover:text-accent"
                        }`}
                      >
                        {s.name}
                      </span>
                      <span className="col-span-3 row-start-2 sm:col-span-1 sm:row-start-auto">
                        <SegmentBar level={s.level} delay={i * 0.04} />
                      </span>
                      <span className="text-right font-mono text-[12px] text-fg-muted sm:row-start-auto">{s.level}%</span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && detail && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden bg-ink-900/70"
                        >
                          <div className="space-y-3 border-t border-white/[0.05] px-5 py-4">
                            <p className="text-xs leading-relaxed text-fg-muted">{detail.summary}</p>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex flex-wrap gap-1.5">
                                {detail.tools.map((t) => (
                                  <span
                                    key={t}
                                    className="rounded border border-white/[0.08] bg-ink-850 px-2 py-0.5 font-mono text-[10px] text-fg-subtle"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>

                              {detail.projects.length > 0 && (
                                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                                  <span className="text-fg-faint">used in:</span>
                                  {detail.projects.map((projId) => {
                                    const idx = projectsData.findIndex((p) => p.id === projId);
                                    const proj = projectsData[idx];
                                    if (!proj) return null;
                                    return (
                                      <button
                                        key={projId}
                                        type="button"
                                        onClick={() => {
                                          sfx.click();
                                          selectProject(idx);
                                        }}
                                        className="rounded border border-accent/30 bg-accent/10 px-2 py-0.5 text-accent transition-colors hover:bg-accent/20"
                                      >
                                        ~/{proj.title}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
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

        {/* Interactive Wireframe-to-Production UI X-Ray Slider */}
        <XRaySlider />

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
