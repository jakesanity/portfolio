import { useState } from "react";
import About from "./components/About";
import BootSequence from "./components/BootSequence";
import CircuitRail from "./components/CircuitRail";
import CommandPalette from "./components/CommandPalette";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import TechMarquee from "./components/TechMarquee";
import Terminal from "./components/Terminal";

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      <BootSequence />
      <Navbar onOpenPalette={() => setPaletteOpen(true)} />
      <CircuitRail />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />

      <main>
        <Hero />
        <TechMarquee />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Terminal />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
