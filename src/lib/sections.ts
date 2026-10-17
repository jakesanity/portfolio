export type SectionId = "top" | "about" | "stack" | "work" | "log" | "shell" | "contact";

export interface SectionMeta {
  id: SectionId;
  index: string;
  label: string;
  path: string;
}

/** Ordered list of page modules. Drives the system bar, circuit rail, command palette and terminal. */
export const sections: SectionMeta[] = [
  { id: "top", index: "00", label: "Index", path: "~/" },
  { id: "about", index: "01", label: "Identity", path: "~/identity" },
  { id: "stack", index: "02", label: "Stack", path: "~/stack" },
  { id: "work", index: "03", label: "Work", path: "~/work" },
  { id: "log", index: "04", label: "Log", path: "~/log" },
  { id: "shell", index: "05", label: "Shell", path: "~/shell" },
  { id: "contact", index: "06", label: "Contact", path: "~/contact" },
];

export const SYSTEM_VERSION = "v2026.10";

export function scrollToSection(id: SectionId) {
  if (id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export const FOCUS_TERMINAL_EVENT = "ajb:focus-terminal";

export function focusTerminal() {
  scrollToSection("shell");
  window.setTimeout(() => window.dispatchEvent(new Event(FOCUS_TERMINAL_EVENT)), 450);
}
