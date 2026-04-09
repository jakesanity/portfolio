import { useState } from "react";
import { Mail, Linkedin, Github, MapPin, Send, CheckCircle } from "lucide-react";
import { personalInfo } from "../data/portfolio";

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
      {text}
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionLabel text="Contact" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Let's Connect
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
            Have a project in mind or want to collaborate? I'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-bold text-2xl mb-3">Get In Touch</h3>
              <p className="text-slate-400 leading-relaxed">
                I'm currently open to internship opportunities, freelance projects, and collaborative work. Whether you have a question or just want to say hi — my inbox is always open!
              </p>
            </div>

            <div className="space-y-4">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-4 p-4 bg-slate-900 border border-white/5 rounded-2xl hover:border-blue-500/20 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-0.5">Email</p>
                  <p className="text-white font-medium">{personalInfo.email}</p>
                </div>
              </a>

              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-slate-900 border border-white/5 rounded-2xl hover:border-blue-500/20 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                  <Linkedin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-0.5">LinkedIn</p>
                  <p className="text-white font-medium">linkedin.com/in/aldwinjamesbucio</p>
                </div>
              </a>

              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-slate-900 border border-white/5 rounded-2xl hover:border-blue-500/20 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center group-hover:bg-slate-700 transition-colors flex-shrink-0">
                  <Github className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-0.5">GitHub</p>
                  <p className="text-white font-medium">https://github.com/jakesanity</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 bg-slate-900 border border-white/5 rounded-2xl">
                <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-0.5">Location</p>
                  <p className="text-white font-medium">{personalInfo.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 lg:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-white font-bold text-xl mb-2">Message Sent!</h4>
                <p className="text-slate-400">
                  Thanks for reaching out. I'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-6 px-6 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-sm font-semibold rounded-xl transition-colors"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">Name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">Subject</label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="What's this about?"
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell me about your project or inquiry..."
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-500 hover:bg-blue-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
