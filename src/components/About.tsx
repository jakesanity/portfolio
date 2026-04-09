import { GraduationCap, Target, Rocket, BookOpen, Trophy } from "lucide-react";
import { aboutData } from "../data/portfolio";

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
      {text}
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionLabel text="About Me" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Who I Am
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
            A brief look into my background, education, and what drives me forward.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          <div className="space-y-6">
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 hover:border-blue-500/20 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-white font-bold text-lg">My Background</h3>
              </div>
              <p className="text-slate-400 leading-relaxed">{aboutData.background}</p>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 hover:border-blue-500/20 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-white font-bold text-lg">Mission & Vision</h3>
              </div>
              <p className="text-slate-400 leading-relaxed mb-3">{aboutData.mission}</p>
              <p className="text-slate-400 leading-relaxed">{aboutData.vision}</p>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 hover:border-blue-500/20 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-white font-bold text-lg">Goals & Motivation</h3>
              </div>
              <p className="text-slate-400 leading-relaxed mb-3">{aboutData.goals}</p>
              <p className="text-slate-400 leading-relaxed">{aboutData.motivation}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 hover:border-blue-500/20 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-white font-bold text-lg">Educational Background</h3>
              </div>
              <div className="space-y-5">
                {aboutData.education.map((edu, i) => (
                  <div key={i} className="relative pl-5 border-l-2 border-blue-500/30">
                    <div className="absolute -left-1.5 top-1 w-3 h-3 bg-blue-500 rounded-full" />
                    <p className="text-white font-semibold">{edu.degree}</p>
                    <p className="text-blue-400 text-sm font-medium mt-0.5">{edu.school}</p>
                    <p className="text-slate-500 text-sm mt-0.5">{edu.year}</p>
                    <p className="text-slate-400 text-sm mt-2 leading-relaxed">{edu.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-slate-300 font-semibold text-sm mb-3">Certifications</p>
                <div className="space-y-2">
                  {aboutData.certifications.map((cert, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                      <span className="text-slate-400 text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 hover:border-blue-500/20 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="text-white font-bold text-lg">Key Achievements</h3>
              </div>
              <div className="grid gap-3">
                {aboutData.achievements.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-3 rounded-xl bg-white/2 hover:bg-white/5 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Trophy className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                      <p className="text-slate-400 text-sm mt-0.5">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
