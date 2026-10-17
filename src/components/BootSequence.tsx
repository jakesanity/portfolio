import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SYSTEM_VERSION } from "../lib/sections";

const BOOT_LINES = [
  { t: "AJB/OS " + SYSTEM_VERSION + " kernel init", s: "ok" },
  { t: "mounting /identity", s: "ok" },
  { t: "loading stack modules [8]", s: "ok" },
  { t: "indexing /work projects [3]", s: "ok" },
  { t: "starting interactive shell", s: "ok" },
  { t: "network: open to opportunities", s: "live" },
];

const STORAGE_KEY = "ajb-os-booted";

/** Short, skippable boot overlay. Plays once per browser session. */
export default function BootSequence() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(STORAGE_KEY) !== "1";
  });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!visible) return;
    document.documentElement.style.overflow = "hidden";

    const finish = () => {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setVisible(false);
    };

    const timers: number[] = [];
    BOOT_LINES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setStep(i + 1), 160 + i * 190));
    });
    timers.push(window.setTimeout(finish, 160 + BOOT_LINES.length * 190 + 450));

    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);

    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      document.documentElement.style.overflow = "";
    };
  }, [visible]);

  const pct = Math.round((step / BOOT_LINES.length) * 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-grid opacity-40 mask-radial" />
          <div className="relative w-[min(520px,88vw)] font-mono text-[12px] sm:text-[13px]">
            <div className="mb-6 flex items-center justify-between text-fg-subtle">
              <span className="text-fg">
                AJB<span className="text-accent">/</span>OS
              </span>
              <span>{SYSTEM_VERSION}</span>
            </div>

            <ul className="space-y-1.5">
              {BOOT_LINES.map((line, i) => (
                <li
                  key={line.t}
                  className="flex items-center justify-between gap-6 transition-opacity duration-200"
                  style={{ opacity: i < step ? 1 : 0 }}
                >
                  <span className="text-fg-muted">
                    <span className="text-fg-faint">{String(i).padStart(2, "0")} </span>
                    {line.t}
                  </span>
                  <span className={line.s === "live" ? "text-accent" : "text-fg-subtle"}>
                    [{line.s === "live" ? " LIVE " : "  OK  "}]
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <div className="h-px w-full overflow-hidden bg-white/10">
                <div className="h-full bg-accent transition-[width] duration-200 ease-out" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-3 flex justify-between text-[11px] text-fg-faint">
                <span>press any key to skip</span>
                <span>{pct}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
