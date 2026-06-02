import {
  Download,
  Mail,
  Linkedin,
  Github,
  ChevronDown,
  Star,
  Code,
  Zap,
  Mouse,
  Rocket,
  Award,
  Briefcase,
} from "lucide-react";
import { personalInfo } from "../data/portfolio";
import { motion } from "framer-motion";

export default function Hero() {
  const scrollToAbout = () => {
    const el = document.querySelector("#about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-950/20 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-10" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6 backdrop-blur-sm"
            >
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <Star className="w-4 h-4 text-yellow-400" />
              Available for opportunities
              <Star className="w-4 h-4 text-yellow-400" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6"
            >
              <span className="text-slate-400">Hello, I'm</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
                Aldwin James
              </span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl sm:text-2xl lg:text-3xl font-medium text-slate-300 mb-4 flex items-center gap-3"
            >
              <Code className="text-blue-400" />
              {personalInfo.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-slate-400 text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              <Zap className="inline w-5 h-5 text-yellow-400 mr-2" />
              Passionate about building meaningful digital experiences through
              clean code, thoughtful design, and continuous learning.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
            >
              <motion.a
                href={personalInfo.resumeUrl}
                download
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/40 w-full sm:w-auto justify-center"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </motion.a>
              <motion.button
                onClick={() => {
                  const el = document.querySelector("#contact");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-7 py-3.5 border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-200 hover:bg-white/5 w-full sm:w-auto justify-center"
              >
                <Mail className="w-4 h-4" />
                Get In Touch
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex items-center justify-center lg:justify-start gap-4"
            >
              <motion.a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/40 text-slate-400 hover:text-blue-400 transition-all duration-200"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/40 text-slate-400 hover:text-blue-400 transition-all duration-200"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                href={`mailto:${personalInfo.email}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/40 text-slate-400 hover:text-blue-400 transition-all duration-200"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-12 flex items-center justify-center lg:justify-start gap-8"
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">3+</span>
                </div>
                <p className="text-slate-400 text-sm">Projects Completed</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  <span className="text-2xl font-bold text-white">1+</span>
                </div>
                <p className="text-slate-400 text-sm">Years Experience</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-shrink-0 flex justify-center lg:justify-end"
          >
            <div className="relative group">
              <div className="absolute -inset-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-3xl blur-xl group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-300 group-hover:scale-105">
                <img
                  src={personalInfo.photo}
                  alt={personalInfo.name}
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-slate-800/80 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                    <p className="text-white font-semibold text-sm">Aspiring Full-Stack Developer</p>
                    <p className="text-slate-400 text-xs mt-1">Tech Enthusiast & Problem Solver</p>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute -top-4 -right-4 bg-slate-800 border border-white/10 rounded-2xl px-4 py-3 shadow-xl backdrop-blur-sm"
              >
                <p className="text-blue-400 font-bold text-lg leading-none flex items-center gap-1">
                  <Rocket className="w-5 h-5" />
                  IT
                </p>
                <p className="text-slate-400 text-xs mt-0.5">Student</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="absolute -bottom-4 -left-4 bg-slate-800 border border-white/10 rounded-2xl px-4 py-3 shadow-xl backdrop-blur-sm"
              >
                <p className="text-white font-bold text-lg leading-none">🌟</p>
                <p className="text-slate-400 text-xs mt-0.5">Based in Philippines</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.button
        onClick={scrollToAbout}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        whileHover={{ y: -5 }}
        whileTap={{ y: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-all"
      >
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-500/20 hover:border-blue-500/40 transition-all">
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
        <span className="text-xs font-medium">Scroll Down</span>
      </motion.button>

      <div className="absolute bottom-4 left-4 text-slate-500 text-xs flex items-center gap-2">
        <Mouse className="w-4 h-4" />
        <span>Explore my work</span>
      </div>
    </section>
  );
}
