import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { SectionMeta } from "../../lib/sections";

interface Props {
  meta: SectionMeta;
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
}

/** Consistent module header: index, path, title and summary. */
export default function SectionHeader({ meta, title, description, aside }: Props) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mb-12 grid gap-6 border-b border-white/[0.07] pb-10 lg:mb-16 lg:grid-cols-[1fr_auto] lg:items-end"
    >
      <div>
        <div className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em]">
          <span className="text-accent">[{meta.index}]</span>
          <span className="h-px w-8 bg-white/15" />
          <span className="text-fg-subtle">{meta.path}</span>
        </div>
        <h2 className="text-balance text-4xl font-semibold tracking-tightest text-fg sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">{description}</p>
        )}
      </div>
      {aside && <div className="lg:pb-2">{aside}</div>}
    </motion.header>
  );
}
