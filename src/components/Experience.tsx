import { motion } from "framer-motion";
import { aboutData, experienceData } from "../data/portfolio";
import { sections } from "../lib/sections";
import SectionHeader from "./ui/SectionHeader";

const meta = sections.find((s) => s.id === "log")!;

interface LogEntry {
  version: string;
  period: string;
  title: string;
  org: string;
  kind: string;
  notes: string[];
  current: boolean;
}

/** Merge work history and education into one reverse-chronological changelog. */
function buildLog(): LogEntry[] {
  const work: LogEntry[] = experienceData.map((e) => ({
    version: "",
    period: e.period,
    title: e.role,
    org: e.company,
    kind: e.type,
    notes: e.responsibilities,
    current: /present/i.test(e.period),
  }));
  const edu: LogEntry[] = aboutData.education.map((e) => ({
    version: "",
    period: e.year,
    title: e.degree,
    org: e.school,
    kind: "Education",
    notes: [e.description],
    current: /present/i.test(e.year),
  }));

  const startYear = (p: string) => parseInt(p.match(/\d{4}/)?.[0] ?? "0", 10);
  const all = [...work, ...edu].sort((a, b) => startYear(b.period) - startYear(a.period));
  return all.map((entry, i) => ({ ...entry, version: `v${all.length - i}.0` }));
}

export default function Experience() {
  const log = buildLog();

  return (
    <section id="log" className="relative border-t border-white/[0.05] py-28 lg:py-36">
      <div className="shell">
        <SectionHeader
          meta={meta}
          title={
            <>
              Changelog,
              <span className="text-fg-subtle"> release by release.</span>
            </>
          }
          description="Experience and education, versioned like software. Each release added something to the system."
        />

        <ol className="relative">
          {log.map((e, i) => (
            <motion.li
              key={e.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group grid gap-4 border-b border-white/[0.06] py-10 first:pt-0 last:border-0 md:grid-cols-12 md:gap-8"
            >
              <div className="flex items-center gap-3 md:col-span-3 md:flex-col md:items-start md:gap-2">
                <span
                  className={`rounded-md border px-2 py-0.5 font-mono text-[12px] ${
                    e.current ? "border-accent/40 bg-accent/10 text-accent" : "border-white/10 text-fg-muted"
                  }`}
                >
                  {e.version}
                </span>
                <span className="font-mono text-[12px] text-fg-subtle">{e.period}</span>
                {e.current && (
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                    <span className="status-dot" /> current
                  </span>
                )}
              </div>

              <div className="md:col-span-9">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3 className="text-2xl font-semibold tracking-tight text-fg transition-colors group-hover:text-white sm:text-[1.7rem]">
                    {e.title}
                  </h3>
                  <span className="chip">{e.kind}</span>
                </div>
                <p className="mt-1.5 text-fg-subtle">{e.org}</p>

                <ul className="mt-6 space-y-2.5">
                  {e.notes.map((n) => (
                    <li key={n} className="flex gap-3 text-[15px] leading-relaxed text-fg-muted">
                      <span className="select-none font-mono text-accent">+</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
