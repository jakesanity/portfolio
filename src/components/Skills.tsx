import {
  Code,
  Palette,
  Database,
  FileText,
  Settings,
  Image,
  Zap,
  Monitor,
} from "lucide-react";
import { skillsData } from "../data/portfolio";

const iconMap: Record<string, React.ReactNode> = {
  Code: <Code className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
  Image: <Image className="w-5 h-5" />,
};

const serviceColors = [
  "from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400",
  "from-cyan-500/10 to-cyan-600/5 border-cyan-500/20 text-cyan-400",
  "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
  "from-amber-500/10 to-amber-600/5 border-amber-500/20 text-amber-400",
  "from-rose-500/10 to-rose-600/5 border-rose-500/20 text-rose-400",
  "from-violet-500/10 to-violet-600/5 border-violet-500/20 text-violet-400",
];

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
      {text}
    </div>
  );
}

function SkillBar({ name, level }: { name: string; level: number }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-slate-300 text-sm font-medium">{name}</span>
        <span className="text-blue-400 text-xs font-semibold">{level}%</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-24 lg:py-32 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionLabel text="Skills & Services" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            What I Bring to the Table
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
            A comprehensive breakdown of my technical abilities, soft skills, and specialized services.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Code className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-white font-bold text-lg">Technical Skills</h3>
            </div>
            <div className="space-y-5">
              {skillsData.technical.map((skill) => (
                <SkillBar key={skill.name} name={skill.name} level={skill.level} />
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-white font-bold text-lg">Soft Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillsData.soft.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-white font-bold text-lg">Software Proficiencies</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {skillsData.software.map((tool) => (
                  <div
                    key={tool}
                    className="flex items-center gap-2 px-3 py-2 bg-white/3 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold text-2xl text-center mb-8">Specialized Services</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skillsData.services.map((service, i) => (
              <div
                key={service.title}
                className={`bg-gradient-to-br ${serviceColors[i % serviceColors.length]} border rounded-2xl p-6 hover:-translate-y-1 transition-all duration-200`}
              >
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${serviceColors[i % serviceColors.length].split(" ").pop()}`}>
                  {iconMap[service.icon]}
                </div>
                <h4 className="text-white font-bold mb-2">{service.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
