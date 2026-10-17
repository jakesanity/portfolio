import { AnimatePresence, motion } from "framer-motion";
import { Command, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useActiveSection, useClock, useIsMac, useScrollProgress } from "../lib/hooks";
import { SYSTEM_VERSION, scrollToSection, sections } from "../lib/sections";

interface Props {
  onOpenPalette: () => void;
}

/** Top system bar: brand, module tabs, clock and command palette trigger. */
export default function Navbar({ onOpenPalette }: Props) {
  const active = useActiveSection();
  const progress = useScrollProgress();
  const { time } = useClock();
  const isMac = useIsMac();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = sections.filter((s) => s.id !== "top");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-white/[0.07] bg-ink-900/75 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-5 sm:px-8">
        <button
          id="nav-home"
          onClick={() => scrollToSection("top")}
          className="group flex items-center gap-3"
          aria-label="Back to top"
        >
          <span className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-ink-800 font-mono text-[12px] font-semibold text-fg transition-colors group-hover:border-accent/50">
            A<span className="text-accent">/</span>
          </span>
          <span className="hidden flex-col items-start leading-none sm:flex">
            <span className="text-sm font-semibold tracking-tight text-fg">
              AJB<span className="text-accent">/</span>OS
            </span>
            <span className="mt-1 font-mono text-[10px] text-fg-subtle">{SYSTEM_VERSION}</span>
          </span>
        </button>

        <nav className="mx-auto hidden items-center gap-1 rounded-lg border border-white/[0.06] bg-ink-850/70 p-1 lg:flex">
          {navItems.map((s) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                id={`nav-${s.id}`}
                onClick={() => scrollToSection(s.id)}
                className={`relative rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                  isActive ? "text-fg" : "text-fg-subtle hover:text-fg"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-md bg-white/[0.06] ring-1 ring-white/10"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <span className={`font-mono text-[10px] ${isActive ? "text-accent" : "text-fg-faint"}`}>{s.index}</span>
                  {s.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <div className="hidden items-center gap-2 font-mono text-[11px] text-fg-subtle xl:flex">
            <span className="status-dot" />
            <span>PHT {time}</span>
          </div>

          <button
            id="open-command-palette"
            onClick={onOpenPalette}
            className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-ink-800/80 px-3 text-[13px] text-fg-muted transition-colors hover:border-white/20 hover:text-fg"
          >
            <Command className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Command</span>
            <span className="hidden items-center gap-1 sm:flex">
              <span className="kbd">{isMac ? "\u2318" : "Ctrl"}</span>
              <span className="kbd">K</span>
            </span>
          </button>

          <button
            id="nav-mobile-toggle"
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-fg-muted lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Scroll progress hairline */}
      <div className="absolute inset-x-0 bottom-0 h-px">
        <div className="h-full origin-left bg-accent/70" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/[0.07] bg-ink-900/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="px-5 py-3 sm:px-8">
              {navItems.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      scrollToSection(s.id);
                    }}
                    className="flex w-full items-center justify-between border-b border-white/[0.05] py-3.5 text-left text-sm text-fg-muted last:border-0"
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-accent">{s.index}</span>
                      {s.label}
                    </span>
                    <span className="font-mono text-[11px] text-fg-faint">{s.path}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
