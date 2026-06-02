import { useState } from "react";
import {
  Code,
  Palette,
  Database,
  FileText,
  Settings,
  Image,
  Zap,
  Monitor,
  Star,
  CheckCircle2,
  Terminal,
  Server,
  Layers,
  ArrowRight,
  Workflow,
  Sparkles,
  Users,
  Clock,
  RefreshCw,
  MessageSquare,
  Eye,
  Brain
} from "lucide-react";
import { skillsData } from "../data/portfolio";
import { motion, AnimatePresence } from "framer-motion";

const iconMap: Record<string, React.ReactNode> = {
  Code: <Code className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
  Image: <Image className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Monitor: <Monitor className="w-5 h-5" />,
  Star: <Star className="w-5 h-5" />,
  CheckCircle: <CheckCircle2 className="w-5 h-5" />,
};

// Detailed mappings for Tech skills
const techDetails: Record<string, { category: string; color: string; shadowClass: string; icon: React.ReactNode; badge: string }> = {
  "HTML / CSS": {
    category: "Frontend",
    color: "text-orange-400 bg-orange-500/10 border-orange-500/20 group-hover:border-orange-500/40",
    shadowClass: "hover:shadow-[0_0_25px_rgba(249,115,22,0.12)]",
    icon: <Code className="w-5 h-5 text-orange-400" />,
    badge: "Expert"
  },
  "JavaScript": {
    category: "Frontend",
    color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20 group-hover:border-yellow-500/40",
    shadowClass: "hover:shadow-[0_0_25px_rgba(234,179,8,0.12)]",
    icon: <Code className="w-5 h-5 text-yellow-400" />,
    badge: "Advanced"
  },
  "React.js": {
    category: "Frontend",
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 group-hover:border-cyan-500/40",
    shadowClass: "hover:shadow-[0_0_25px_rgba(6,182,212,0.12)]",
    icon: <Layers className="w-5 h-5 text-cyan-400" />,
    badge: "Advanced"
  },
  "Python": {
    category: "Backend & Relational",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:border-blue-500/40",
    shadowClass: "hover:shadow-[0_0_25px_rgba(59,130,246,0.12)]",
    icon: <Server className="w-5 h-5 text-blue-400" />,
    badge: "Intermediate"
  },
  "PHP / Laravel": {
    category: "Backend & Relational",
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:border-indigo-500/40",
    shadowClass: "hover:shadow-[0_0_25px_rgba(99,102,241,0.12)]",
    icon: <Server className="w-5 h-5 text-indigo-400" />,
    badge: "Intermediate"
  },
  "MySQL / PostgreSQL": {
    category: "Backend & Relational",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:border-emerald-500/40",
    shadowClass: "hover:shadow-[0_0_25px_rgba(16,185,129,0.12)]",
    icon: <Database className="w-5 h-5 text-emerald-400" />,
    badge: "Intermediate"
  },
  "Git & GitHub": {
    category: "Systems & Workflows",
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20 group-hover:border-rose-500/40",
    shadowClass: "hover:shadow-[0_0_25px_rgba(244,63,94,0.12)]",
    icon: <Workflow className="w-5 h-5 text-rose-400" />,
    badge: "Expert"
  },
  "Linux / CLI": {
    category: "Systems & Workflows",
    color: "text-slate-400 bg-slate-500/10 border-slate-500/20 group-hover:border-slate-500/40",
    shadowClass: "hover:shadow-[0_0_25px_rgba(148,163,184,0.12)]",
    icon: <Terminal className="w-5 h-5 text-slate-400" />,
    badge: "Intermediate"
  }
};

