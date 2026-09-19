"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { faqs as fallbackFaqs } from "@/data/content";
import type { SiteContent } from "@/lib/schema";
import { GridLines, ScrollReveal } from "./ui";

export function Faq({
  data,
}: {
  data?: Pick<SiteContent, "faqs">;
} = {}) {
  const faqs = data?.faqs ?? fallbackFaqs;
  const [open, setOpen] = useState<number | null>(null);

  if (faqs.length === 0) return null;

  return (
    <section aria-label="Frequently asked questions" className="relative overflow-hidden bg-[linear-gradient(to_bottom,#8b5cf6_0%,#5b21b6_25%,#2e1065_55%,transparent_100%)] px-4 pb-16 pt-4 sm:px-6 md:px-10 md:pb-20">
      <GridLines />
      <div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-2xl border border-white/10 bg-black/25 backdrop-blur-xl">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <ScrollReveal key={f.index} delay={Math.min(i * 0.04, 0.2)}>
              <div className="border-b border-white/20 last:border-b-0">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${f.index}`}
                  className="grid min-h-[64px] w-full grid-cols-[32px_1fr_40px] items-center gap-2 px-4 py-5 text-left transition-colors hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white sm:grid-cols-[48px_1fr_48px] md:px-6 md:py-6"
                >
                  <span className="font-heading text-[14px] tabular-nums text-white/40 md:text-[16px]">{f.index}</span>
                  <span className="text-balance font-heading text-[15px] font-medium leading-snug text-white sm:text-[16px] md:text-center md:text-[20px]">
                    {f.q}
                  </span>
                  <span className="justify-self-end">
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid size-9 place-items-center rounded-full bg-white/[0.06] text-white sm:size-8 sm:bg-transparent"
                    >
                      <Plus size={22} aria-hidden />
                    </motion.span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${f.index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="mx-auto max-w-[720px] px-6 pb-7 text-left font-heading text-[14px] font-light leading-[1.7] text-white/75 sm:text-[15px] md:text-center">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
