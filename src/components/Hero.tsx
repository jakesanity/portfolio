import { Download, Mail, Linkedin, Github, ChevronDown } from "lucide-react";
import { personalInfo } from "../data/portfolio";

export default function Hero() {
  const scrollToAbout = () => {
    const el = document.querySelector("#about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 pt-20 pb-12">
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Available for opportunities
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-4">
              Hi, I'm{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Aldwin James
              </span>
            </h1>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-slate-400 mb-4">
              {personalInfo.title}
            </h2>

            <p className="text-slate-500 text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Passionate about building meaningful digital experiences through
              clean code, thoughtful design, and continuous learning.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <a
                href={personalInfo.resumeUrl}
                download
                className="flex items-center gap-2 px-7 py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </a>
              <button
                onClick={() => {
                  const el = document.querySelector("#contact");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 px-7 py-3.5 border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
              >
                <Mail className="w-4 h-4" />
                Get In Touch
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4">
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/40 text-slate-400 hover:text-blue-400 transition-all duration-200"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/40 text-slate-400 hover:text-blue-400 transition-all duration-200"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/40 text-slate-400 hover:text-blue-400 transition-all duration-200"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="flex-shrink-0 order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-3xl blur-xl" />
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden ring-1 ring-white/10">
                <img
                  src={personalInfo.photo}
                  alt={personalInfo.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              </div>

              <div className="absolute -bottom-4 -left-4 bg-slate-800 border border-white/10 rounded-2xl px-4 py-3 shadow-xl">
                <p className="text-white font-bold text-lg leading-none">3+</p>
                <p className="text-slate-400 text-xs mt-0.5">Projects Done</p>
              </div>

              <div className="absolute -top-4 -right-4 bg-slate-800 border border-white/10 rounded-2xl px-4 py-3 shadow-xl">
                <p className="text-blue-400 font-bold text-lg leading-none">IT</p>
                <p className="text-slate-400 text-xs mt-0.5">Student</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 hover:text-slate-300 transition-colors animate-bounce"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </section>
  );
}