// Detailed mappings for Software / Tools
const toolDetails: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  "VS Code": { color: "text-blue-400", bg: "bg-blue-500/5", border: "border-blue-500/25 hover:border-blue-500/40", icon: <Terminal className="w-4 h-4" /> },
  "Figma": { color: "text-purple-400", bg: "bg-purple-500/5", border: "border-purple-500/25 hover:border-purple-500/40", icon: <Palette className="w-4 h-4" /> },
  "Adobe Photoshop": { color: "text-sky-400", bg: "bg-sky-500/5", border: "border-sky-500/25 hover:border-sky-500/40", icon: <Image className="w-4 h-4" /> },
  "Canva": { color: "text-indigo-400", bg: "bg-indigo-500/5", border: "border-indigo-500/25 hover:border-indigo-500/40", icon: <Palette className="w-4 h-4" /> },
  "Microsoft Office Suite": { color: "text-orange-400", bg: "bg-orange-500/5", border: "border-orange-500/25 hover:border-orange-500/40", icon: <FileText className="w-4 h-4" /> },
  "Google Workspace": { color: "text-green-400", bg: "bg-green-500/5", border: "border-green-500/25 hover:border-green-500/40", icon: <Settings className="w-4 h-4" /> },
  "Trello / Notion": { color: "text-slate-300", bg: "bg-slate-500/5", border: "border-slate-500/25 hover:border-slate-500/40", icon: <Workflow className="w-4 h-4" /> },
  "Postman": { color: "text-orange-500", bg: "bg-orange-500/5", border: "border-orange-500/25 hover:border-orange-500/40", icon: <Zap className="w-4 h-4" /> },
  "XAMPP / Apache": { color: "text-amber-400", bg: "bg-amber-500/5", border: "border-amber-500/25 hover:border-amber-500/40", icon: <Server className="w-4 h-4" /> },
  "GitHub Desktop": { color: "text-pink-400", bg: "bg-pink-500/5", border: "border-pink-500/25 hover:border-pink-500/40", icon: <Workflow className="w-4 h-4" /> },
};

// Detailed mappings for Soft Skills (narrative additions)
const softSkillDetails: Record<string, { icon: React.ReactNode; tagline: string; color: string; border: string }> = {
  "Problem Solving": {
    icon: <Zap className="w-5 h-5 text-emerald-400" />,
    tagline: "Approaching complex logical challenges with structured solutions.",
    color: "from-emerald-500/10 to-emerald-600/5 text-emerald-400",
    border: "border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
  },
  "Critical Thinking": {
    icon: <Brain className="w-5 h-5 text-blue-400" />,
    tagline: "Analyzing information objectively to make informed systems decisions.",
    color: "from-blue-500/10 to-blue-600/5 text-blue-400",
    border: "border-blue-500/20 hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
  },
  "Team Collaboration": {
    icon: <Users className="w-5 h-5 text-indigo-400" />,
    tagline: "Working efficiently across diverse groups to achieve project goals.",
    color: "from-indigo-500/10 to-indigo-600/5 text-indigo-400",
    border: "border-indigo-500/20 hover:border-indigo-500/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]"
  },
  "Time Management": {
    icon: <Clock className="w-5 h-5 text-rose-400" />,
    tagline: "Prioritizing tasks systematically to deliver quality work on schedule.",
    color: "from-rose-500/10 to-rose-600/5 text-rose-400",
    border: "border-rose-500/20 hover:border-rose-500/40 hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]"
  },
  "Adaptability": {
    icon: <RefreshCw className="w-5 h-5 text-cyan-400" />,
    tagline: "Quickly learning new tech frameworks and adjusting to project shifts.",
    color: "from-cyan-500/10 to-cyan-600/5 text-cyan-400",
    border: "border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]"
  },
  "Communication": {
    icon: <MessageSquare className="w-5 h-5 text-amber-400" />,
    tagline: "Explaining technical solutions clearly to stakeholders and clients.",
    color: "from-amber-500/10 to-amber-600/5 text-amber-400",
    border: "border-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
  },
  "Attention to Detail": {
    icon: <Eye className="w-5 h-5 text-violet-400" />,
    tagline: "Ensuring clean markup, semantic structure, and visual precision.",
    color: "from-violet-500/10 to-violet-600/5 text-violet-400",
    border: "border-violet-500/20 hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]"
  },
  "Fast Learner": {
    icon: <Sparkles className="w-5 h-5 text-yellow-400" />,
    tagline: "Absorbing new developer tools and technical architectures rapidly.",
    color: "from-yellow-500/10 to-yellow-600/5 text-yellow-400",
    border: "border-yellow-500/20 hover:border-yellow-500/40 hover:shadow-[0_0_20px_rgba(234,179,8,0.1)]"
  }
};

