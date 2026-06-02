import { ExternalLink, Tag } from "lucide-react";
import { projectsData } from "../data/portfolio";

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
      {text}
    </div>
  );
}

const typeBadgeColors: Record<string, string> = {
  "Academic Project": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Personal Project": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Mock Project": "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function Projects() {
  return (
    <section id="projects" className="py-24 lg:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionLabel text="Projects" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Featured Work
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
            A showcase of projects I've built — from academic work and personal builds to professional mock deliverables.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.map((project, i) => (
            <div
              key={i}
              className="group bg-slate-800/50 border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 flex flex-col"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      typeBadgeColors[project.type] || "bg-slate-700 text-slate-300 border-slate-600"
                    }`}
                  >
                    {project.type}
                  </span>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-white font-bold leading-tight group-hover:text-blue-300 transition-colors">
                    {project.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 mb-3">
                  <Tag className="w-3 h-3 text-blue-400" />
                  <span className="text-blue-400 text-xs font-medium">{project.category}</span>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-white/5 text-slate-400 text-xs rounded-md font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
