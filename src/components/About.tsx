import { useState } from "react";
import {
  GraduationCap,
  Target,
  Rocket,
  BookOpen,
  Trophy,
  Sparkles,
  Download,
  MapPin,
  User,
  Award,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Brain,
  ChevronRight,
  Briefcase
} from "lucide-react";
import { aboutData, personalInfo } from "../data/portfolio";
import { motion, AnimatePresence } from "framer-motion";

function SectionLabel({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm"
    >
      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
      {text}
    </motion.div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 14
    }
  }
};

const certBadges = [
  { name: "Google IT Support Professional", issuer: "Google", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { name: "Responsive Web Design", issuer: "freeCodeCamp", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { name: "JavaScript Algorithms & Data Structures", issuer: "freeCodeCamp", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { name: "Introduction to Cybersecurity", issuer: "Cisco NetAcad", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
];

export default function About() {
  const [activeTab, setActiveTab] = useState<"journey" | "education" | "milestones">("journey");

  return (
    <section id="about" className="py-24 lg:py-32 bg-transparent relative overflow-hidden">
      {/* Background Ambience Radial Glows */}
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <SectionLabel text="Who I Am" />
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
          >
            About My Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-400 mt-4 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed"
          >
            A high-fidelity perspective on my academic pathway, career mission, and project credentials.
          </motion.p>
        </div>

        {/* Core Layout Split */}
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Left Column - Personal Credentials Frame */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl group"
            >
              {/* Inner ambient card glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 group-hover:bg-blue-500/10" />
              
              <div>
                {/* Visual Avatar Placeholder Box */}
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 via-cyan-400 to-emerald-400 p-0.5 shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                      <span className="text-white font-extrabold text-xl tracking-wider">AJB</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-extrabold text-xl tracking-wide group-hover:text-blue-300 transition-colors duration-300">{personalInfo.name}</h3>
                    <p className="text-slate-400 text-xs mt-0.5 font-medium">{personalInfo.title}</p>
                    <div className="flex items-center gap-1 text-slate-500 text-[10px] mt-1 font-semibold uppercase tracking-wider">
                      <MapPin className="w-3 h-3 text-red-400/85" />
                      <span>{personalInfo.location}</span>
                    </div>
                  </div>
                </div>

                {/* Subtitle Statement */}
                <p className="text-slate-300 text-sm leading-relaxed mb-8 italic border-l-2 border-blue-500/30 pl-4 py-0.5">
                  "{personalInfo.subtitle}"
                </p>

                {/* Visual Credential Indicators list */}
                <div className="space-y-4 mb-8">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-2">Academic Profile</span>
                  
                  <div className="flex items-center gap-3 p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
                    <div className="p-2 bg-blue-500/5 rounded-lg border border-blue-500/10">
                      <Award className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-xs">
                      <p className="text-white font-bold">Google IT Certified</p>
                      <p className="text-slate-500 mt-0.5">Professional Technical Support credentials</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
                    <div className="p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-xs">
                      <p className="text-white font-bold">Frontend Engineer</p>
                      <p className="text-slate-500 mt-0.5">Responsive developer certified by freeCodeCamp</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
                    <div className="p-2 bg-rose-500/5 rounded-lg border border-rose-500/10">
                      <Brain className="w-4 h-4 text-rose-400" />
                    </div>
                    <div className="text-xs">
                      <p className="text-white font-bold">IT Specialist Strand</p>
                      <p className="text-slate-500 mt-0.5">Specialized strand foundation in Senior High School</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Resume Download Handler */}
              <motion.a
                href={personalInfo.resumeUrl}
                target="_blank"
                rel="noreferrer"
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-blue-600/90 to-cyan-600/90 border border-white/5 text-white rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg hover:from-blue-600 hover:to-cyan-600 group/btn transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 w-1/2 bg-white/5 -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />
                <Download className="w-4 h-4 animate-bounce" />
                <span>View Full Resume / CV</span>
              </motion.a>

            </motion.div>
          </div>

          {/* Right Column - Tabs Switcher Dashboard */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Horizontal Sub-Tab Control */}
            <div className="flex p-1 bg-slate-900/60 border border-slate-850 rounded-2xl shadow-md backdrop-blur-md">
              <button
                onClick={() => setActiveTab("journey")}
                className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === "journey" ? "text-blue-400 bg-slate-800/80 border border-white/5 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                <User className="w-4 h-4" />
                <span>My Story</span>
              </button>
              <button
                onClick={() => setActiveTab("education")}
                className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === "education" ? "text-blue-400 bg-slate-800/80 border border-white/5 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Academic Timeline</span>
              </button>
              <button
                onClick={() => setActiveTab("milestones")}
                className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === "milestones" ? "text-blue-400 bg-slate-800/80 border border-white/5 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Key Milestones</span>
              </button>
            </div>

            {/* Content Display Panels */}
            <div className="min-h-[440px] flex-grow flex flex-col justify-between">
              <AnimatePresence mode="wait">
                
                {/* 1. MY JOURNEY TAB */}
                {activeTab === "journey" && (
                  <motion.div
                    key="journey"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    
                    <motion.div variants={itemVariants} className="bg-slate-900/30 border border-slate-850 p-6 rounded-2xl backdrop-blur-md">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg border border-blue-500/20 flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-blue-400" />
                        </div>
                        <h4 className="text-white font-extrabold text-base tracking-wide">Background Summary</h4>
                      </div>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                        {aboutData.background}
                      </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      
                      <motion.div variants={itemVariants} className="bg-slate-900/30 border border-slate-850 p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2.5 mb-3.5">
                            <div className="w-7 h-7 bg-cyan-500/10 rounded-lg border border-cyan-500/20 flex items-center justify-center">
                              <Target className="w-4 h-4 text-cyan-400" />
                            </div>
                            <h5 className="text-white font-extrabold text-sm tracking-wide">Mission</h5>
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed font-medium">
                            {aboutData.mission}
                          </p>
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants} className="bg-slate-900/30 border border-slate-850 p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2.5 mb-3.5">
                            <div className="w-7 h-7 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex items-center justify-center">
                              <Rocket className="w-4 h-4 text-emerald-400" />
                            </div>
                            <h5 className="text-white font-extrabold text-sm tracking-wide">Vision</h5>
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed font-medium">
                            {aboutData.vision}
                          </p>
                        </div>
                      </motion.div>

                    </div>

                    <motion.div variants={itemVariants} className="bg-slate-900/30 border border-slate-850 p-5 rounded-2xl backdrop-blur-md">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-7 h-7 bg-amber-500/10 rounded-lg border border-amber-500/20 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                        </div>
                        <h5 className="text-white font-extrabold text-sm tracking-wide">Core Motivation & Direct Goals</h5>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed font-medium mb-2.5">{aboutData.goals}</p>
                      <p className="text-slate-400 text-xs leading-relaxed font-medium">{aboutData.motivation}</p>
                    </motion.div>

                  </motion.div>
                )}

                {/* 2. ACADEMIC TIMELINE TAB */}
                {activeTab === "education" && (
                  <motion.div
                    key="education"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    
                    {/* Education timeline */}
                    <div className="bg-slate-900/30 border border-slate-850 p-6 rounded-2xl backdrop-blur-md">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg border border-blue-500/20 flex items-center justify-center">
                          <GraduationCap className="w-4 h-4 text-blue-400" />
                        </div>
                        <h4 className="text-white font-extrabold text-base tracking-wide">Academic Pathway</h4>
                      </div>
                      
                      <div className="space-y-6 relative pl-4 border-l border-slate-800/80">
                        {aboutData.education.map((edu, i) => (
                          <motion.div
                            key={i}
                            variants={itemVariants}
                            className="relative group/timeline"
                          >
                            {/* timeline dot */}
                            <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800 group-hover/timeline:bg-blue-400 group-hover/timeline:border-blue-400 transition-colors duration-300" />
                            
                            <div className="flex items-start justify-between flex-wrap gap-2">
                              <div>
                                <h5 className="text-white font-extrabold text-sm group-hover/timeline:text-blue-300 transition-colors duration-350">{edu.degree}</h5>
                                <p className="text-slate-400 text-xs font-semibold mt-0.5">{edu.school}</p>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] bg-slate-950/60 border border-slate-850 px-2.5 py-1 rounded-full text-slate-500 font-bold uppercase tracking-wider">
                                <Calendar className="w-3 h-3 text-slate-600" />
                                <span>{edu.year}</span>
                              </div>
                            </div>
                            <p className="text-slate-400 text-xs mt-2 leading-relaxed font-medium">{edu.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Certifications lists */}
                    <motion.div variants={itemVariants} className="bg-slate-900/30 border border-slate-850 p-6 rounded-2xl backdrop-blur-md">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex items-center justify-center">
                          <Award className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h4 className="text-white font-extrabold text-base tracking-wide">Professional Certifications</h4>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-3">
                        {certBadges.map((cert, i) => (
                          <div
                            key={i}
                            className={`flex flex-col justify-between p-3.5 rounded-xl border border-slate-850 bg-slate-950/40 hover:bg-slate-950/60 transition-colors cursor-pointer group/cert`}
                          >
                            <div className="flex items-start justify-between gap-2.5 mb-1.5">
                              <span className="text-white font-bold text-xs leading-relaxed group-hover/cert:text-blue-300 transition-colors duration-300">{cert.name}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-600 mt-0.5 group-hover/cert:text-blue-400 group-hover/cert:translate-x-0.5 transition-all duration-300" />
                            </div>
                            <div className="flex items-center justify-between text-[9px] mt-1 border-t border-slate-900/50 pt-2">
                              <span className="text-slate-500 uppercase tracking-widest font-bold">Issuer</span>
                              <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${cert.color}`}>
                                {cert.issuer}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                  </motion.div>
                )}

                {/* 3. KEY MILESTONES TAB */}
                {activeTab === "milestones" && (
                  <motion.div
                    key="milestones"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    
                    <div className="bg-slate-900/30 border border-slate-850 p-6 rounded-2xl backdrop-blur-md">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-amber-500/10 rounded-lg border border-amber-500/20 flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-amber-400" />
                        </div>
                        <h4 className="text-white font-extrabold text-base tracking-wide">System Milestones & Achievements</h4>
                      </div>

                      <div className="grid gap-4">
                        {aboutData.achievements.map((item, i) => (
                          <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{ scale: 1.01, x: 2 }}
                            className="flex gap-4 p-4 rounded-xl border border-slate-850 bg-slate-950/40 hover:bg-slate-950/60 transition-all duration-300 group/milestone"
                          >
                            <div className="w-10 h-10 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/milestone:scale-105 group-hover/milestone:border-blue-500/30 transition-all duration-300">
                              {i === 0 ? (
                                <Briefcase className="w-5 h-5 text-blue-400" />
                              ) : (
                                <Trophy className="w-5 h-5 text-emerald-400" />
                              )}
                            </div>
                            <div className="text-xs">
                              <div className="flex items-center gap-2">
                                <p className="text-white font-extrabold text-sm group-hover/milestone:text-blue-300 transition-colors duration-300">{item.title}</p>
                                <span className="text-[9px] px-2 py-0.5 bg-slate-950 border border-slate-850 text-slate-500 font-bold uppercase tracking-wider rounded-full">
                                  {i === 0 ? "Academic Project" : "Freelance Work"}
                                </span>
                              </div>
                              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-medium">
                                {item.description}
                              </p>
                              <div className="flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors mt-3 cursor-pointer group-hover/milestone:gap-1.5 duration-300"
                                   onClick={() => {
                                     const projectsSection = document.getElementById("projects");
                                     if (projectsSection) {
                                       projectsSection.scrollIntoView({ behavior: "smooth" });
                                     }
                                   }}
                              >
                                <span>Explore projects</span>
                                <ArrowRight className="w-3 h-3" />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
