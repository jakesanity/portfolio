import { ArrowUp } from "lucide-react";
import { personalInfo } from "../data/portfolio";
import { useClock } from "../lib/hooks";
import { SYSTEM_VERSION, scrollToSection, sections } from "../lib/sections";

export default function Footer() {
  const { time } = useClock();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.07] bg-ink-950">
      <div className="shell">
        {/* Oversized wordmark */}
        <div className="overflow-hidden border-b border-white/[0.06] py-14">
          <p className="select-none whitespace-nowrap text-[clamp(3.5rem,13vw,11rem)] font-semibold leading-none tracking-tightest text-white/[0.04]">
            AJB<span className="text-accent/30">/</span>OS
          </p>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="text-lg font-semibold tracking-tight text-fg">{personalInfo.name}</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-fg-subtle">
              {personalInfo.title}. {personalInfo.subtitle}.
            </p>
            <div className="mt-6 flex items-center gap-2 font-mono text-[11px] text-fg-subtle">
              <span className="status-dot" /> all systems operational
            </div>
          </div>

          <div>
            <p className="label mb-4">Modules</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <button onClick={() => scrollToSection(s.id)} className="text-fg-muted transition-colors hover:text-accent">
                    <span className="mr-2 font-mono text-[10px] text-fg-faint">{s.index}</span>
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label mb-4">Elsewhere</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-fg-muted transition-colors hover:text-accent">GitHub</a></li>
              <li><a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-fg-muted transition-colors hover:text-accent">LinkedIn</a></li>
              <li><a href={`mailto:${personalInfo.email}`} className="text-fg-muted transition-colors hover:text-accent">Email</a></li>
              <li><a href={personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-fg-muted transition-colors hover:text-accent">Curriculum Vitae</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/[0.06] py-6 font-mono text-[11px] text-fg-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {personalInfo.name}. Built with React, Three.js and Tailwind.
          </p>
          <div className="flex items-center gap-6">
            <span>{SYSTEM_VERSION}</span>
            <span>PHT {time}</span>
            <button
              id="footer-back-to-top"
              onClick={() => scrollToSection("top")}
              className="flex items-center gap-1.5 text-fg-subtle transition-colors hover:text-accent"
            >
              top <ArrowUp className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