// Detailed deliverables & colors for Specialized Services
const serviceDetails: Record<string, { deliverables: string[]; actionText: string; colorClass: string; hoverGlow: string }> = {
  "Web Development": {
    deliverables: ["Single Page Applications (SPAs)", "RESTful API Integration", "Responsive & Mobile-First Design", "SEO & Performance Optimization"],
    actionText: "Build a web app",
    colorClass: "from-blue-600/15 via-blue-600/5 to-slate-950/80 border-blue-500/20 text-blue-400 hover:border-blue-500/40",
    hoverGlow: "rgba(59, 130, 246, 0.15)"
  },
  "UI/UX Design": {
    deliverables: ["Wireframes & User Flows", "High-Fidelity Interactive Prototypes", "Custom Design Systems in Figma", "Heuristic Usability Evaluation"],
    actionText: "Design your interface",
    colorClass: "from-cyan-600/15 via-cyan-600/5 to-slate-950/80 border-cyan-500/20 text-cyan-400 hover:border-cyan-500/40",
    hoverGlow: "rgba(6, 182, 212, 0.15)"
  },
  "Database Management": {
    deliverables: ["Schema Design & Normalization", "Query Tuning & Optimization", "Data Safety & Backup Planning", "Relational Mapping (SQL & PostgreSQL)"],
    actionText: "Optimize your database",
    colorClass: "from-emerald-600/15 via-emerald-600/5 to-slate-950/80 border-emerald-500/20 text-emerald-400 hover:border-emerald-500/40",
    hoverGlow: "rgba(16, 185, 129, 0.15)"
  },
  "Technical Documentation": {
    deliverables: ["API Reference & Documentation", "System Architecture Manuals", "User Guides & Tutorials", "Software Requirements Specs (SRS)"],
    actionText: "Document your system",
    colorClass: "from-violet-600/15 via-violet-600/5 to-slate-950/80 border-violet-500/20 text-violet-400 hover:border-violet-500/40",
    hoverGlow: "rgba(139, 92, 246, 0.15)"
  },
  "IT Support & Troubleshooting": {
    deliverables: ["Hardware & Software Diagnostics", "Network Configuration & Support", "Operating System Maintenance", "Security Compliance Audits"],
    actionText: "Solve technical issues",
    colorClass: "from-rose-600/15 via-rose-600/5 to-slate-950/80 border-rose-500/20 text-rose-400 hover:border-rose-500/40",
    hoverGlow: "rgba(244, 63, 94, 0.15)"
  },
  "Graphic Design": {
    deliverables: ["Brand Identity & Vector Assets", "Social Media Templates", "Marketing & Pitch Presentations", "Custom Vector Illustrations"],
    actionText: "Elevate your branding",
    colorClass: "from-amber-600/15 via-amber-600/5 to-slate-950/80 border-amber-500/20 text-amber-400 hover:border-amber-500/40",
    hoverGlow: "rgba(245, 158, 11, 0.15)"
  }
};

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

const itemVariants: any = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14
    }
  }
};

