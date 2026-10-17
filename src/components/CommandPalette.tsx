import { Command } from "cmdk";
import {
  ArrowRight,
  Copy,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  TerminalSquare,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { personalInfo, projectsData } from "../data/portfolio";
import { focusTerminal, scrollToSection, sections } from "../lib/sections";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function Item({
  onSelect,
  icon,
  children,
  hint,
  value,
}: {
  onSelect: () => void;
  icon: ReactNode;
  children: ReactNode;
  hint?: string;
  value: string;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-fg-muted outline-none transition-colors"
    >
      <span className="grid h-7 w-7 place-items-center rounded-md border border-white/[0.08] bg-ink-800 text-fg-subtle">
        {icon}
      </span>
      <span className="flex-1 truncate">{children}</span>
      {hint && <span className="font-mono text-[10px] text-fg-faint">{hint}</span>}
      <ArrowRight className="cmdk-arrow h-3.5 w-3.5 -translate-x-1 text-accent opacity-0 transition-all" />
    </Command.Item>
  );
}

/** Global command palette (Ctrl/Cmd + K). */
export default function CommandPalette({ open, onOpenChange }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const run = (fn: () => void) => {
    onOpenChange(false);
    window.setTimeout(fn, 60);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${personalInfo.email}`;
    }
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command palette"
      overlayClassName="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
      contentClassName="fixed left-1/2 top-[14vh] z-[91] w-[min(620px,92vw)] -translate-x-1/2 overflow-hidden rounded-xl border border-white/10 bg-ink-850/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-4">
        <span className="font-mono text-sm text-accent">&gt;</span>
        <Command.Input
          autoFocus
          placeholder="Type a command or search..."
          className="h-14 w-full bg-transparent text-[15px] text-fg placeholder:text-fg-faint focus:outline-none"
        />
        <span className="kbd">ESC</span>
      </div>

      <Command.List className="max-h-[min(440px,60vh)] overflow-y-auto p-2">
        <Command.Empty className="px-3 py-10 text-center font-mono text-xs text-fg-subtle">
          command not found
        </Command.Empty>

        <Command.Group heading="Navigate">
          {sections.map((s) => (
            <Item
              key={s.id}
              value={`go ${s.label} ${s.path}`}
              onSelect={() => run(() => scrollToSection(s.id))}
              icon={<span className="font-mono text-[10px]">{s.index}</span>}
              hint={s.path}
            >
              Go to {s.label}
            </Item>
          ))}
        </Command.Group>

        <Command.Group heading="Actions">
          <Item value="open terminal shell" onSelect={() => run(focusTerminal)} icon={<TerminalSquare className="h-3.5 w-3.5" />} hint="shell">
            Open interactive terminal
          </Item>
          <Item value="copy email address" onSelect={copyEmail} icon={<Copy className="h-3.5 w-3.5" />} hint={copied ? "copied" : undefined}>
            {copied ? "Email copied to clipboard" : "Copy email address"}
          </Item>
          <Item
            value="download cv resume"
            onSelect={() => run(() => window.open(personalInfo.resumeUrl, "_blank"))}
            icon={<Download className="h-3.5 w-3.5" />}
            hint="pdf"
          >
            Download CV
          </Item>
          <Item
            value="send email message"
            onSelect={() => run(() => (window.location.href = `mailto:${personalInfo.email}`))}
            icon={<Mail className="h-3.5 w-3.5" />}
          >
            Send an email
          </Item>
        </Command.Group>

        <Command.Group heading="Projects">
          {projectsData.map((p) => (
            <Item
              key={p.title}
              value={`project ${p.title} ${p.category}`}
              onSelect={() => run(() => scrollToSection("work"))}
              icon={<ExternalLink className="h-3.5 w-3.5" />}
              hint={p.category}
            >
              {p.title}
            </Item>
          ))}
        </Command.Group>

        <Command.Group heading="Links">
          <Item value="github" onSelect={() => run(() => window.open(personalInfo.github, "_blank"))} icon={<Github className="h-3.5 w-3.5" />} hint="external">
            GitHub
          </Item>
          <Item value="linkedin" onSelect={() => run(() => window.open(personalInfo.linkedin, "_blank"))} icon={<Linkedin className="h-3.5 w-3.5" />} hint="external">
            LinkedIn
          </Item>
        </Command.Group>
      </Command.List>

      <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-2.5 font-mono text-[10px] text-fg-faint">
        <span>AJB/OS command palette</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="kbd">Up</span><span className="kbd">Dn</span> navigate</span>
          <span className="flex items-center gap-1"><span className="kbd">Enter</span> run</span>
        </span>
      </div>
    </Command.Dialog>
  );
}
