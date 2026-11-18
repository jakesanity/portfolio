import { motion } from "framer-motion";
import { Code2, Keyboard, RotateCcw, Sparkles, Terminal as TerminalIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { aboutData, experienceData, personalInfo, projectsData, skillsData } from "../data/portfolio";
import {
  askPortfolioCopilot,
  fetchDavaoWeather,
  fetchGitHubTelemetry,
  getSystemDiagnostics,
} from "../lib/api";
import { FOCUS_TERMINAL_EVENT, SYSTEM_VERSION, scrollToSection, sections, selectProject, type SectionId } from "../lib/sections";
import {
  THEMES,
  getSoundEnabled,
  getTheme,
  setSoundEnabled,
  setTheme,
  sfx,
  unlockMilestone,
  useSystemTheme,
  type ThemeId,
} from "../lib/system";
import SectionHeader from "./ui/SectionHeader";

const meta = sections.find((s) => s.id === "shell")!;

type Line = { id: number; kind: "in" | "out" | "err" | "sys"; content: ReactNode };
type ShellView = "zsh" | "bench" | "matrix";

const COMMANDS: Record<string, string> = {
  help: "list available commands",
  ask: "query AI portfolio copilot: ask <question>",
  bench: "launch interactive developer code typing WPM benchmark",
  matrix: "launch real-time digital rain telemetry stream",
  neofetch: "display AJB/OS emblem and live telemetry",
  github: "fetch live repositories from api.github.com/users/jakesanity",
  weather: "fetch live Davao City weather via Open-Meteo API",
  status: "run hardware, network & battery diagnostics",
  whoami: "print identity",
  about: "read a document: about [background|mission|vision|goals|motivation]",
  skills: "show technical stack",
  projects: "list projects and tech stacks",
  certs: "list verified certifications",
  experience: "show work history",
  contact: "show contact channels",
  theme: "switch signal accent: theme [lime|cyan|amber|emerald]",
  sound: "toggle UI audio synth: sound [on|off]",
  ls: "list modules",
  cd: "open a module or project: cd <module|project>",
  cv: "open CV in a new tab",
  date: "print local time (PHT)",
  echo: "print text",
  history: "show command history",
  clear: "clear the screen",
  "sudo hire-me": "you know what this does",
};

const CODE_SNIPPETS = [
  {
    lang: "TypeScript · RECHECK",
    code: "const approveProtocol = async (id: string) => await db.protocols.update({ id, status: 'VERIFIED' });",
  },
  {
    lang: "Python · InsightAi",
    code: "kmeans = KMeans(n_clusters=4, random_state=42).fit(rfm_scaled[['recency', 'frequency', 'monetary']])",
  },
  {
    lang: "React · ElderlyCare",
    code: "useEffect(() => subscribeVitals(patientId, (bpm) => setTelemetry({ bpm, synced: true })), [patientId]);",
  },
  {
    lang: "SQL · Governance Audit",
    code: "SELECT protocol_id, reviewer_role, signed_at FROM ethics_reviews WHERE status = 'APPROVED' ORDER BY signed_at DESC;",
  },
];

const ABOUT_KEYS = ["background", "mission", "vision", "goals", "motivation"] as const;
const THEME_KEYS = ["lime", "cyan", "amber", "emerald"] as const;

let uid = 0;
const mk = (kind: Line["kind"], content: ReactNode): Line => ({ id: ++uid, kind, content });

function Row({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-4 sm:grid-cols-[160px_1fr]">
      <span className="text-fg-subtle">{k}</span>
      <span>{v}</span>
    </div>
  );
}

function bar(level: number) {
  const n = Math.round(level / 5);
  return (
    <span>
      <span className="text-accent">{"|".repeat(n)}</span>
      <span className="text-fg-faint">{".".repeat(20 - n)}</span>
      <span className="ml-3 text-fg-subtle">{level}%</span>
    </span>
  );
}

const WELCOME: Line[] = [
  mk("sys", `AJB/OS ${SYSTEM_VERSION} interactive shell · live APIs connected`),
  mk(
    "sys",
    <span>
      Type <span className="text-accent">help</span>, <span className="text-accent">bench</span>,{" "}
      <span className="text-accent">matrix</span>, <span className="text-accent">github</span>, or{" "}
      <span className="text-accent">ask &lt;question&gt;</span>.
    </span>
  ),
];

/* ------------------------------------------------------------------ */
/*  Matrix Digital Rain Canvas                                         */
/* ------------------------------------------------------------------ */

function MatrixRain({ accentHex, onExit }: { accentHex: string; onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();

    const chars = "AJBOS0123456789ABCDEF<>/{}[]$#*+=~^";
    const fontSize = 14;
    const columns = Math.max(10, Math.floor(canvas.width / fontSize));
    const drops = Array.from({ length: columns }, () => Math.random() * -30);

    const interval = window.setInterval(() => {
      ctx.fillStyle = "rgba(10, 10, 11, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.88 ? "#ffffff" : accentHex;
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 38);

    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", resize);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", resize);
    };
  }, [accentHex, onExit]);

  return (
    <div
      onClick={onExit}
      className="relative h-[440px] w-full cursor-pointer overflow-hidden bg-ink-950"
      title="Click or press ESC to return to zsh"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center">
        <div className="rounded-full border border-accent/40 bg-ink-950/90 px-4 py-1.5 font-mono text-[11px] text-accent shadow-lg backdrop-blur">
          MATRIX TELEMETRY STREAM ACTIVE · CLICK OR PRESS ESC TO EXIT
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Developer Code Typing WPM Benchmark                                */
/* ------------------------------------------------------------------ */

function CodeBenchmark({ onExit }: { onExit: () => void }) {
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const snippet = CODE_SNIPPETS[snippetIdx];
  const target = snippet.code;
  const completed = typed === target;

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, [snippetIdx]);

  useEffect(() => {
    if (!startTime || endTime) return;
    const t = window.setInterval(() => setNow(Date.now()), 120);
    return () => window.clearInterval(t);
  }, [startTime, endTime]);

  const handleChange = (val: string) => {
    if (val.length > target.length) return;
    if (!startTime && val.length === 1) {
      setStartTime(Date.now());
      setNow(Date.now());
    }
    sfx.tick();
    setTyped(val);
    if (val === target) {
      setEndTime(Date.now());
      sfx.confirm();
      unlockMilestone("shell");
    }
  };

  const reset = (nextIdx = snippetIdx) => {
    sfx.click();
    setSnippetIdx(nextIdx);
    setTyped("");
    setStartTime(null);
    setEndTime(null);
    window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 40);
  };

  const elapsedMin = startTime ? Math.max(0.01, ((endTime ?? now) - startTime) / 60000) : 0;
  let correctChars = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) correctChars++;
  }
  const wpm = startTime ? Math.round(correctChars / 5 / elapsedMin) : 0;
  const accuracy = typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100;
  const rank =
    wpm >= 90 ? "10x Principal Architect" : wpm >= 65 ? "Senior Full-Stack Operator" : wpm >= 40 ? "Systems Engineer" : "Warming Up";

  return (
    <div
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
      className="flex h-[440px] flex-col justify-between bg-ink-900/50 p-6 font-mono"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
        <div className="flex items-center gap-2.5">
          <Code2 className="h-4 w-4 text-accent" />
          <span className="text-xs font-medium text-fg">CODE SPEED BENCHMARK // {snippet.lang}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              reset((snippetIdx + 1) % CODE_SNIPPETS.length);
            }}
            className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-ink-850 px-2.5 py-1 text-[11px] text-fg-muted hover:border-accent/40 hover:text-fg"
          >
            <RotateCcw className="h-3 w-3" /> Next Snippet
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onExit();
            }}
            className="rounded border border-white/10 bg-ink-850 px-2.5 py-1 text-[11px] text-fg-subtle hover:text-fg"
          >
            Exit to zsh
          </button>
        </div>
      </div>

      {/* Live Telemetry Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-white/[0.07] bg-ink-850 p-3.5">
          <p className="text-[10px] uppercase text-fg-faint">Speed (WPM)</p>
          <p className="mt-1 text-2xl font-semibold text-accent">{wpm}</p>
        </div>
        <div className="rounded-lg border border-white/[0.07] bg-ink-850 p-3.5">
          <p className="text-[10px] uppercase text-fg-faint">Precision</p>
          <p className="mt-1 text-2xl font-semibold text-fg">{accuracy}%</p>
        </div>
        <div className="rounded-lg border border-white/[0.07] bg-ink-850 p-3.5">
          <p className="text-[10px] uppercase text-fg-faint">Operator Rank</p>
          <p className="mt-1 truncate text-sm font-medium text-signal-cyan sm:text-base">{rank}</p>
        </div>
      </div>

      {/* Code Prompt */}
      <div className="relative rounded-xl border border-white/10 bg-ink-950 p-5 text-sm leading-relaxed sm:text-base">
        <p className="mb-2 text-[10px] uppercase tracking-wider text-fg-faint">
          {completed ? "BENCHMARK COMPLETE! PRESS NEXT SNIPPET OR RESET" : "TYPE THE CODE BELOW TO BENCHMARK YOUR SPEED:"}
        </p>
        <div className="break-all font-mono tracking-tight">
          {target.split("").map((ch, idx) => {
            const typedChar = typed[idx];
            const isCurrent = idx === typed.length;
            let cls = "text-fg-faint";
            if (typedChar !== undefined) {
              cls = typedChar === ch ? "text-accent" : "bg-signal-red/30 text-signal-red";
            }
            return (
              <span
                key={idx}
                className={`${cls} ${isCurrent ? "border-b-2 border-accent bg-accent/15 text-fg" : ""}`}
              >
                {ch}
              </span>
            );
          })}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={typed}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onExit();
          }}
          aria-label="Code benchmark input"
          className="absolute inset-0 cursor-text opacity-0"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-fg-subtle">
        <span>
          Progress: {typed.length} / {target.length} chars
        </span>
        {completed && (
          <span className="inline-flex items-center gap-1.5 text-accent">
            <Sparkles className="h-3.5 w-3.5" /> Completed at {wpm} WPM ({accuracy}% accuracy)
          </span>
        )}
      </div>
    </div>
  );
}