export default function Skills() {
  const [activeTab, setActiveTab] = useState<"engineering" | "tools" | "human">("engineering");

  // Group Technical Skills
  const frontendSkills = skillsData.technical.filter(s => techDetails[s.name]?.category === "Frontend");
  const backendSkills = skillsData.technical.filter(s => techDetails[s.name]?.category === "Backend & Relational");
  const workflowSkills = skillsData.technical.filter(s => techDetails[s.name]?.category === "Systems & Workflows");

  return (
    <section id="skills" className="py-24 lg:py-32 bg-transparent relative overflow-hidden">
      {/* Dynamic Background Mesh Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-slate-950/20 to-transparent pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <SectionLabel text="Skills & Experience" />
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
          >
            Areas of Expertise
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-400 mt-4 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed"
          >
            An interactive showcase of my logical foundations, structural tools, and specialized professional services.
          </motion.p>
        </div>

        {/* Dashboard Tabs Control */}
        <div className="flex justify-center mb-12">
          <div className="flex p-1.5 bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl max-w-lg w-full sm:w-auto shadow-xl">
            <button
              onClick={() => setActiveTab("engineering")}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 relative ${
                activeTab === "engineering" ? "text-blue-400 bg-slate-800/80 border border-white/5 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Core Tech</span>
            </button>
            <button
              onClick={() => setActiveTab("tools")}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 relative ${
                activeTab === "tools" ? "text-blue-400 bg-slate-800/80 border border-white/5 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Tools & Environment</span>
            </button>
            <button
              onClick={() => setActiveTab("human")}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 relative ${
                activeTab === "human" ? "text-blue-400 bg-slate-800/80 border border-white/5 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Professional Traits</span>
            </button>
          </div>
        </div>

        {/* Dashboard Core Content */}
        <div className="min-h-[420px] mb-24">
          <AnimatePresence mode="wait">
            {activeTab === "engineering" && (
              <motion.div
                key="engineering"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                {/* Tech Skills Categorized Group */}
                <div className="grid md:grid-cols-3 gap-8">
                  
                  {/* Frontend Columns */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1 mb-2">
                      <Code className="w-4 h-4 text-blue-400" />
                      <h4 className="text-white font-bold text-sm uppercase tracking-wider">Frontend Development</h4>
                    </div>
                    <div className="space-y-4">
                      {frontendSkills.map(skill => {
                        const details = techDetails[skill.name] || { color: "", shadowClass: "", icon: null, badge: "Intermediate" };
                        return (
                          <motion.div
                            key={skill.name}
                            variants={itemVariants}
                            className={`bg-slate-900/40 border border-slate-850 p-4 rounded-xl hover:bg-slate-900/60 transition-all duration-300 group ${details.shadowClass}`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-lg border ${details.color.split(" ").slice(1).join(" ")} group-hover:scale-105 transition-transform duration-300`}>
                                  {details.icon}
                                </div>
                                <div>
                                  <h5 className="text-white font-bold text-sm tracking-wide">{skill.name}</h5>
                                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Stack Category</span>
                                </div>
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${details.color.split(" ").slice(0, 2).join(" ")}`}>
                                {details.badge}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-slate-500">Proficiency level</span>
                                <span className="text-slate-300 font-semibold">{skill.level}%</span>
                              </div>
                              <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden w-full relative">
                                <div
                                  style={{ width: `${skill.level}%` }}
                                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full group-hover:brightness-110 transition-all duration-300"
                                />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Backend Columns */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1 mb-2">
                      <Server className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-white font-bold text-sm uppercase tracking-wider">Backend & Systems</h4>
                    </div>
                    <div className="space-y-4">
                      {backendSkills.map(skill => {
                        const details = techDetails[skill.name] || { color: "", shadowClass: "", icon: null, badge: "Intermediate" };
                        return (
                          <motion.div
                            key={skill.name}
                            variants={itemVariants}
                            className={`bg-slate-900/40 border border-slate-850 p-4 rounded-xl hover:bg-slate-900/60 transition-all duration-300 group ${details.shadowClass}`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-lg border ${details.color.split(" ").slice(1).join(" ")} group-hover:scale-105 transition-transform duration-300`}>
                                  {details.icon}
                                </div>
                                <div>
                                  <h5 className="text-white font-bold text-sm tracking-wide">{skill.name}</h5>
                                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Stack Category</span>
                                </div>
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${details.color.split(" ").slice(0, 2).join(" ")}`}>
                                {details.badge}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-slate-500">Proficiency level</span>
                                <span className="text-slate-300 font-semibold">{skill.level}%</span>
                              </div>
                              <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden w-full relative">
                                <div
                                  style={{ width: `${skill.level}%` }}
                                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full group-hover:brightness-110 transition-all duration-300"
                                />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Workflows Column */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1 mb-2">
                      <Workflow className="w-4 h-4 text-rose-400" />
                      <h4 className="text-white font-bold text-sm uppercase tracking-wider">DevOps & Workflows</h4>
                    </div>
                    <div className="space-y-4">
                      {workflowSkills.map(skill => {
                        const details = techDetails[skill.name] || { color: "", shadowClass: "", icon: null, badge: "Intermediate" };
                        return (
                          <motion.div
                            key={skill.name}
                            variants={itemVariants}
                            className={`bg-slate-900/40 border border-slate-850 p-4 rounded-xl hover:bg-slate-900/60 transition-all duration-300 group ${details.shadowClass}`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-lg border ${details.color.split(" ").slice(1).join(" ")} group-hover:scale-105 transition-transform duration-300`}>
                                  {details.icon}
                                </div>
                                <div>
                                  <h5 className="text-white font-bold text-sm tracking-wide">{skill.name}</h5>
                                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Stack Category</span>
                                </div>
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${details.color.split(" ").slice(0, 2).join(" ")}`}>
                                {details.badge}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-slate-500">Proficiency level</span>
                                <span className="text-slate-300 font-semibold">{skill.level}%</span>
                              </div>
                              <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden w-full relative">
                                <div
                                  style={{ width: `${skill.level}%` }}
                                  className="h-full bg-gradient-to-r from-rose-500 to-pink-400 rounded-full group-hover:brightness-110 transition-all duration-300"
                                />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {activeTab === "tools" && (
              <motion.div
                key="tools"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
              >
                {skillsData.software.map((tool) => {
                  const details = toolDetails[tool] || { color: "text-slate-400", bg: "bg-slate-500/5", border: "border-slate-800/80 hover:border-slate-700/80", icon: <Monitor className="w-4 h-4" /> };
                  return (
                    <motion.div
                      key={tool}
                      variants={itemVariants}
                      whileHover={{ y: -4 }}
                      className={`flex flex-col p-4 bg-slate-900/40 border rounded-xl backdrop-blur-sm cursor-pointer group transition-all duration-350 ${details.bg} ${details.border}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 bg-slate-950 border border-slate-850 rounded-lg group-hover:scale-110 transition-transform duration-300 ${details.color}`}>
                          {details.icon}
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-blue-400 transition-colors duration-300" />
                      </div>
                      <span className="text-slate-200 text-sm font-semibold tracking-wide group-hover:text-white transition-colors duration-200">{tool}</span>
                      <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-medium">Software Tool</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {activeTab === "human" && (
              <motion.div
                key="human"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {skillsData.soft.map((skill) => {
                  const details = softSkillDetails[skill] || { icon: <CheckCircle2 className="w-5 h-5" />, tagline: "Core professional skill", color: "from-blue-500/5 to-slate-950", border: "border-slate-800 hover:border-slate-750" };
                  return (
                    <motion.div
                      key={skill}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      className={`flex flex-col p-5 bg-gradient-to-br ${details.color} border rounded-xl backdrop-blur-sm transition-all duration-300 group ${details.border}`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-slate-950 border border-slate-850 rounded-xl group-hover:scale-105 transition-transform duration-300">
                          {details.icon}
                        </div>
                        <h4 className="text-white font-bold text-sm tracking-wide">{skill}</h4>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed font-medium group-hover:text-slate-300 transition-colors duration-250">
                        {details.tagline}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Specialized Services Heading */}
        <div className="border-t border-slate-900 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-[10px] px-3.5 py-1.5 bg-blue-500/5 border border-blue-500/10 rounded-full text-blue-400 font-bold uppercase tracking-widest shadow-sm">
              Professional Services
            </span>
            <h3 className="text-white font-extrabold text-2xl sm:text-3xl mt-4 tracking-tight">
              Specialized Solutions
            </h3>
            <p className="text-slate-500 text-sm max-w-xl mx-auto mt-2 font-medium">
              High-quality freelance engineering services built to deliver professional outcomes.
            </p>
          </motion.div>

          {/* Services Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillsData.services.map((service, i) => {
              const details = serviceDetails[service.title] || {
                deliverables: [],
                actionText: "Request Service",
                colorClass: "from-blue-500/10 to-blue-600/5 border-slate-800 text-blue-400 hover:border-blue-500/40",
                hoverGlow: "rgba(59, 130, 246, 0.1)"
              };
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className={`bg-gradient-to-br ${details.colorClass} rounded-2xl p-6 backdrop-blur-md cursor-pointer group flex flex-col justify-between transition-all duration-350 hover:shadow-xl`}
                  style={{
                    boxShadow: `inset 0 0 30px rgba(255, 255, 255, 0.01)`
                  }}
                  onClick={() => {
                    const contactSection = document.getElementById("contact");
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  <div>
                    {/* Top Row Icon / Zap */}
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center group-hover:scale-110 group-hover:border-white/10 transition-all duration-300`}>
                        {iconMap[service.icon]}
                      </div>
                      <div className="w-7 h-7 bg-slate-950 border border-slate-850 rounded-full flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Title & Desc */}
                    <h4 className="text-white font-extrabold text-lg mb-2 tracking-wide group-hover:text-blue-300 transition-colors duration-300">{service.title}</h4>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                      {service.description}
                    </p>

                    {/* Deliverables Bullet List */}
                    <div className="space-y-2 border-t border-slate-900/50 pt-4 mb-6">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-2">Scope & Focus</span>
                      {details.deliverables.map((deliverable) => (
                        <div key={deliverable} className="flex items-start gap-2.5 text-xs text-slate-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0 group-hover:text-slate-300 transition-colors duration-300" />
                          <span>{deliverable}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* bottom Interactive Action Call */}
                  <div className="flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors pt-2 border-t border-slate-900/30 group-hover:gap-2 duration-300">
                    <span>{details.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

