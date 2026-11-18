import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Circle, Compass, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { scrollToSection } from "../lib/sections";
import { sfx, useExplorerHud } from "../lib/system";

/**
 * Floating bottom-right OS Telemetry Toast & Interactive Feature Checklist.
 * Guides visitors to discover the portfolio's interactive features.
 */
export default function ExplorerHud() {
  const { unlocked, milestones, toast, dismissToast } = useExplorerHud();
  const [open, setOpen] = useState(false);

  const count = unlocked.length;
  const total = milestones.length;
  const allComplete = count === total;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      {/* Live System Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            onClick={dismissToast}
            className="pointer-events-auto flex max-w-xs cursor-pointer items-start gap-3 rounded-xl border border-accent/40 bg-ink-900/95 px-4 py-3 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          >
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <div className="min-w-0 flex-1 font-mono">
              <p className="text-[10px] uppercase tracking-wider text-accent">{toast.tag}</p>
              <p className="mt-0.5 text-xs text-fg">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popover Checklist */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto w-[min(320px,90vw)] overflow-hidden rounded-xl border border-white/10 bg-ink-900/95 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
              <div className="font-mono">
                <p className="text-[11px] font-medium text-fg">AJB/OS // INTERACTIVE GUIDE</p>
                <p className="text-[10px] text-fg-subtle">
                  {allComplete ? "All system modules explored!" : "Click any module to jump to it"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  sfx.tick();
                  setOpen(false);
                }}
                className="grid h-6 w-6 place-items-center rounded border border-white/10 text-fg-subtle hover:text-fg"
                aria-label="Close explorer guide"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <ul className="divide-y divide-white/[0.05] p-2">
              {milestones.map((m) => {
                const done = unlocked.includes(m.id);
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => {
                        sfx.click();
                        setOpen(false);
                        scrollToSection(m.section);
                      }}
                      className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/[0.04]"
                    >
                      {done ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      ) : (
                        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-fg-faint" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-medium ${done ? "text-fg" : "text-fg-muted"}`}>{m.title}</p>
                        <p className="mt-0.5 text-[11px] text-fg-subtle">{m.desc}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Pill */}
      <button
        type="button"
        onClick={() => {
          sfx.tick();
          setOpen((v) => !v);
        }}
        className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/10 bg-ink-900/90 px-3.5 py-2 font-mono text-[11px] text-fg-muted shadow-lg backdrop-blur-xl transition-colors hover:border-accent/40 hover:text-fg"
      >
        <Compass className="h-3.5 w-3.5 text-accent" />
        <span>EXPLORED</span>
        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
          {count}/{total}
        </span>
      </button>
    </div>
  );
}
