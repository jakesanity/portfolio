import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Github, Linkedin, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { personalInfo } from "../data/portfolio";
import { submitContactApi } from "../lib/api";
import { sections } from "../lib/sections";
import { sfx } from "../lib/system";
import SectionHeader from "./ui/SectionHeader";

const meta = sections.find((s) => s.id === "contact")!;

const EMPTY = { name: "", email: "", subject: "", message: "" };

const QUICK_TOPICS = [
  "Internship Opportunity",
  "Freelance UI/UX or Web Project",
  "System Walkthrough Request",
  "Collaboration Inquiry",
];

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [deliveredViaApi, setDeliveredViaApi] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const formattedBody = `${form.message}\n\n-- \n${form.name}\n${form.email}`;
  const mailtoUrl = `mailto:${personalInfo.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(formattedBody)}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(personalInfo.email)}&su=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(formattedBody)}`;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    sfx.click();
    const res = await submitContactApi(form);
    setSubmitting(false);
    setDeliveredViaApi(res.delivered);
    setSent(true);
    sfx.confirm();
    if (!res.delivered) {
      window.location.href = mailtoUrl;
    }
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

  const copyFullMessage = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${personalInfo.email}\nSubject: ${form.subject}\n\n${formattedBody}`);
      setCopiedMsg(true);
      window.setTimeout(() => setCopiedMsg(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const channels = [
    {
      id: "phone",
      label: "Phone / SMS",
      value: personalInfo.phone,
      href: `tel:${personalInfo.phone.replace(/\s+/g, "")}`,
      Icon: Phone,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: personalInfo.linkedin.replace("https://", ""),
      href: personalInfo.linkedin,
      Icon: Linkedin,
    },
    {
      id: "github",
      label: "GitHub",
      value: personalInfo.github.replace("https://", ""),
      href: personalInfo.github,
      Icon: Github,
    },
    {
      id: "location",
      label: "Location",
      value: `${personalInfo.location} / GMT+8`,
      href: undefined,
      Icon: MapPin,
    },
  ];

  const fields: { name: keyof typeof EMPTY; label: string; type?: string; placeholder: string; full?: boolean }[] = [
    { name: "name", label: "Name", placeholder: "Your full name" },
    { name: "email", label: "Email", type: "email", placeholder: "you@company.com" },
    { name: "subject", label: "Subject", placeholder: "Internship, project, collaboration...", full: true },
  ];

  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/[0.05] py-28 lg:py-36">
      <div className="absolute bottom-[-30%] left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(var(--accent-rgb),0.07),transparent)]" />
      <div className="shell">
        <SectionHeader
          meta={meta}
          title={
            <>
              Let's build
              <span className="text-fg-subtle"> something.</span>
            </>
          }
          description="Open to IT internships, freelance projects, and engineering collaborations. Messages are typically answered within 24 hours."
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
                <Mail className="h-4 w-4 text-accent" />
              </div>
              <a
                id="contact-email"
                href={`mailto:${personalInfo.email}`}
                className="block break-all text-lg font-medium tracking-tight text-fg transition-colors hover:text-accent sm:text-xl"
              >
                {personalInfo.email}
              </a>
              <p className="mt-2 font-mono text-[11px] text-fg-subtle">
                University & direct professional inbox · verified active
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <button id="contact-copy-email" onClick={copyEmail} className="btn-ghost h-10 px-3.5 text-[13px]">
                  {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy address"}
                </button>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(personalInfo.email)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost h-10 px-3.5 text-[13px]"
                >
                  Open in Gmail <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <ul className="panel divide-y divide-white/[0.06] overflow-hidden">
              {channels.map(({ id, label, value, href, Icon }) => {
                const isExternal = href?.startsWith("http");
                const inner = (
                  <>
                    <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-ink-900 text-fg-muted transition-colors group-hover:border-accent/40 group-hover:text-accent">
                      <Icon className="h-4 w-4" strokeWidth={1.7} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="label">{label}</p>
                      <p className="mt-1 truncate text-sm text-fg">{value}</p>
                    </div>
                    {href && (
                      <ArrowUpRight className="h-4 w-4 text-fg-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                    )}
                  </>
                );
                return (
                  <li key={id}>
                    {href ? (
                      <a
                        id={`contact-${id}`}
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02]"
                      >
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
                <span className="text-accent">$</span> compose --to {personalInfo.email}
              </p>
              <span className="font-mono text-[11px] text-fg-faint">direct dispatch</span>
            </div>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[480px] flex-col items-center justify-center px-6 py-14 text-center"
                >
                  <span className="mb-6 grid h-14 w-14 place-items-center rounded-xl border border-accent/40 bg-accent/10 text-accent">
                    <Check className="h-6 w-6" />
                  </span>
                  <h3 className="text-2xl font-semibold tracking-tight text-fg">
                    {deliveredViaApi ? "Message delivered directly" : "Message prepared for dispatch"}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-fg-muted">
                    {deliveredViaApi
                      ? "Your inquiry has been dispatched via REST API directly to Aldwin's inbox. Expect a reply within 24 hours."
                      : "Your default mail client was triggered. Using webmail on desktop? Send directly via Gmail in one click or copy your formatted message below:"}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={gmailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary h-10 px-4 text-xs"
                    >
                      Send via Gmail Web <ArrowUpRight className="h-4 w-4" />
                    </a>
                    <a href={mailtoUrl} className="btn-ghost h-10 px-4 text-xs">
                      Open Mail App <Mail className="h-4 w-4" />
                    </a>
                    <button type="button" onClick={copyFullMessage} className="btn-ghost h-10 px-4 text-xs">
                      {copiedMsg ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                      {copiedMsg ? "Copied Message" : "Copy Message"}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSent(false);
                      setForm(EMPTY);
                    }}
                    className="mt-8 font-mono text-xs text-fg-subtle underline-offset-4 hover:text-accent hover:underline"
                  >
                    &larr; Compose another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={onSubmit}
                  className="space-y-5 p-6 sm:p-8"
                >
                  {/* Quick topic selector */}
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
                      Quick Select Topic
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_TOPICS.map((topic) => {
                        const activeTopic = form.subject === topic;
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, subject: topic }))}
                            className={`chip transition-colors ${
                              activeTopic
                                ? "border-accent/50 bg-accent/10 text-accent"
                                : "hover:border-white/20 hover:text-fg"
                            }`}
                          >
                            {topic}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {fields.map((f, i) => (
                      <div key={f.name} className={f.full ? "sm:col-span-2" : ""}>
                        <label
                          htmlFor={`contact-${f.name}`}
                          className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle"
                        >
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
                    <label
                      htmlFor="contact-message"
                      className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle"
                    >
                      <span className="text-fg-faint">04</span>
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={form.message}
                      onChange={onChange}
                      rows={5}
                      required
                      placeholder="Tell me about the internship role, project scope, or collaboration idea..."
                      className="field resize-none"
                    />
                  </div>
                  <div className="flex flex-col-reverse items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                    <p className="font-mono text-[11px] text-fg-faint">
                      {form.message.length} chars · supports default mail &amp; Gmail Web
                    </p>
                    <button
                      id="contact-submit"
                      type="submit"
                      disabled={submitting}
                      className="btn-primary group w-full sm:w-auto"
                    >
                      {submitting ? (
                        <>
                          Dispatching...
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          Prepare &amp; Send
                          <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
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
