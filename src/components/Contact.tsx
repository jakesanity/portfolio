import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Github, Linkedin, Mail, MapPin, Send } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { personalInfo } from "../data/portfolio";
import { sections } from "../lib/sections";
import SectionHeader from "./ui/SectionHeader";

const meta = sections.find((s) => s.id === "contact")!;

const EMPTY = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const body = `${form.message}\n\n-- \n${form.name}\n${form.email}`;
    window.location.href = `mailto:${personalInfo.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const channels = [
    { id: "linkedin", label: "LinkedIn", value: personalInfo.linkedin.replace("https://", ""), href: personalInfo.linkedin, Icon: Linkedin },
    { id: "github", label: "GitHub", value: personalInfo.github.replace("https://", ""), href: personalInfo.github, Icon: Github },
    { id: "location", label: "Location", value: `${personalInfo.location} / GMT+8`, href: undefined, Icon: MapPin },
  ];

  const fields: { name: keyof typeof EMPTY; label: string; type?: string; placeholder: string; full?: boolean }[] = [
    { name: "name", label: "Name", placeholder: "Your full name" },
    { name: "email", label: "Email", type: "email", placeholder: "you@company.com" },
    { name: "subject", label: "Subject", placeholder: "Internship, project, collaboration...", full: true },
  ];

  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/[0.05] py-28 lg:py-36">
      <div className="absolute bottom-[-30%] left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(198,255,61,0.07),transparent)]" />
      <div className="shell">
        <SectionHeader
          meta={meta}
          title={
            <>
              Let's build
              <span className="text-fg-subtle"> something.</span>
            </>
          }
          description="Open to internships, freelance projects and collaborations. Messages are usually answered within a day."
        />

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Channels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6 lg:col-span-5"
          >
            <div className="panel p-6 sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <p className="label">Primary channel</p>
                <Mail className="h-4 w-4 text-fg-subtle" />
              </div>
              <a
                id="contact-email"
                href={`mailto:${personalInfo.email}`}
                className="block break-all text-xl font-medium tracking-tight text-fg transition-colors hover:text-accent sm:text-2xl"
              >
                {personalInfo.email}
              </a>
              <div className="mt-6 flex flex-wrap gap-3">
                <button id="contact-copy-email" onClick={copyEmail} className="btn-ghost h-10 text-[13px]">
                  {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy address"}
                </button>
                <a href={`mailto:${personalInfo.email}`} className="btn-ghost h-10 text-[13px]">
                  Open mail app <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <ul className="panel divide-y divide-white/[0.06] overflow-hidden">
              {channels.map(({ id, label, value, href, Icon }) => {
                const inner = (
                  <>
                    <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-ink-900 text-fg-muted transition-colors group-hover:border-accent/40 group-hover:text-accent">
                      <Icon className="h-4 w-4" strokeWidth={1.7} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="label">{label}</p>
                      <p className="mt-1 truncate text-sm text-fg">{value}</p>
                    </div>
                    {href && <ArrowUpRight className="h-4 w-4 text-fg-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />}
                  </>
                );
                return (
                  <li key={id}>
                    {href ? (
                      <a id={`contact-${id}`} href={href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02]">
                        {inner}
                      </a>
                    ) : (
                      <div className="group flex items-center gap-4 px-6 py-4">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Compose */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="panel overflow-hidden lg:col-span-7"
          >
            <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-3.5">
              <p className="font-mono text-[11px] text-fg-subtle">
                <span className="text-accent">$</span> compose --to aldwin
              </p>
              <span className="font-mono text-[11px] text-fg-faint">new message</span>
            </div>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[460px] flex-col items-center justify-center px-6 py-16 text-center"
                >
                  <span className="mb-6 grid h-14 w-14 place-items-center rounded-xl border border-accent/40 bg-accent/10 text-accent">
                    <Check className="h-6 w-6" />
                  </span>
                  <h3 className="text-2xl font-semibold tracking-tight text-fg">Message ready to send</h3>
                  <p className="mt-3 max-w-sm text-fg-muted">
                    Your email client has opened with the message pre-filled. Hit send there and I will get back to you soon.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setForm(EMPTY);
                    }}
                    className="btn-ghost mt-8 h-10 text-[13px]"
                  >
                    Compose another
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={onSubmit} className="space-y-5 p-6 sm:p-8">
                  <div className="grid gap-5 sm:grid-cols-2">
                    {fields.map((f, i) => (
                      <div key={f.name} className={f.full ? "sm:col-span-2" : ""}>
                        <label htmlFor={`contact-${f.name}`} className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">
                          <span className="text-fg-faint">{String(i + 1).padStart(2, "0")}</span>
                          {f.label}
                        </label>
                        <input
                          id={`contact-${f.name}`}
                          name={f.name}
                          type={f.type ?? "text"}
                          value={form[f.name]}
                          onChange={onChange}
                          placeholder={f.placeholder}
                          required
                          className="field"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">
                      <span className="text-fg-faint">04</span>
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={form.message}
                      onChange={onChange}
                      rows={6}
                      required
                      placeholder="Tell me about the role, project or idea..."
                      className="field resize-none"
                    />
                  </div>
                  <div className="flex flex-col-reverse items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                    <p className="font-mono text-[11px] text-fg-faint">{form.message.length} chars / opens your mail client</p>
                    <button id="contact-submit" type="submit" className="btn-primary group w-full sm:w-auto">
                      Send message
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
