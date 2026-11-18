import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2, Copy, Sparkles, Target } from "lucide-react";
import { useState } from "react";
import { personalInfo, projectsData } from "../../data/portfolio";
import { scrollToSection, selectProject } from "../../lib/sections";
import { sfx, unlockMilestone } from "../../lib/system";

interface RoleProfile {
  id: string;
  label: string;
  score: number;
  headline: string;
  summary: string;
  strengths: { label: string; pct: number }[];
  stack: string[];
  projectIds: string[];
}

const ROLES: RoleProfile[] = [
  {
    id: "fullstack",
    label: "Full-Stack Developer",
    score: 96,
    headline: "End-to-end web systems from relational SQL schema to responsive React UI",
    summary:
      "Strong fit for full-stack roles requiring structured workflow platforms, role-based access control (RBAC), REST API integration, and clean maintainable codebases.",
    strengths: [
      { label: "Frontend & Component Architecture", pct: 92 },
      { label: "Backend & REST Workflows (Laravel/PHP)", pct: 86 },
      { label: "Relational SQL & Schema Design", pct: 90 },
    ],
    stack: ["React", "TypeScript", "PHP / Laravel", "MySQL", "Tailwind CSS", "Git"],
    projectIds: ["recheck", "elderlycare"],
  },
  {
    id: "frontend",
    label: "Frontend / UI Engineer",
    score: 95,
    headline: "High-craft interfaces, design systems, and interactive React applications",
    summary:
      "Ideal for frontend teams that value pixel-accurate Figma translation, accessible high-contrast layouts, smooth Framer Motion interactions, and type-safe TypeScript.",
    strengths: [
      { label: "React & TypeScript Implementation", pct: 93 },
      { label: "Responsive Tailwind & CSS Systems", pct: 95 },
      { label: "Interactive Motion & UX Polish", pct: 91 },
    ],
    stack: ["React.js", "TypeScript", "HTML / CSS", "Tailwind CSS", "Framer Motion", "Figma"],
    projectIds: ["recheck", "elderlycare"],
  },
  {
    id: "uiux",
    label: "UI/UX Product Designer",
    score: 94,
    headline: "User-centered wireframing, prototyping, and developer-ready design tokens",
    summary:
      "Proven freelance and capstone track record designing intuitive institutional workflows, healthcare telemetry dashboards, and cohesive visual assets in Figma and Adobe tools.",
    strengths: [
      { label: "Figma Prototyping & Auto-Layout", pct: 94 },
      { label: "Information Architecture & User Flows", pct: 92 },
      { label: "Design-to-Engineering Handoff", pct: 96 },
    ],
    stack: ["Figma", "UI Systems", "Wireframing", "Adobe Photoshop", "Canva", "Prototyping"],
    projectIds: ["elderlycare", "recheck"],
  },
  {
    id: "intern",
    label: "IT / Systems & Data Intern",
    score: 98,
    headline: "Fast-learning BSIT candidate ready for software, data, or IT operations teams",
    summary:
      "Backed by 4 industry certificates (Google IT Support, Cisco Cybersecurity, freeCodeCamp) and hands-on experience across web apps, Python ML pipelines, and technical documentation.",
    strengths: [
      { label: "Applied Python & ML Analytics", pct: 88 },
      { label: "IT Diagnostics & System Documentation", pct: 95 },
      { label: "Team Collaboration & Fast Onboarding", pct: 98 },
    ],
    stack: ["Python", "Scikit-Learn", "SQL", "React", "Linux CLI", "Technical Docs"],
    projectIds: ["insightai", "recheck", "elderlycare"],
  },
];

export default function RoleMatcher() {
  const [selectedId, setSelectedId] = useState<string>("fullstack");
  const [copied, setCopied] = useState(false);
  const role = ROLES.find((r) => r.id === selectedId) ?? ROLES[0];

  const handleSelectRole = (id: string) => {
    sfx.tick();
    setSelectedId(id);
    unlockMilestone("matcher");
  };

  const copyBrief = async () => {
    const brief = [
      `CANDIDATE BRIEF — ${personalInfo.name}`,
      `Target Role: ${role.label} (${role.score}% Readiness Match)`,
      `Summary: ${role.summary}`,
      `Core Stack: ${role.stack.join(", ")}`,
      `Education: BS Information Technology @ UIC Davao City`,
      `Contact: ${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.github}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(brief);
      sfx.confirm();
      unlockMilestone("matcher");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="panel mt-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] bg-ink-900/60 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md border border-accent/40 bg-accent/10 text-accent">
            <Target className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="font-mono text-[11px] font-medium text-fg">
              RECRUITER DIAGNOSTIC // ROLE FIT ANALYZER
            </p>
            <p className="font-mono text-[10px] text-fg-subtle">
              select a target role to evaluate candidate alignment &amp; generate a hiring brief
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ROLES.map((r) => {
            const active = r.id === selectedId;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleSelectRole(r.id)}
                className={`rounded-md border px-3 py-1.5 font-mono text-[11px] transition-all ${
                  active
                    ? "border-accent/50 bg-accent/15 text-accent"
                    : "border-white/10 bg-ink-850 text-fg-subtle hover:border-white/20 hover:text-fg"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={role.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
          className="grid gap-6 p-6 lg:grid-cols-12"
        >
          {/* Score + Summary */}
          <div className="flex flex-col justify-between gap-5 lg:col-span-7">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-xs font-semibold text-accent">
                  <Sparkles className="h-3.5 w-3.5" />
                  {role.score}% ROLE ALIGNMENT
                </span>
                <span className="font-mono text-xs text-fg-subtle">Davao City / Remote Ready</span>
              </div>

              <h4 className="mt-3 text-xl font-semibold tracking-tight text-fg sm:text-2xl">
                {role.headline}
              </h4>
              <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{role.summary}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-4">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                <span className="text-fg-faint">Relevant Systems:</span>
                {role.projectIds.map((pid) => {
                  const idx = projectsData.findIndex((p) => p.id === pid);
                  const proj = projectsData[idx];
                  if (!proj) return null;
                  return (
                    <button
                      key={pid}
                      type="button"
                      onClick={() => {
                        sfx.click();
                        unlockMilestone("matcher");
                        selectProject(idx);
                      }}
                      className="rounded border border-accent/30 bg-accent/10 px-2.5 py-1 text-accent transition-colors hover:bg-accent/20"
                    >
                      ~/{proj.title}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyBrief}
                  className="btn-ghost h-9 px-3.5 text-xs"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Brief Copied" : "Copy Recruiter Brief"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sfx.click();
                    scrollToSection("contact");
                  }}
                  className="btn-primary h-9 px-3.5 text-xs"
                >
                  Interview Aldwin
                </button>
              </div>
            </div>
          </div>

          {/* Readiness Breakdown Bars */}
          <div className="flex flex-col justify-between rounded-xl border border-white/[0.06] bg-ink-900/60 p-5 lg:col-span-5">
            <div className="space-y-3.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                Capability Telemetry for {role.label}
              </p>
              {role.strengths.map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-fg-muted">
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                      {s.label}
                    </span>
                    <span className="font-mono text-[11px] text-accent">{s.pct}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.pct}%` }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-accent"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-white/[0.06] pt-3.5">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-fg-faint">
                Matched Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {role.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded border border-white/10 bg-ink-850 px-2 py-0.5 font-mono text-[10px] text-fg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
