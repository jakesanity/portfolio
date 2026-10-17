import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Download } from "lucide-react";
import { Suspense, lazy, useEffect, useState } from "react";
import { aboutData, personalInfo, projectsData, skillsData } from "../data/portfolio";
import { useIsMac } from "../lib/hooks";
import { scrollToSection } from "../lib/sections";

const HeroCore = lazy(() => import("./HeroCore"));

const ROLES = ["full-stack web systems", "workflow platforms", "machine learning tools", "clean user interfaces"];

const ease = [0.22, 1, 0.36, 1] as const;

function RotatingRole() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((v) => (v + 1) % ROLES.length), 2600);
    return () => window.clearInterval(t);
  }, []);
  return (
    <span className="relative inline-flex h-[1.5em] items-center overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={ROLES[i]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease }}
          className="text-fg"
        >
          {ROLES[i]}
        </motion.span>
      </AnimatePresence>
      <span className="caret ml-1" />
    </span>
  );
}

export default function Hero() {
  const isMac = useIsMac();
  const [first, ...rest] = personalInfo.name.split(" ");
  const last = rest.pop();
  const middle = rest.join(" ");

  const stats = [
    { k: "Projects", v: String(projectsData.length).padStart(2, "0"), s: "shipped and in progress" },
    { k: "Stack", v: String(skillsData.technical.length).padStart(2, "0"), s: "core technologies" },
    { k: "Certs", v: String(aboutData.certifications.length).padStart(2, "0"), s: "industry certificates" },
    { k: "Since", v: "2022", s: "studying IT full-time" },
  ];

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-grid mask-fade-b opacity-70" />
      <div className="absolute left-1/2 top-[-20%] -z-10 h-[720px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(198,255,61,0.08),transparent)]" />

      <div className="shell relative flex flex-1 items-center">
        <div className="grid w-full items-center gap-10 py-16 lg:grid-cols-12 lg:py-10">
          {/* Copy */}
          <div className="relative z-10 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
              className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-ink-850/80 py-1.5 pl-3 pr-4 backdrop-blur"
            >
              <span className="status-dot" />
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">
                Open to internships and freelance work
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-4 font-mono text-[12px] text-fg-subtle"
            >
              <span className="text-accent">$</span> whoami
            </motion.p>

            <h1 className="text-[clamp(2.75rem,8vw,6.5rem)] font-semibold leading-[0.92] tracking-tightest text-fg">
              {[`${first} ${middle}`, last].map((line, idx) => (
                <span key={idx} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, ease, delay: 0.25 + idx * 0.1 }}
                    className={`block ${idx === 1 ? "text-fg-subtle" : ""}`}
                  >
                    {line}
                    {idx === 1 && <span className="text-accent">.</span>}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.55 }}
              className="mt-8 max-w-xl"
            >
              <p className="font-mono text-sm text-fg-muted sm:text-[15px]">
                <span className="text-fg-faint">&gt; </span>
                {personalInfo.title.toLowerCase()} building <RotatingRole />
              </p>
              <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
                I design and engineer dependable software, from research workflow systems to healthcare
                platforms and predictive analytics, with a focus on clarity, structure and real-world use.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.7 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <button id="hero-explore-work" onClick={() => scrollToSection("work")} className="btn-primary group">
                Explore work
                <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </button>
              <a id="hero-download-cv" href={personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <Download className="h-4 w-4" />
                Download CV
              </a>
              <span className="ml-1 hidden items-center gap-2 font-mono text-[11px] text-fg-subtle sm:flex">
                or press <span className="kbd">{isMac ? "\u2318" : "Ctrl"}</span>
                <span className="kbd">K</span>
              </span>
            </motion.div>
          </div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease, delay: 0.3 }}
            className="pointer-events-none absolute inset-0 opacity-40 lg:pointer-events-auto lg:relative lg:col-span-5 lg:aspect-square lg:opacity-100"
          >
            <Suspense fallback={<div className="absolute inset-0 bg-dots opacity-50 mask-radial" />}>
              <HeroCore />
            </Suspense>
            <div className="pointer-events-none absolute inset-0 hidden font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint lg:block">
              <div className="absolute left-0 top-4 flex flex-col gap-1">
                <span className="text-fg-subtle">core.sys</span>
                <span>render / webgl</span>
              </div>
              <div className="absolute right-0 top-4 text-right">
                <span className="block text-fg-subtle">node</span>
                <span>ph-mnl-01</span>
              </div>
              <div className="absolute bottom-4 left-0">
                <span className="block">lat 14.5995 n</span>
                <span>lon 120.9842 e</span>
              </div>
              <div className="absolute bottom-4 right-0 flex items-center gap-2">
                <span className="status-dot" /> online
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Telemetry strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="relative border-t border-white/[0.07] bg-ink-900/60 backdrop-blur"
      >
        <div className="shell grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.k}
              className={`flex items-end justify-between gap-4 py-6 ${i % 2 === 1 ? "pl-5 sm:pl-8" : "pr-5 sm:pr-8"} ${
                i > 0 ? "lg:border-l lg:border-white/[0.07] lg:pl-8" : ""
              } ${i % 2 === 1 ? "border-l border-white/[0.07]" : ""} ${i < 2 ? "border-b border-white/[0.07] lg:border-b-0" : ""}`}
            >
              <div>
                <p className="label">{s.k}</p>
                <p className="mt-2 text-xs text-fg-subtle">{s.s}</p>
              </div>
              <p className="font-mono text-3xl font-medium tracking-tight text-fg sm:text-4xl">{s.v}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <button
        onClick={() => scrollToSection("about")}
        className="absolute bottom-28 right-8 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle transition-colors hover:text-fg xl:flex"
      >
        scroll <ArrowUpRight className="h-3 w-3 rotate-90" />
      </button>
    </section>
  );
}