export default function Terminal() {
  const [view, setView] = useState<ShellView>("zsh");
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState<number | null>(null);
  const { spec } = useSystemTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  useEffect(() => {
    const focus = () => {
      setView("zsh");
      window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
    };
    window.addEventListener(FOCUS_TERMINAL_EVENT, focus);
    return () => window.removeEventListener(FOCUS_TERMINAL_EVENT, focus);
  }, []);

  const appendLines = useCallback((...newLines: Line[]) => {
    setLines((l) => [...l, ...newLines]);
  }, []);

  const execute = useCallback(
    (raw: string) => {
      const input = raw.trim();
      const out: Line[] = [mk("in", input)];
      const [cmd, ...args] = input.split(/\s+/);
      const arg = args.join(" ");
      const navigate = (id: SectionId, label: string) => {
        out.push(
          mk(
            "out",
            <span>
              opening <span className="text-accent">{label}</span> ...
            </span>
          )
        );
        window.setTimeout(() => scrollToSection(id), 350);
      };

      if (!input) {
        setLines((l) => [...l, ...out]);
        return;
      }

      sfx.click();
      unlockMilestone("shell");

      switch (cmd.toLowerCase()) {
        case "help":
          out.push(
            mk(
              "out",
              <div className="space-y-0.5">
                {Object.entries(COMMANDS).map(([k, v]) => (
                  <Row key={k} k={k} v={<span className="text-fg-muted">{v}</span>} />
                ))}
              </div>
            )
          );
          break;
        case "bench":
        case "type":
        case "benchmark":
          setLines((l) => [...l, ...out, mk("sys", "launching developer code typing benchmark ...")]);
          setView("bench");
          return;
        case "matrix":
          setLines((l) => [...l, ...out, mk("sys", "initializing matrix telemetry stream ...")]);
          setView("matrix");
          return;
        case "ask":
        case "ai": {
          const q = arg.trim() || "What systems has Aldwin built and is he available for internships?";
          out.push(
            mk(
              "sys",
              <span>
                querying AJB/OS copilot for <span className="text-fg">"{q}"</span> ...
              </span>
            )
          );
          setLines((l) => [...l, ...out]);
          askPortfolioCopilot(q).then((res) => {
            sfx.confirm();
            appendLines(
              mk(
                "out",
                <div className="max-w-3xl space-y-1 rounded-lg border border-white/[0.07] bg-ink-900/70 p-3.5">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-accent">
                    [{res.source === "gemini-api" ? "GEMINI 2.5 FLASH API" : "AJB/OS KNOWLEDGE KERNEL"}]
                  </p>
                  <p className="text-fg-muted">{res.answer}</p>
                </div>
              )
            );
          });
          return;
        }
        case "github":
        case "gh": {
          out.push(mk("sys", "GET https://api.github.com/users/jakesanity/repos ..."));
          setLines((l) => [...l, ...out]);
          fetchGitHubTelemetry().then((gh) => {
            sfx.confirm();
            appendLines(
              mk(
                "out",
                <div className="space-y-2">
                  <p className="text-fg-subtle">
                    <span className="text-accent">@{gh.username}</span> · {gh.publicRepos} public repos ·{" "}
                    {gh.live ? "200 OK (live GitHub API)" : "cached snapshot"}
                  </p>
                  <div className="space-y-1.5">
                    {gh.repos.map((r, i) => (
                      <div key={r.id}>
                        <span className="text-fg-faint">{String(i + 1).padStart(2, "0")} </span>
                        <a
                          href={r.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-accent underline-offset-4 hover:underline"
                        >
                          {r.name}
                        </a>
                        <span className="text-fg-subtle"> [{r.language || "Code"}]</span>
                        {r.description && <p className="pl-6 text-fg-muted">{r.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )
            );
          });
          return;
        }
        case "weather": {
          out.push(mk("sys", "GET https://api.open-meteo.com/v1/forecast (Davao City 7.0731N, 125.6128E) ..."));
          setLines((l) => [...l, ...out]);
          fetchDavaoWeather().then((w) => {
            sfx.confirm();
            appendLines(
              mk(
                "out",
                <div className="space-y-0.5">
                  <Row k="location" v="Davao City, Philippines (ph-dvo-01)" />
                  <Row k="condition" v={<span className="text-accent">{w.condition}</span>} />
                  <Row k="temperature" v={`${w.tempC}°C`} />
                  <Row k="humidity" v={`${w.humidity}%`} />
                  <Row k="wind" v={`${w.windKph} km/h`} />
                  <Row k="source" v={w.live ? "Open-Meteo Live Telemetry API" : "Cached Telemetry"} />
                </div>
              )
            );
          });
          return;
        }
        case "status":
        case "ping": {
          out.push(mk("sys", "probing hardware, network & battery APIs ..."));
          setLines((l) => [...l, ...out]);
          getSystemDiagnostics().then((diag) => {
            sfx.confirm();
            appendLines(
              mk(
                "out",
                <div className="space-y-0.5">
                  <Row k="cpu threads" v={`${diag.cores} logical cores`} />
                  <Row k="device memory" v={String(diag.memoryGb)} />
                  <Row k="network link" v={`${diag.networkType} (${diag.downlinkMbps})`} />
                  <Row k="round-trip rtt" v={<span className="text-accent">{diag.rttMs}</span>} />
                  <Row
                    k="power state"
                    v={`${diag.batteryPct}${diag.charging !== null ? (diag.charging ? " · charging" : " · battery") : ""}`}
                  />
                  <Row k="platform" v={diag.userAgentPlatform} />
                </div>
              )
            );
          });
          return;
        }
        case "neofetch": {
          const activeTheme = THEMES[getTheme()];
          const res = typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "1920x1080";
          out.push(
            mk(
              "out",
              <div className="my-1 flex flex-col gap-6 sm:flex-row sm:items-center">
                <pre className="select-none font-mono text-[11px] leading-[1.25] text-accent">
                  {[
                    "      /\\       ",
                    "     /  \\      ",
                    "    / /\\ \\     ",
                    "   / ____ \\    ",
                    "  /_/    \\_\\   ",
                    "  A J B / O S  ",
                  ].join("\n")}
                </pre>
                <div className="space-y-0.5 text-xs">
                  <p className="font-semibold text-fg">
                    aldwin<span className="text-accent">@</span>ajb-os
                  </p>
                  <p className="text-fg-faint">--------------------------</p>
                  <p>
                    <span className="text-accent">OS:</span> AJB/OS {SYSTEM_VERSION} (WebGL 2.0)
                  </p>
                  <p>
                    <span className="text-accent">Host:</span> {personalInfo.location} ({personalInfo.coordinates.node})
                  </p>
                  <p>
                    <span className="text-accent">Role:</span> {personalInfo.subtitle}
                  </p>
                  <p>
                    <span className="text-accent">Resolution:</span> {res}
                  </p>
                  <p>
                    <span className="text-accent">Theme:</span> {activeTheme.label} ({activeTheme.hex})
                  </p>
                  <p>
                    <span className="text-accent">Audio Synth:</span> {getSoundEnabled() ? "Enabled" : "Muted"}
                  </p>
                  <div className="flex gap-1.5 pt-1.5">
                    {Object.values(THEMES).map((t) => (
                      <span
                        key={t.id}
                        className="inline-block h-3 w-5 rounded-sm"
                        style={{ backgroundColor: t.hex }}
                        title={t.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )
          );
          break;
        }
        case "whoami":
          out.push(
            mk(
              "out",
              <div className="space-y-0.5">
                <Row k="name" v={personalInfo.name} />
                <Row k="role" v={personalInfo.title} />
                <Row k="tagline" v={personalInfo.subtitle} />
                <Row k="location" v={personalInfo.location} />
                <Row k="status" v={<span className="text-accent">open to opportunities</span>} />
              </div>
            )
          );
          break;
        case "about": {
          const key = (arg || "background").toLowerCase() as (typeof ABOUT_KEYS)[number];
          if (!ABOUT_KEYS.includes(key)) {
            out.push(mk("err", `about: unknown document '${arg}'. try: ${ABOUT_KEYS.join(", ")}`));
          } else {
            out.push(mk("out", <p className="max-w-3xl text-fg-muted">{aboutData[key]}</p>));
          }
          break;
        }
        case "skills":
          out.push(
            mk(
              "out",
              <div className="space-y-0.5">
                {skillsData.technical.map((s) => (
                  <Row key={s.name} k={s.name.toLowerCase()} v={bar(s.level)} />
                ))}
              </div>
            )
          );
          break;
        case "projects":
          out.push(
            mk(
              "out",
              <div className="space-y-2.5">
                {projectsData.map((p, i) => (
                  <div key={p.title}>
                    <span className="text-fg-faint">{String(i + 1).padStart(2, "0")} </span>
                    <span className="font-medium text-fg">{p.title}</span>
                    <span className="text-fg-subtle">
                      {" "}
                      / {p.category} ({p.period})
                    </span>
                    <p className="pl-6 text-fg-muted">
                      {p.stack.map((t) => `#${t.toLowerCase().replace(/\s+/g, "-")}`).join("  ")}
                    </p>
                  </div>
                ))}
                <p className="text-fg-subtle">
                  run <span className="text-accent">cd recheck</span>, <span className="text-accent">cd elderlycare</span>, or{" "}
                  <span className="text-accent">cd insightai</span> to inspect a system
                </p>
              </div>
            )
          );
          break;
        case "certs":
          out.push(
            mk(
              "out",
              <div className="space-y-1">
                {aboutData.certifications.map((c, i) => (
                  <div key={c}>
                    <span className="text-accent">{String(i + 1).padStart(2, "0")} </span>
                    <span className="text-fg">{c}</span>
                  </div>
                ))}
              </div>
            )
          );
          break;
        case "experience":
          out.push(
            mk(
              "out",
              <div className="space-y-2">
                {experienceData.map((e) => (
                  <div key={e.role}>
                    <span className="text-fg">{e.role}</span>
                    <span className="text-fg-subtle">
                      {" "}
                      @ {e.company} / {e.period}
                    </span>
                    {e.responsibilities.map((r) => (
                      <p key={r} className="pl-4 text-fg-muted">
                        <span className="text-accent">+</span> {r}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )
          );
          break;
        case "contact":
          out.push(
            mk(
              "out",
              <div className="space-y-0.5">
                <Row
                  k="email"
                  v={
                    <a className="text-accent underline-offset-4 hover:underline" href={`mailto:${personalInfo.email}`}>
                      {personalInfo.email}
                    </a>
                  }
                />
                <Row
                  k="phone"
                  v={
                    <a className="hover:text-accent" href={`tel:${personalInfo.phone.replace(/\s+/g, "")}`}>
                      {personalInfo.phone}
                    </a>
                  }
                />
                <Row
                  k="github"
                  v={
                    <a className="hover:text-accent" href={personalInfo.github} target="_blank" rel="noreferrer">
                      {personalInfo.github.replace("https://", "")}
                    </a>
                  }
                />
                <Row
                  k="linkedin"
                  v={
                    <a className="hover:text-accent" href={personalInfo.linkedin} target="_blank" rel="noreferrer">
                      {personalInfo.linkedin.replace("https://", "")}
                    </a>
                  }
                />
              </div>
            )
          );
          break;
        case "theme": {
          const targetTheme = arg.toLowerCase() as ThemeId;
          if (!arg) {
            const curr = THEMES[getTheme()];
            out.push(
              mk(
                "out",
                <span>
                  current theme: <span className="text-accent">{curr.label}</span> ({curr.id}). usage: theme [lime|cyan|amber|emerald]
                </span>
              )
            );
          } else if (THEME_KEYS.includes(targetTheme)) {
            setTheme(targetTheme);
            out.push(
              mk(
                "out",
                <span>
                  signal theme updated to <span className="text-accent">{THEMES[targetTheme].label}</span>
                </span>
              )
            );
          } else {
            out.push(mk("err", `theme: unknown preset '${arg}'. available: ${THEME_KEYS.join(", ")}`));
          }
          break;
        }
        case "sound": {
          const mode = arg.toLowerCase();
          if (mode === "on" || mode === "1") {
            setSoundEnabled(true);
            out.push(mk("out", <span className="text-accent">UI audio synth enabled</span>));
          } else if (mode === "off" || mode === "mute" || mode === "0") {
            setSoundEnabled(false);
            out.push(mk("out", "UI audio synth muted"));
          } else {
            const next = !getSoundEnabled();
            setSoundEnabled(next);
            out.push(mk("out", `UI audio synth ${next ? "enabled" : "muted"}`));
          }
          break;
        }
        case "ls":
          out.push(
            mk(
              "out",
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                {sections.map((s) => (
                  <span key={s.id} className="text-signal-cyan">
                    {s.id === "top" ? "index" : s.label.toLowerCase()}/
                  </span>
                ))}
              </div>
            )
          );
          break;
        case "cd":
        case "goto":
        case "open": {
          const target = arg.toLowerCase().replace(/[/~]/g, "");
          const projIdx = projectsData.findIndex((p) => p.id === target || p.title.toLowerCase() === target);
          if (projIdx !== -1) {
            const proj = projectsData[projIdx];
            out.push(
              mk(
                "out",
                <span>
                  opening <span className="text-accent">~/work/{proj.id}</span> ...
                </span>
              )
            );
            window.setTimeout(() => selectProject(projIdx), 350);
            break;
          }
          const match = sections.find(
            (s) =>
              s.label.toLowerCase() === target ||
              s.id === target ||
              (target === "index" && s.id === "top") ||
              (target === "" && s.id === "top")
          );
          if (match) navigate(match.id, match.path);
          else out.push(mk("err", `cd: no such module or project: ${arg}`));
          break;
        }
        case "cv":
        case "resume":
          out.push(mk("out", "opening Bucio-CV.pdf ..."));
          window.open(personalInfo.resumeUrl, "_blank");
          break;
        case "date":
          out.push(
            mk(
              "out",
              new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeStyle: "medium", timeZone: "Asia/Manila" }).format(
                new Date()
              ) + " (PHT)"
            )
          );
          break;
        case "echo":
          out.push(mk("out", arg));
          break;
        case "history":
          out.push(
            mk(
              "out",
              history.length ? (
                <div>
                  {history.map((h, i) => (
                    <div key={i}>
                      <span className="text-fg-faint">{String(i + 1).padStart(3, " ")}  </span>
                      {h}
                    </div>
                  ))}
                </div>
              ) : (
                "no history yet"
              )
            )
          );
          break;
        case "clear":
          setLines([]);
          return;
        case "sudo":
          if (arg === "hire-me" || arg === "hire me") {
            sfx.confirm();
            out.push(mk("out", <span className="text-accent">[sudo] permission granted. initiating contact protocol ...</span>));
            window.setTimeout(() => scrollToSection("contact"), 700);
          } else {
            out.push(mk("err", "sudo: nice try. this incident will be reported."));
          }
          break;
        default:
          out.push(mk("err", `command not found: ${cmd}. type 'help' for a list of commands.`));
      }
      setLines((l) => [...l, ...out]);
    },
    [appendLines, history]
  );

  const submit = (cmd: string) => {
    setView("zsh");
    execute(cmd);
    if (cmd.trim()) setHistory((h) => [...h, cmd.trim()]);
    setHIndex(null);
    setValue("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit(value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = hIndex === null ? history.length - 1 : Math.max(0, hIndex - 1);
      setHIndex(next);
      setValue(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIndex === null) return;
      const next = hIndex + 1;
      if (next >= history.length) {
        setHIndex(null);
        setValue("");
      } else {
        setHIndex(next);
        setValue(history[next]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const v = value.toLowerCase();
      if (!v) return;
      const parts = v.split(" ");
      if (parts.length === 1) {
        const match = Object.keys(COMMANDS).find((c) => c.startsWith(v));
        if (match) setValue(match + (match.includes(" ") ? "" : " "));
      } else if (parts[0] === "cd" || parts[0] === "about" || parts[0] === "theme") {
        const pool =
          parts[0] === "cd"
            ? [
                ...sections.map((s) => (s.id === "top" ? "index" : s.label.toLowerCase())),
                ...projectsData.map((p) => p.id),
              ]
            : parts[0] === "theme"
              ? [...THEME_KEYS]
              : [...ABOUT_KEYS];
        const match = pool.find((x) => x.startsWith(parts[1]));
        if (match) setValue(`${parts[0]} ${match}`);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const suggestions = [
    "bench",
    "matrix",
    "ask why hire Aldwin?",
    "github",
    "weather",
    "status",
    "neofetch",
    "sudo hire-me",
  ];

  return (
    <section id="shell" className="relative border-t border-white/[0.05] py-28 lg:py-36">
      <div className="shell">
        <SectionHeader
          meta={meta}
          title={
            <>
              Don't scroll.
              <span className="text-fg-subtle"> Query.</span>
            </>
          }
          description="Connected to live GitHub, Open-Meteo Davao weather, hardware diagnostics, an AI portfolio copilot, and a live developer code typing benchmark."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="panel overflow-hidden shadow-[0_40px_120px_-40px_rgba(var(--accent-rgb),0.12)]"
          onClick={() => {
            if (view === "zsh") inputRef.current?.focus({ preventScroll: true });
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-ink-800/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="ml-2 font-mono text-[11px] text-fg-subtle">guest@ajb-os: ~</span>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-ink-900 p-0.5 font-mono text-[10px]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  sfx.tick();
                  setView("zsh");
                }}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors ${
                  view === "zsh" ? "bg-accent/15 text-accent" : "text-fg-subtle hover:text-fg"
                }`}
              >
                <TerminalIcon className="h-3 w-3" /> zsh shell
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  sfx.tick();
                  unlockMilestone("shell");
                  setView("bench");
                }}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors ${
                  view === "bench" ? "bg-accent/15 text-accent" : "text-fg-subtle hover:text-fg"
                }`}
              >
                <Keyboard className="h-3 w-3" /> wpm bench
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  sfx.tick();
                  unlockMilestone("shell");
                  setView("matrix");
                }}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors ${
                  view === "matrix" ? "bg-accent/15 text-accent" : "text-fg-subtle hover:text-fg"
                }`}
              >
                <Sparkles className="h-3 w-3" /> matrix
              </button>
            </div>
          </div>

          {view === "matrix" ? (
            <MatrixRain accentHex={spec.hex} onExit={() => setView("zsh")} />
          ) : view === "bench" ? (
            <CodeBenchmark onExit={() => setView("zsh")} />
          ) : (
            <div
              ref={scrollRef}
              className="h-[440px] overflow-y-auto px-5 py-5 font-mono text-[12.5px] leading-relaxed text-fg sm:px-6 sm:text-[13px]"
              role="log"
              aria-live="polite"
            >
              {lines.map((l) => (
                <div key={l.id} className="mb-1.5">
                  {l.kind === "in" ? (
                    <div>
                      <span className="text-accent">guest@ajb-os</span>
                      <span className="text-fg-faint">:</span>
                      <span className="text-signal-cyan">~</span>
                      <span className="text-fg-faint">$ </span>
                      <span>{l.content}</span>
                    </div>
                  ) : l.kind === "err" ? (
                    <div className="text-signal-red">{l.content}</div>
                  ) : l.kind === "sys" ? (
                    <div className="text-fg-subtle">{l.content}</div>
                  ) : (
                    <div className="mb-3 mt-1">{l.content}</div>
                  )}
                </div>
              ))}

              <label className="flex items-center">
                <span className="text-accent">guest@ajb-os</span>
                <span className="text-fg-faint">:</span>
                <span className="text-signal-cyan">~</span>
                <span className="text-fg-faint">$&nbsp;</span>
                <input
                  ref={inputRef}
                  id="terminal-input"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  aria-label="Terminal command input"
                  className="flex-1 bg-transparent text-fg caret-accent outline-none focus-visible:outline-none"
                />
              </label>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.07] px-4 py-3">
            <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">try</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={(e) => {
                  e.stopPropagation();
                  submit(s);
                  inputRef.current?.focus({ preventScroll: true });
                }}
                className="chip transition-colors hover:border-accent/40 hover:text-fg"
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
