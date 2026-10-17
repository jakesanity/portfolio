import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Folder, FolderOpen } from "lucide-react";
import { useState } from "react";
import { personalInfo, projectsData } from "../data/portfolio";
import { sections } from "../lib/sections";
import SectionHeader from "./ui/SectionHeader";

const meta = sections.find((s) => s.id === "work")!;

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default function Projects() {
  const [active, setActive] = useState(0);
  const p = projectsData[active];

  return (
    <section id="work" className="relative border-t border-white/[0.05] py-28 lg:py-36">
      <div className="shell">
        <SectionHeader
          meta={meta}
          title={
            <>
              Selected work,
              <span className="text-fg-subtle"> indexed.</span>
            </>
          }
          description="Systems I have designed and built across research workflows, healthcare and machine learning. Select a project to inspect it."
          aside={
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost h-10 text-[13px]"
              id="work-github"
            >
              All repositories <ArrowUpRight className="h-4 w-4" />
            </a>
          }
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="panel overflow-hidden"
        >
          {/* Explorer chrome */}
          <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3">
            <p className="font-mono text-[11px] text-fg-subtle">
              ~/work/<span className="text-fg">{slug(p.title)}</span>
            </p>
            <p className="font-mono text-[11px] text-fg-faint">
              {active + 1} / {projectsData.length}
            </p>
          </div>

          <div className="grid lg:grid-cols-12">
            {/* File list */}
            <ul className="border-b border-white/[0.07] lg:col-span-5 lg:border-b-0 lg:border-r" role="tablist">
              {projectsData.map((proj, i) => {
                const isActive = i === active;
                return (
                  <li key={proj.title} className="border-b border-white/[0.05] last:border-0">
                    <button
                      id={`project-${slug(proj.title)}`}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      className={`group relative flex w-full items-center gap-5 px-5 py-6 text-left transition-colors sm:px-7 sm:py-8 ${
                        isActive ? "bg-white/[0.03]" : "hover:bg-white/[0.015]"
                      }`}
                    >
                      {isActive && (
                        <motion.span layoutId="project-indicator" className="absolute inset-y-0 left-0 w-px bg-accent" />
                      )}
                      <span className={`font-mono text-[11px] ${isActive ? "text-accent" : "text-fg-faint"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-2xl font-semibold tracking-tight transition-colors sm:text-3xl ${
                            isActive ? "text-fg" : "text-fg-subtle group-hover:text-fg-muted"
                          }`}
                        >
                          {proj.title}
                        </p>
                        <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">{proj.category}</p>
                      </div>
                      {isActive ? (
                        <FolderOpen className="h-4 w-4 text-accent" strokeWidth={1.6} />
                      ) : (
                        <Folder className="h-4 w-4 text-fg-faint" strokeWidth={1.6} />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Inspector */}
            <div className="relative lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.article
                  key={p.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex h-full flex-col"
                >
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-white/[0.07] bg-ink-800">
                    <motion.img
                      src={p.image}
                      alt={`${p.title} project preview`}
                      loading="lazy"
                      initial={{ scale: 1.06 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full w-full object-cover opacity-80 grayscale-[35%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-850 via-ink-850/10 to-transparent" />
                    <div className="absolute inset-0 bg-grid opacity-30" />
                    <span className="absolute left-4 top-4 rounded-md border border-white/10 bg-black/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-muted backdrop-blur">
                      {p.type}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <h3 className="text-2xl font-semibold tracking-tight text-fg">{p.title}</h3>
                    <p className="mt-3 leading-relaxed text-fg-muted">{p.description}</p>

                    <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.06] font-mono text-[11px]">
                      <div className="bg-ink-850 px-4 py-3">
                        <dt className="text-fg-faint">category</dt>
                        <dd className="mt-1 text-fg">{p.category}</dd>
                      </div>
                      <div className="bg-ink-850 px-4 py-3">
                        <dt className="text-fg-faint">type</dt>
                        <dd className="mt-1 text-fg">{p.type}</dd>
                      </div>
                    </dl>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span key={t} className="chip">
                          <span className="text-accent">#</span>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
