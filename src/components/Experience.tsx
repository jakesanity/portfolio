import { Briefcase, CheckCircle2 } from "lucide-react";
import { experienceData } from "../data/portfolio";

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
      {text}
    </div>
  );
}

const typeBadgeColors: Record<string, string> = {
  Internship: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Freelance: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Volunteer: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function Experience() {
  return (
    <section id="experience" className="py-24 lg:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionLabel text="Experience" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Work Experience
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
            My hands-on professional journey — roles, responsibilities, and real-world contributions.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-0 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/40 via-blue-500/20 to-transparent hidden sm:block" />

          <div className="space-y-8">
            {experienceData.map((job, i) => (
              <div
                key={i}
                className={`relative flex flex-col sm:flex-row gap-6 ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                <div className="hidden sm:flex absolute left-0 lg:left-1/2 -translate-x-1/2 w-10 h-10 bg-slate-950 border-2 border-blue-500/40 rounded-full items-center justify-center z-10">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                </div>

                <div className={`flex-1 sm:pl-10 lg:pl-0 ${i % 2 === 0 ? "lg:pr-14 lg:text-right" : "lg:pl-14"}`}>
                  <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 hover:border-blue-500/20 transition-all duration-200 hover:-translate-y-0.5">
                    <div className={`flex flex-wrap items-start gap-3 mb-4 ${i % 2 === 0 ? "lg:flex-row-reverse" : ""}`}>
                      <div className={`flex-1 ${i % 2 === 0 ? "lg:text-right" : ""}`}>
                        <h3 className="text-white font-bold text-lg">{job.role}</h3>
                        <p className="text-blue-400 font-medium text-sm mt-0.5">{job.company}</p>
                        <p className="text-slate-500 text-sm mt-0.5">{job.period}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${typeBadgeColors[job.type] || "bg-slate-700 text-slate-300 border-slate-600"}`}>
                        {job.type}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {job.responsibilities.map((resp, j) => (
                        <div
                          key={j}
                          className={`flex items-start gap-2 ${i % 2 === 0 ? "lg:flex-row-reverse" : ""}`}
                        >
                          <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-400 text-sm leading-relaxed">{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex-1 hidden lg:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
