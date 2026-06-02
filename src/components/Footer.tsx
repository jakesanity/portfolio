import { Code2, Mail, Linkedin, Github, Download, MapPin, ArrowUp, ExternalLink, MessageSquare } from "lucide-react";
import { personalInfo } from "../data/portfolio";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-900 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl text-white font-bold tracking-tight">
                {personalInfo.firstName}
                <span className="text-blue-400">.</span>
              </span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed">
              Information Technology student passionate about building clean, functional, and impactful digital solutions. Always learning and exploring new technologies.
            </p>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-500 text-xs font-medium">Available for new opportunities</span>
            </div>
            
            <div className="flex items-center gap-3">
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/40 text-slate-400 hover:text-blue-400 transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                aria-label="Email"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/40 text-slate-400 hover:text-blue-400 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Navigation</h4>
            <div className="grid grid-cols-1 gap-3">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40 group-hover:bg-blue-500 transition-colors" />
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Contact Details</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Location</p>
                  <p className="text-slate-400 text-sm">{personalInfo.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Email</p>
                  <a href={`mailto:${personalInfo.email}`} className="text-slate-400 text-sm hover:text-blue-400 transition-colors">
                    {personalInfo.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Let's Talk</p>
                  <button 
                    onClick={() => handleNavClick("#contact")}
                    className="text-slate-400 text-sm hover:text-blue-400 transition-colors"
                  >
                    Send a message
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter/Resume */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Resources</h4>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Interested in working together? Download my CV or reach out via email.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={personalInfo.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/25"
              >
                <Download className="w-4 h-4" />
                Download CV
              </a>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-300"
              >
                <Github className="w-4 h-4" />
                View GitHub
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} <span className="text-white font-medium">{personalInfo.name}</span>. All rights reserved.
            </p>
            <p className="text-slate-500 text-xs">
              Built with Passion, React, TypeScript & Tailwind CSS
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</button>
            <button className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-4 bg-blue-600 text-white rounded-2xl shadow-2xl transition-all duration-500 z-50 hover:bg-blue-500 hover:-translate-y-1 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </footer>
  );
}
