import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  Cpu,
  FileCheck2,
  Folder,
  FolderOpen,
  GitBranch,
  HeartPulse,
  Layers,
  MessageSquareShare,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { personalInfo, projectsData, type ProjectItem } from "../data/portfolio";
import { useGitHubTelemetry } from "../lib/api";
import { SELECT_PROJECT_EVENT, scrollToSection, sections } from "../lib/sections";
import { sfx, unlockMilestone } from "../lib/system";
import SectionHeader from "./ui/SectionHeader";

const meta = sections.find((s) => s.id === "work")!;

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const RECHECK_HASHES = ["0x8a1f…c401", "0x3e9b…71d4", "0x9f4c…e82a", "0x7c20…f99b"];

/** Bespoke interactive system blueprint / UI preview for each project */
function ProjectBlueprint({ project }: { project: ProjectItem }) {
  // RECHECK state
  const [recheckStage, setRecheckStage] = useState(2); // 0..3

  // ElderlyCare state
  const [bpm, setBpm] = useState(74);
  const [bpSys, setBpSys] = useState(118);
  const [bpDia, setBpDia] = useState(76);
  const [doses, setDoses] = useState(2);
  const [careLog, setCareLog] = useState("Morning dose verified by Caregiver Maria · 08:05 AM");

  // InsightAi state
  const [selectedCluster, setSelectedCluster] = useState(0);
  const [horizon, setHorizon] = useState<"30D" | "90D" | "Q4">("Q4");

  if (project.id === "recheck") {
    const stages = [
      {
        step: "01",
        name: "Protocol Intake",
        meta: "IRB-2026-084 · PDF + Forms",
        log: "Researcher uploaded protocol package & consent forms",
      },
      {
        step: "02",
        name: "Secretariat Screen",
        meta: "Completeness: 100%",
        log: "Secretariat verified document checklist & assigned board",
      },
      {
        step: "03",
        name: "Ethics Board Review",
        meta: recheckStage > 2 ? "3 / 3 Reviewers Signed" : "2 / 3 Reviewers Signed",
        log: "Primary & secondary ethics reviewers logged inline notes",
      },
      {
        step: "04",
        name: "Clearance Certificate",
        meta: recheckStage === 3 ? "Certificate #2026-084" : "Auto-issuance ready",
        log: "Ethics clearance approved & digital certificate issued",
      },
    ];

    const advanceStage = () => {
      sfx.confirm();
      unlockMilestone("blueprint");
      setRecheckStage((prev) => (prev + 1) % 4);
    };

    return (
      <div className="relative flex h-full w-full flex-col justify-between bg-ink-900 p-5 sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-64 bg-[radial-gradient(closest-side,rgba(var(--accent-rgb),0.12),transparent)]" />

        {/* Top bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-md border border-accent/40 bg-accent/10 text-accent">
              <FileCheck2 className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="font-mono text-[11px] font-medium text-fg">RECHECK // ETHICS WORKFLOW ENGINE</p>
              <p className="font-mono text-[10px] text-fg-subtle">
                protocol_id: UIC-REC-2026-084 · click a stage to inspect
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={advanceStage}
              className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/15 px-2.5 py-1 font-mono text-[10px] font-medium text-accent transition-all hover:bg-accent/25 active:scale-95"
            >
              <Play className="h-2.5 w-2.5 fill-current" />
              {recheckStage === 3 ? "Reset Pipeline" : "Advance Stage"}
            </button>
          </div>
        </div>

        {/* Pipeline stages */}
        <div className="relative z-10 my-4 grid gap-2.5 sm:grid-cols-4">
          {stages.map((s, idx) => {
            const isDone = idx < recheckStage;
            const isActive = idx === recheckStage;
            const stateLabel = isDone ? "verified" : isActive ? (idx === 3 ? "issued" : "active") : "queued";
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => {
                  sfx.tick();
                  unlockMilestone("blueprint");
                  setRecheckStage(idx);
                }}
                className={`rounded-lg border p-3 text-left transition-all ${isActive
                  ? "border-accent/60 bg-accent/[0.09] shadow-[0_0_20px_-6px_rgba(var(--accent-rgb),0.3)]"
                  : isDone
                    ? "border-white/15 bg-ink-850/90 hover:border-white/25"
                    : "border-white/[0.05] bg-ink-950/60 opacity-60 hover:opacity-85"
                  }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className={isActive ? "text-accent" : "text-fg-subtle"}>STAGE {s.step}</span>
                  <span
                    className={
                      isActive ? "text-accent" : isDone ? "text-signal-cyan" : "text-fg-faint"
                    }
                  >
                    {stateLabel.toUpperCase()}
                  </span>
                </div>
                <p className="mt-1.5 text-xs font-medium text-fg">{s.name}</p>
                <p className="mt-1 font-mono text-[10px] text-fg-subtle">{s.meta}</p>
              </button>
            );
          })}
        </div>

        {/* Audit footer */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/[0.07] bg-ink-850/90 px-3.5 py-2.5 font-mono text-[11px]">
          <span className="text-fg-muted">
            <span className="text-accent">LOG:</span> {stages[recheckStage].log}
          </span>
          <span className="text-fg-subtle">audit_hash: {RECHECK_HASHES[recheckStage]}</span>
        </div>
      </div>
    );
  }

  if (project.id === "elderlycare") {
    const simulateVitals = () => {
      sfx.pulse();
      unlockMilestone("blueprint");
      const nextBpm = 70 + Math.floor(Math.random() * 11);
      const nextSys = 114 + Math.floor(Math.random() * 9);
      const nextDia = 74 + Math.floor(Math.random() * 6);
      setBpm(nextBpm);
      setBpSys(nextSys);
      setBpDia(nextDia);
      setCareLog(`Live telemetry synced (${nextBpm} bpm, ${nextSys}/${nextDia} mmHg) · All normal`);
    };

    const logMedication = () => {
      sfx.confirm();
      unlockMilestone("blueprint");
      const nextDoses = doses >= 3 ? 1 : doses + 1;
      setDoses(nextDoses);
      setCareLog(
        nextDoses === 3
          ? "3/3 daily doses verified · Family notification dispatched"
          : `Dose ${nextDoses}/3 logged by Caregiver Maria · Schedule updated`
      );
    };

    const vitals = [
      { label: "Heart Rate", val: `${bpm} bpm`, status: "Live ECG Normal", accent: "text-accent" },
      { label: "Blood Pressure", val: `${bpSys} / ${bpDia}`, status: "Optimal Range", accent: "text-signal-cyan" },
      {
        label: "Med Adherence",
        val: `${doses} / 3 Doses`,
        status: doses === 3 ? "100% Complete" : "Next: 18:00 PHT",
        accent: doses === 3 ? "text-accent" : "text-signal-amber",
      },
      { label: "Next Checkup", val: "14:30 PHT", status: "Dr. Santos · Sync", accent: "text-fg-muted" },
    ];

    return (
      <div className="relative flex h-full w-full flex-col justify-between bg-ink-900 p-5 sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="pointer-events-none absolute left-0 top-0 h-48 w-64 bg-[radial-gradient(closest-side,rgba(94,230,255,0.1),transparent)]" />

        {/* Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-md border border-signal-cyan/40 bg-signal-cyan/10 text-signal-cyan">
              <HeartPulse className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="font-mono text-[11px] font-medium text-fg">ELDERLYCARE // REMOTE CARE TELEMETRY</p>
              <p className="font-mono text-[10px] text-fg-subtle">patient_profile: Senior Care Unit #04 · interactive</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={simulateVitals}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-ink-850 px-2.5 py-1 font-mono text-[10px] text-fg-muted transition-all hover:border-signal-cyan/50 hover:text-fg active:scale-95"
            >
              <RefreshCw className="h-2.5 w-2.5 text-signal-cyan" />
              Scan Vitals
            </button>
            <button
              type="button"
              onClick={logMedication}
              className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/15 px-2.5 py-1 font-mono text-[10px] font-medium text-accent transition-all hover:bg-accent/25 active:scale-95"
            >
              <CheckCircle2 className="h-2.5 w-2.5" />
              Log Dose ({doses}/3)
            </button>
          </div>
        </div>

        {/* Vitals grid */}
        <div className="relative z-10 my-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {vitals.map((v) => (
            <div key={v.label} className="rounded-lg border border-white/10 bg-ink-850/90 p-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{v.label}</p>
              <p className="mt-1.5 font-mono text-base font-semibold text-fg">{v.val}</p>
              <p className={`mt-1 font-mono text-[10px] ${v.accent}`}>{v.status}</p>
            </div>
          ))}
        </div>

        {/* Caregiver sync bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/[0.07] bg-ink-850/90 px-3.5 py-2.5 font-mono text-[11px]">
          <span className="flex items-center gap-2 text-fg-muted">
            <Activity className="h-3.5 w-3.5 text-accent" />
            {careLog}
          </span>
          <span className="text-accent">family_sync: live</span>
        </div>
      </div>
    );
  }

  // InsightAi
  const segments = [
    {
      tier: "High-Value Loyalists",
      share: "28%",
      growth: horizon === "30D" ? "+6.4%" : horizon === "90D" ? "+11.1%" : "+14.2%",
      bar: "w-[82%] bg-accent",
      rfm: "RFM 5-5-5 · Avg Order ₱4,850",
      action: "Action: Priority VIP early-access & loyalty bundle",
    },
    {
      tier: "Repeat Seasonal Buyers",
      share: "36%",
      growth: horizon === "30D" ? "+4.1%" : horizon === "90D" ? "+6.9%" : "+8.7%",
      bar: "w-[68%] bg-signal-cyan",
      rfm: "RFM 4-3-4 · Avg Order ₱2,920",
      action: "Action: Automated seasonal restock reminders",
    },
    {
      tier: "Emerging Prospects",
      share: "22%",
      growth: horizon === "30D" ? "+9.8%" : horizon === "90D" ? "+15.2%" : "+19.4%",
      bar: "w-[54%] bg-white/60",
      rfm: "RFM 5-2-2 · Avg Order ₱1,640",
      action: "Action: Second-purchase cross-sell recommendation",
    },
    {
      tier: "At-Risk Churn Cohort",
      share: "14%",
      growth: horizon === "30D" ? "-1.2%" : horizon === "90D" ? "-2.4%" : "-3.1%",
      bar: "w-[34%] bg-signal-amber",
      rfm: "RFM 2-3-3 · Avg Order ₱2,110",
      action: "Action: Trigger win-back incentive before 45-day lapse",
    },
  ];

  const activeSeg = segments[selectedCluster];

  return (
    <div className="relative flex h-full w-full flex-col justify-between bg-ink-900 p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute right-10 bottom-0 h-48 w-64 bg-[radial-gradient(closest-side,rgba(var(--accent-rgb),0.12),transparent)]" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md border border-accent/40 bg-accent/10 text-accent">
            <BrainCircuit className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="font-mono text-[11px] font-medium text-fg">INSIGHTAI // RFM + K-MEANS CLUSTERING</p>
            <p className="font-mono text-[10px] text-fg-subtle">click any cohort to inspect RFM recommendation</p>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-md border border-white/10 bg-ink-850 p-0.5 font-mono text-[10px]">
          {(["30D", "90D", "Q4"] as const).map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => {
                sfx.tick();
                setHorizon(h);
              }}
              className={`rounded px-2 py-0.5 transition-colors ${horizon === h ? "bg-accent/15 text-accent" : "text-fg-subtle hover:text-fg"
                }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Clusters */}
      <div className="relative z-10 my-4 grid gap-2.5 sm:grid-cols-2">
        {segments.map((s, idx) => {
          const isSelected = idx === selectedCluster;
          return (
            <button
              key={s.tier}
              type="button"
              onClick={() => {
                sfx.tick();
                unlockMilestone("blueprint");
                setSelectedCluster(idx);
              }}
              className={`rounded-lg border p-3 text-left transition-all ${isSelected
                ? "border-accent/60 bg-accent/[0.08] shadow-[0_0_20px_-6px_rgba(var(--accent-rgb),0.25)]"
                : "border-white/10 bg-ink-850/90 hover:border-white/20"
                }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-fg">{s.tier}</span>
                <span className="font-mono text-[11px] text-accent">{s.growth}</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
                <div className={`h-full rounded-full ${s.bar}`} />
              </div>
              <div className="mt-1.5 flex items-center justify-between font-mono text-[10px] text-fg-subtle">
                <span>share: {s.share}</span>
                <span>{s.rfm.split(" · ")[0]}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/[0.07] bg-ink-850/90 px-3.5 py-2.5 font-mono text-[11px]">
        <span className="flex items-center gap-1.5 text-fg-muted">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          {activeSeg.action}
        </span>
        <span className="text-fg-subtle">{activeSeg.rfm}</span>
      </div>
    </div>
  );
}

export default function Projects() {
  const [active, setActive] = useState(0);
  const [previewMode, setPreviewMode] = useState<"blueprint" | "media">("blueprint");
  const { data: gh, loading: ghLoading } = useGitHubTelemetry();
  const p = projectsData[active];

  useEffect(() => {
    const onSelect = (e: Event) => {
      const idx = (e as CustomEvent<number>).detail;
      if (typeof idx === "number" && idx >= 0 && idx < projectsData.length) {
        setActive(idx);
      }
    };
    window.addEventListener(SELECT_PROJECT_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_PROJECT_EVENT, onSelect);
  }, []);

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
          description="Systems I have designed and engineered across academic research governance, remote healthcare monitoring, and applied machine learning. Select a system and interact with its live blueprint."
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
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] bg-ink-900/50 px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              </div>
              <p className="font-mono text-[11px] text-fg-subtle">
                ~/work/<span className="text-fg">{slug(p.title)}</span>
                <span className="text-fg-faint">/case-study.sys</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-lg border border-white/[0.08] bg-ink-900 p-0.5 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => {
                    sfx.tick();
                    setPreviewMode("blueprint");
                  }}
                  className={`rounded-md px-2.5 py-1 transition-colors ${previewMode === "blueprint" ? "bg-white/[0.08] text-accent" : "text-fg-subtle hover:text-fg"
                    }`}
                >
                  Interactive UI
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sfx.tick();
                    setPreviewMode("media");
                  }}
                  className={`rounded-md px-2.5 py-1 transition-colors ${previewMode === "media" ? "bg-white/[0.08] text-accent" : "text-fg-subtle hover:text-fg"
                    }`}
                >
                  Cover View
                </button>
              </div>
              <p className="font-mono text-[11px] text-fg-faint">
                {active + 1} / {projectsData.length}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12">
            {/* File list */}
            <ul className="border-b border-white/[0.07] lg:col-span-4 lg:border-b-0 lg:border-r" role="tablist">
              {projectsData.map((proj, i) => {
                const isActive = i === active;
                return (
                  <li key={proj.title} className="border-b border-white/[0.05] last:border-0">
                    <button
                      id={`project-${slug(proj.title)}`}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => {
                        sfx.click();
                        setActive(i);
                      }}
                      className={`group relative flex w-full flex-col gap-3 px-5 py-6 text-left transition-colors sm:px-6 sm:py-7 ${isActive ? "bg-white/[0.035]" : "hover:bg-white/[0.015]"
                        }`}
                    >
                      {isActive && (
                        <motion.span layoutId="project-indicator" className="absolute inset-y-0 left-0 w-0.5 bg-accent" />
                      )}

                      <div className="flex w-full items-center justify-between gap-3">
                        <span className={`font-mono text-[11px] ${isActive ? "text-accent" : "text-fg-faint"}`}>
                          {String(i + 1).padStart(2, "0")} // {proj.period}
                        </span>
                        {isActive ? (
                          <FolderOpen className="h-4 w-4 text-accent" strokeWidth={1.6} />
                        ) : (
                          <Folder className="h-4 w-4 text-fg-faint transition-colors group-hover:text-fg-muted" strokeWidth={1.6} />
                        )}
                      </div>

                      <div>
                        <p
                          className={`text-2xl font-semibold tracking-tight transition-colors ${isActive ? "text-fg" : "text-fg-subtle group-hover:text-fg"
                            }`}
                        >
                          {proj.title}
                        </p>
                        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">
                          {proj.category}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.stack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className={`rounded border px-2 py-0.5 font-mono text-[10px] ${isActive
                              ? "border-accent/25 bg-accent/[0.06] text-fg-muted"
                              : "border-white/[0.06] bg-white/[0.015] text-fg-faint"
                              }`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Inspector */}
            <div className="relative lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.article
                  key={p.title}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.28 }}
                  className="flex h-full flex-col"
                >
                  {/* Visual Blueprint or Cover Image */}
                  <div className="relative min-h-[260px] overflow-hidden border-b border-white/[0.07] bg-ink-900">
                    {previewMode === "blueprint" ? (
                      <ProjectBlueprint project={p} />
                    ) : (
                      <div className="relative aspect-[16/8] w-full overflow-hidden">
                        <motion.img
                          src={p.image}
                          alt={`${p.title} project preview`}
                          loading="lazy"
                          initial={{ scale: 1.05 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full w-full object-cover opacity-75 grayscale-[40%] contrast-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-850 via-ink-850/30 to-transparent" />
                        <div className="absolute inset-0 bg-grid opacity-30" />
                        <span className="absolute left-5 top-4 rounded-md border border-white/10 bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-muted backdrop-blur">
                          {p.type}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Case Study Body */}
                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    {/* Title & Meta Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">{p.title}</h3>
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent/[0.08] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                            <ShieldCheck className="h-3 w-3" />
                            {p.status}
                          </span>
                        </div>
                        <p className="mt-1.5 font-mono text-xs text-fg-subtle">
                          Role: <span className="text-fg-muted">{p.role}</span> · {p.type}
                        </p>
                      </div>

                      {/* Key Metrics */}
                      <div className="flex flex-wrap gap-2">
                        {p.metrics.map((m) => (
                          <div
                            key={m.label}
                            className="rounded-lg border border-white/[0.07] bg-ink-900/70 px-3 py-1.5 text-right font-mono"
                          >
                            <p className="text-[10px] uppercase tracking-wider text-fg-faint">{m.label}</p>
                            <p className="text-xs font-medium text-fg">{m.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="mt-4 text-base leading-relaxed text-fg-muted">{p.description}</p>

                    {/* Problem & Solution Grid */}
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-white/[0.06] bg-ink-900/50 p-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-signal-amber">
                          01 // Problem Statement
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-fg-muted">{p.problem}</p>
                      </div>
                      <div className="rounded-lg border border-white/[0.06] bg-ink-900/50 p-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                          02 // Engineered Solution
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-fg-muted">{p.solution}</p>
                      </div>
                    </div>

                    {/* Key Engineering Highlights */}
                    <div className="mt-6 rounded-lg border border-white/[0.06] bg-ink-900/35 p-4">
                      <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                        <Layers className="h-3.5 w-3.5 text-accent" />
                        Key System Deliverables
                      </p>
                      <ul className="space-y-2">
                        {p.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2.5 text-sm text-fg-muted">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Stack & Action Bar */}
                    <div className="mt-6 flex flex-col justify-between gap-5 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center">
                      <div>
                        <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
                          <Cpu className="h-3 w-3 text-accent" /> Technical Stack
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {p.stack.map((t) => (
                            <span key={t} className="chip border-white/10 text-fg">
                              <span className="text-accent">#</span>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            sfx.click();
                            scrollToSection("contact");
                          }}
                          className="btn-primary h-9 px-3.5 text-xs"
                        >
                          <MessageSquareShare className="h-3.5 w-3.5" />
                          Request Walkthrough
                        </button>
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => sfx.tick()}
                            className="btn-ghost h-9 px-3.5 text-xs"
                          >
                            <GitBranch className="h-3.5 w-3.5" />
                            GitHub
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Live GitHub REST API Feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="panel mt-6 overflow-hidden"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] bg-ink-900/50 px-5 py-3">
            <div className="flex items-center gap-2.5 font-mono text-[11px]">
              <GitBranch className="h-3.5 w-3.5 text-accent" />
              <span className="text-fg-subtle">
                GET <span className="text-fg">api.github.com/users/{gh?.username ?? "jakesanity"}/repos</span>
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="flex items-center gap-1.5 text-fg-subtle">
                <span className="status-dot" />
                {ghLoading ? "fetching..." : gh?.live ? `200 OK · ${gh.publicRepos} public repos` : "synced"}
              </span>
            </div>
          </div>

          <div className="grid gap-px bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
            {(gh?.repos ?? []).slice(0, 6).map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sfx.tick()}
                className="group flex flex-col justify-between bg-ink-850 p-5 transition-colors hover:bg-ink-800"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-mono text-sm font-medium text-fg transition-colors group-hover:text-accent">
                      {repo.name}
                    </p>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-fg-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-fg-muted">
                    {repo.description || "Source repository and implementation files on GitHub."}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3 font-mono text-[10px] text-fg-subtle">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-accent/80" />
                    {repo.language || "Code"}
                  </span>
                  <span>
                    updated{" "}
                    {new Date(repo.updated_at).toLocaleDateString("en-GB", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
