import { useEffect, useState } from "react";

export type ThemeId = "lime" | "cyan" | "amber" | "emerald";

export interface ThemeSpec {
  id: ThemeId;
  label: string;
  hex: string;
  rgb: string;
}

export const THEMES: Record<ThemeId, ThemeSpec> = {
  lime: { id: "lime", label: "Acid Lime", hex: "#c6ff3d", rgb: "198 255 61" },
  cyan: { id: "cyan", label: "Cyber Cyan", hex: "#5ee6ff", rgb: "94 230 255" },
  amber: { id: "amber", label: "Amber Phosphor", hex: "#ffb547", rgb: "255 181 71" },
  emerald: { id: "emerald", label: "Matrix Emerald", hex: "#3dff9e", rgb: "61 255 158" },
};

export type CoreMode = "sphere" | "torus" | "helix";

const THEME_STORAGE_KEY = "ajb-os-theme";
const SOUND_STORAGE_KEY = "ajb-os-sound";
const THEME_EVENT = "ajb:theme-change";
const SOUND_EVENT = "ajb:sound-change";

let currentTheme: ThemeId = "lime";
let soundEnabled = true;
let audioCtx: AudioContext | null = null;

function applyThemeToDom(id: ThemeId) {
  const spec = THEMES[id] ?? THEMES.lime;
  const root = document.documentElement;
  root.style.setProperty("--accent", spec.hex);
  root.style.setProperty("--accent-rgb", spec.rgb.replace(/\s+/g, ", "));
  root.style.setProperty("--accent-tw", spec.rgb);
}

if (typeof window !== "undefined") {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
  if (savedTheme && savedTheme in THEMES) {
    currentTheme = savedTheme;
  }
  applyThemeToDom(currentTheme);

  const savedSound = localStorage.getItem(SOUND_STORAGE_KEY);
  if (savedSound !== null) {
    soundEnabled = savedSound === "1";
  }
}

export function getTheme(): ThemeId {
  return currentTheme;
}

export function setTheme(id: ThemeId) {
  if (!(id in THEMES)) return;
  currentTheme = id;
  if (typeof window !== "undefined") {
    localStorage.setItem(THEME_STORAGE_KEY, id);
    applyThemeToDom(id);
    window.dispatchEvent(new CustomEvent<ThemeId>(THEME_EVENT, { detail: id }));
    sfx.confirm();
    emitToast("SYS // THEME", `Signal calibrated to ${THEMES[id].label}`);
  }
}

export function cycleTheme(): ThemeId {
  const order: ThemeId[] = ["lime", "cyan", "amber", "emerald"];
  const next = order[(order.indexOf(currentTheme) + 1) % order.length];
  setTheme(next);
  return next;
}

export function useSystemTheme() {
  const [theme, setThemeState] = useState<ThemeId>(currentTheme);

  useEffect(() => {
    const onUpdate = (e: Event) => setThemeState((e as CustomEvent<ThemeId>).detail);
    window.addEventListener(THEME_EVENT, onUpdate);
    return () => window.removeEventListener(THEME_EVENT, onUpdate);
  }, []);

  return {
    theme,
    spec: THEMES[theme],
    setTheme,
    cycleTheme,
    themes: Object.values(THEMES),
  };
}

export function getSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(val: boolean) {
  soundEnabled = val;
  if (typeof window !== "undefined") {
    localStorage.setItem(SOUND_STORAGE_KEY, val ? "1" : "0");
    window.dispatchEvent(new CustomEvent<boolean>(SOUND_EVENT, { detail: val }));
    if (val) sfx.confirm();
  }
}

