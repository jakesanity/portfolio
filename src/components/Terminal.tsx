import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { aboutData, experienceData, personalInfo, projectsData, skillsData } from "../data/portfolio";
import { FOCUS_TERMINAL_EVENT, SYSTEM_VERSION, scrollToSection, sections, type SectionId } from "../lib/sections";
import SectionHeader from "./ui/SectionHeader";

const meta = sections.find((s) => s.id === "shell")!;

type Line = { id: number; kind: "in" | "out" | "err" | "sys"; content: ReactNode };

const COMMANDS: Record<string, string> = {
  help: "list available commands",
  whoami: "print identity",
  about: "read a document: about [background|mission|vision|goals|motivation]",
  skills: "show technical stack",
  projects: "list projects",
  experience: "show work history",
  contact: "show contact channels",
  ls: "list modules",
  cd: "open a module: cd <module>",
  cv: "open CV in a new tab",
  date: "print local time (PHT)",
  echo: "print text",
  history: "show command history",
  clear: "clear the screen",
  "sudo hire-me": "you know what this does",
};

const ABOUT_KEYS = ["background", "mission", "vision", "goals", "motivation"] as const;

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
  mk("sys", `AJB/OS ${SYSTEM_VERSION} interactive shell`),
  mk(
    "sys",
    <span>
      Type <span className="text-accent">help</span> to see available commands. Use Tab to autocomplete and arrow keys for history.
    </span>
  ),
];

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  useEffect(() => {
    const focus = () => inputRef.current?.focus({ preventScroll: true });
    window.addEventListener(FOCUS_TERMINAL_EVENT, focus);
    return () => window.removeEventListener(FOCUS_TERMINAL_EVENT, focus);
  }, []);

  const execute = useCallback(
    (raw: string) => {
      const input = raw.trim();
      const out: Line[] = [mk("in", input)];
      const [cmd, ...args] = input.split(/\s+/);
      const arg = args.join(" ");
      const navigate = (id: SectionId, label: string) => {
        out.push(mk("out", <span>opening <span className="text-accent">{label}</span> ...</span>));
        window.setTimeout(() => scrollToSection(id), 350);
      };

      if (!input) {
        setLines((l) => [...l, ...out]);
        return;
      }

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
              <div className="space-y-2">
                {projectsData.map((p, i) => (
                  <div key={p.title}>
                    <span className="text-fg-faint">{String(i + 1).padStart(2, "0")} </span>
                    <span className="text-fg">{p.title}</span>
                    <span className="text-fg-subtle"> / {p.category}</span>
                    <p className="pl-6 text-fg-muted">{p.tags.map((t) => `#${t.toLowerCase().replace(/\s+/g, "-")}`).join("  ")}</p>
                  </div>
                ))}
                <p className="text-fg-subtle">
                  run <span className="text-accent">cd work</span> to open the explorer
                </p>
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
                    <span className="text-fg-subtle"> @ {e.company} / {e.period}</span>
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
                <Row k="email" v={<a className="text-accent underline-offset-4 hover:underline" href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>} />
                <Row k="github" v={<a className="hover:text-accent" href={personalInfo.github} target="_blank" rel="noreferrer">{personalInfo.github.replace("https://", "")}</a>} />
                <Row k="linkedin" v={<a className="hover:text-accent" href={personalInfo.linkedin} target="_blank" rel="noreferrer">{personalInfo.linkedin.replace("https://", "")}</a>} />
              </div>
            )
          );
          break;
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
          const match = sections.find(
            (s) => s.label.toLowerCase() === target || s.id === target || (target === "index" && s.id === "top") || (target === "" && s.id === "top")
          );
          if (match) navigate(match.id, match.path);
          else out.push(mk("err", `cd: no such module: ${arg}`));
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
              new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeStyle: "medium", timeZone: "Asia/Manila" }).format(new Date()) + " (PHT)"
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
                <div>{history.map((h, i) => <div key={i}><span className="text-fg-faint">{String(i + 1).padStart(3, " ")}  </span>{h}</div>)}</div>
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
    [history]
  );

  const submit = (cmd: string) => {
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
      } else if (parts[0] === "cd" || parts[0] === "about") {
        const pool = parts[0] === "cd" ? sections.map((s) => (s.id === "top" ? "index" : s.label.toLowerCase())) : [...ABOUT_KEYS];
        const match = pool.find((x) => x.startsWith(parts[1]));
        if (match) setValue(`${parts[0]} ${match}`);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const suggestions = ["help", "whoami", "skills", "projects", "about mission", "sudo hire-me"];

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
          description="Every part of this portfolio is also available from a real command line. Try it out."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="panel overflow-hidden shadow-[0_40px_120px_-40px_rgba(198,255,61,0.12)]"
          onClick={() => inputRef.current?.focus({ preventScroll: true })}
        >
          <div className="flex items-center justify-between border-b border-white/[0.07] bg-ink-800/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            </div>
            <span className="font-mono text-[11px] text-fg-subtle">guest@ajb-os: ~</span>
            <span className="font-mono text-[11px] text-fg-faint">zsh</span>
          </div>

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
