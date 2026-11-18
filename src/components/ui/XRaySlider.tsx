import { CheckCircle2, Code2, Eye, Layers, MoveHorizontal, ShieldCheck } from "lucide-react";
import { useRef, useState, type PointerEvent } from "react";
import { sfx, unlockMilestone } from "../../lib/system";

/**
 * Interactive Wireframe-to-Production UI X-Ray Comparison Slider.
 * Peels back the polished production UI to reveal Figma wireframe specs, spacing tokens, and JSX props.
 */
export default function XRaySlider() {
  const [split, setSplit] = useState(48); // percentage 0..100
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplit(Math.max(4, Math.min(96, Math.round(pct))));
    unlockMilestone("xray");
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
    sfx.tick();
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };

  const onPointerUp = () => {
    setDragging(false);
  };

  return (
    <div className="panel mt-14 overflow-hidden">
      {/* Header Chrome */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] bg-ink-900/60 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="grid h-7 w-7 place-items-center rounded-md border border-accent/40 bg-accent/10 text-accent">
            <Layers className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="font-mono text-[11px] font-medium text-fg">
              DESIGN-TO-CODE X-RAY // WIREFRAME vs. PRODUCTION
            </p>
            <p className="font-mono text-[10px] text-fg-subtle">
              drag the scanner divider to inspect Figma tokens, 8px grid &amp; React props
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          {[
            { label: "Wireframe", val: 92 },
            { label: "50/50 X-Ray", val: 50 },
            { label: "Production", val: 8 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                sfx.tick();
                setSplit(preset.val);
                unlockMilestone("xray");
              }}
              className={`rounded-md border px-2.5 py-1 transition-colors ${
                Math.abs(split - preset.val) <= 8
                  ? "border-accent/40 bg-accent/15 text-accent"
                  : "border-white/10 bg-ink-850 text-fg-subtle hover:text-fg"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Split Viewport */}
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="slider"
        aria-label="Wireframe to Production UI X-Ray Slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={split}
        className="relative min-h-[300px] cursor-ew-resize select-none overflow-hidden bg-ink-950"
      >
        {/* LAYER 1: PRODUCTION UI (Base Layer) */}
        <div className="flex h-full min-h-[300px] flex-col justify-between bg-ink-900 p-6 sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(var(--accent-rgb),0.09),transparent_55%)]" />

          <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-accent">
                <span className="status-dot" /> Production Build · React + Tailwind
              </div>
              <h4 className="mt-3 text-2xl font-semibold tracking-tight text-fg">
                Ethics Protocol Clearance #UIC-084
              </h4>
              <p className="mt-1 text-sm text-fg-muted">
                Automated multi-reviewer governance card with real-time RBAC signature verification.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-ink-850 px-4 py-2.5 text-right font-mono">
              <p className="text-[10px] uppercase text-fg-subtle">SLA Turnaround</p>
              <p className="mt-0.5 text-lg font-semibold text-accent">4.2 Days</p>
            </div>
          </div>

          <div className="relative z-10 my-6 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Document Hash", val: "Verified SHA-256", sub: "3 attachments" },
              { label: "Committee Quorum", val: "3 / 3 Signed", sub: "Unanimous approval" },
              { label: "Clearance Status", val: "Ready to Issue", sub: "Auto-PDF enabled" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-white/[0.08] bg-ink-850/90 p-3.5">
                <p className="font-mono text-[10px] uppercase text-fg-subtle">{item.label}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-fg">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  {item.val}
                </p>
                <p className="mt-1 font-mono text-[10px] text-fg-faint">{item.sub}</p>
              </div>
            ))}
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] pt-4">
            <div className="flex items-center gap-2 font-mono text-xs text-fg-muted">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Designed in Figma · Engineered in TypeScript</span>
            </div>
            <span className="inline-flex h-9 items-center gap-2 rounded-lg bg-accent px-4 font-mono text-xs font-semibold text-accent-ink">
              Issue Clearance Certificate
            </span>
          </div>
        </div>

        {/* LAYER 2: FIGMA WIREFRAME & SPEC X-RAY (Clipped Overlay) */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-[#080b10] p-6 font-mono sm:p-8"
          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
        >
          <div className="absolute inset-0 bg-grid opacity-80" />

          <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
            <div className="rounded border border-dashed border-signal-cyan/50 bg-signal-cyan/[0.04] p-2.5">
              <div className="flex items-center gap-2 text-[10px] text-signal-cyan">
                <span>&lt;Badge variant="status" /&gt;</span>
                <span className="text-fg-faint">· h:24px · radius:999px</span>
              </div>
              <div className="mt-2 border border-dashed border-white/25 px-2.5 py-1.5 text-base text-fg-muted">
                [H4] font-semibold tracking-tight · 24px / 32px
              </div>
              <p className="mt-1.5 text-[11px] text-fg-subtle">
                // Figma Auto-Layout: direction=column, gap=8px, padding=24px
              </p>
            </div>

            <div className="rounded border border-dashed border-signal-amber/60 bg-signal-amber/[0.05] px-3.5 py-2 text-right">
              <p className="text-[10px] text-signal-amber">&lt;MetricBox /&gt;</p>
              <p className="mt-1 text-xs text-fg-muted">w: 132px · p: 16px</p>
            </div>
          </div>

          <div className="relative z-10 my-5 grid gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded border border-dashed border-signal-cyan/40 bg-ink-950/90 p-3 text-[11px]"
              >
                <div className="flex justify-between text-signal-cyan">
                  <span>&lt;TelemetryNode index={i} /&gt;</span>
                  <span>col-span-1</span>
                </div>
                <div className="mt-2 h-3 w-3/4 rounded-sm border border-white/20 bg-white/[0.04]" />
                <div className="mt-2 flex justify-between text-[10px] text-fg-faint">
                  <span>gap: 12px</span>
                  <span>border: 1px rgba(255,255,255,0.08)</span>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-white/20 pt-4 text-[11px]">
            <span className="flex items-center gap-2 text-signal-cyan">
              <Code2 className="h-3.5 w-3.5" />
              props: &#123; protocolId: "UIC-084", quorum: 3, verified: true &#125;
            </span>
            <span className="rounded border border-dashed border-accent/60 bg-accent/10 px-3.5 py-1.5 text-accent">
              &lt;Button variant="primary" h="36px" /&gt;
            </span>
          </div>
        </div>

        {/* LASER DIVIDER LINE & HANDLE */}
        <div
          className="pointer-events-none absolute inset-y-0 z-20 w-0.5 bg-accent shadow-[0_0_16px_2px_rgba(var(--accent-rgb),0.8)]"
          style={{ left: `${split}%` }}
        >
          <div className="
            absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center
            rounded-full border border-accent bg-ink-950 text-accent shadow-[0_0_24px_rgba(var(--accent-rgb),0.6)]
          ">
            <MoveHorizontal className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Footer Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.07] bg-ink-900/40 px-5 py-2.5 font-mono text-[10px] text-fg-subtle">
        <span className="flex items-center gap-1.5">
          <Code2 className="h-3 w-3 text-signal-cyan" />
          LEFT: FIGMA WIREFRAME &amp; JSX SPEC ({split}%)
        </span>
        <span className="flex items-center gap-1.5">
          <Eye className="h-3 w-3 text-accent" />
          RIGHT: PRODUCTION UI ({100 - split}%)
        </span>
      </div>
    </div>
  );
}