export function useSystemSound() {
  const [enabled, setEnabled] = useState<boolean>(soundEnabled);

  useEffect(() => {
    const onUpdate = (e: Event) => setEnabled((e as CustomEvent<boolean>).detail);
    window.addEventListener(SOUND_EVENT, onUpdate);
    return () => window.removeEventListener(SOUND_EVENT, onUpdate);
  }, []);

  return {
    soundEnabled: enabled,
    toggleSound: () => setSoundEnabled(!enabled),
    setSoundEnabled,
  };
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/** Synthesized tactile sci-fi UI audio using Web Audio API (zero external assets). */
export const sfx = {
  tick() {
    if (!soundEnabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.025);
      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.028);
    } catch {
      /* ignore audio errors */
    }
  },
  click() {
    if (!soundEnabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.045);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.048);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      /* ignore audio errors */
    }
  },
  confirm() {
    if (!soundEnabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [587.33, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.055);
        gain.gain.setValueAtTime(0.035, now + i * 0.055);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.055 + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.055);
        osc.stop(now + i * 0.055 + 0.095);
      });
    } catch {
      /* ignore audio errors */
    }
  },
  pulse() {
    if (!soundEnabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.18);
      gain.gain.setValueAtTime(0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    } catch {
      /* ignore audio errors */
    }
  },
};

/* ------------------------------------------------------------------ */
/*  Explorer Milestones & Telemetry Toast Bus                          */
/* ------------------------------------------------------------------ */

export type MilestoneId = "boot" | "matcher" | "xray" | "blueprint" | "shell";

export interface MilestoneSpec {
  id: MilestoneId;
  title: string;
  desc: string;
  section: "top" | "about" | "stack" | "work" | "shell";
}

export const MILESTONES: MilestoneSpec[] = [
  { id: "boot", title: "Kernel Online", desc: "Initialized AJB/OS environment", section: "top" },
  { id: "matcher", title: "Role Fit Scanned", desc: "Tested the Recruiter Role Match Analyzer", section: "about" },
  { id: "xray", title: "X-Ray Vision", desc: "Inspected the Wireframe-to-Production UI Slider", section: "stack" },
  { id: "blueprint", title: "Systems Architect", desc: "Interacted with a live project blueprint", section: "work" },
  { id: "shell", title: "Root Operator", desc: "Ran a shell command, WPM benchmark, or Matrix mode", section: "shell" },
];

export interface SystemToast {
  id: number;
  tag: string;
  message: string;
}

const MILESTONE_STORAGE_KEY = "ajb-os-milestones";
const MILESTONE_EVENT = "ajb:milestone-update";
const TOAST_EVENT = "ajb:toast";

let toastSeq = 0;
let unlockedSet = new Set<MilestoneId>(["boot"]);

if (typeof window !== "undefined") {
  try {
    const raw = sessionStorage.getItem(MILESTONE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MilestoneId[];
      if (Array.isArray(parsed)) unlockedSet = new Set(["boot", ...parsed]);
    }
  } catch {
    /* ignore */
  }
}

export function emitToast(tag: string, message: string) {
  if (typeof window === "undefined") return;
  const toast: SystemToast = { id: ++toastSeq, tag, message };
  window.dispatchEvent(new CustomEvent<SystemToast>(TOAST_EVENT, { detail: toast }));
}

export function unlockMilestone(id: MilestoneId) {
  if (unlockedSet.has(id)) return;
  unlockedSet.add(id);
  if (typeof window !== "undefined") {
    sessionStorage.setItem(MILESTONE_STORAGE_KEY, JSON.stringify([...unlockedSet]));
    window.dispatchEvent(new CustomEvent<MilestoneId[]>(MILESTONE_EVENT, { detail: [...unlockedSet] }));
    const spec = MILESTONES.find((m) => m.id === id);
    if (spec) {
      emitToast(`UNLOCKED [${unlockedSet.size}/${MILESTONES.length}]`, `${spec.title} — ${spec.desc}`);
    }
  }
}

export function useExplorerHud() {
  const [unlocked, setUnlocked] = useState<MilestoneId[]>(() => [...unlockedSet]);
  const [toast, setToast] = useState<SystemToast | null>(null);

  useEffect(() => {
    const onMilestone = (e: Event) => setUnlocked((e as CustomEvent<MilestoneId[]>).detail);
    const onToast = (e: Event) => {
      const next = (e as CustomEvent<SystemToast>).detail;
      setToast(next);
    };
    window.addEventListener(MILESTONE_EVENT, onMilestone);
    window.addEventListener(TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener(MILESTONE_EVENT, onMilestone);
      window.removeEventListener(TOAST_EVENT, onToast);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3400);
    return () => window.clearTimeout(t);
  }, [toast]);

  return {
    unlocked,
    milestones: MILESTONES,
    toast,
    dismissToast: () => setToast(null),
  };
}

