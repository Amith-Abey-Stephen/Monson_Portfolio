"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Briefcase,
  Link2,
  Menu,
  User,
  FileText,
  X,
  Zap,
} from "lucide-react";
import { navLinks as fallbackLinks, site as fallbackSite } from "@/data/content";
import type { SectionKey, SiteContent } from "@/lib/schema";

const icons: Record<string, typeof User> = {
  hero: User,
  projects: Briefcase,
  skills: Zap,
  experience: FileText,
  contact: Link2,
};

const navIdToSectionKey: Record<string, SectionKey> = {
  hero: "hero",
  projects: "projects",
  skills: "skills",
  experience: "about",
  contact: "contact",
};

export function Navbar({
  data,
}: {
  data?: Pick<SiteContent, "navLinks" | "site" | "sections">;
} = {}) {
  const visible = data?.sections?.visible;
  const rawNavLinks = data?.navLinks ?? fallbackLinks;
  const navLinks = rawNavLinks.filter((l) => {
    const secKey = navIdToSectionKey[l.id];
    if (!secKey || !visible) return true;
    return visible[secKey] !== false;
  });
  const site = data?.site ?? fallbackSite;
  const brand = site.name.split(" ")[0] || site.name;
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [navLinks]);

  // Intuitive mobile menu: close on Escape, on resize to desktop,
  // and lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="fixed inset-x-0 top-3 z-[80] flex justify-center px-3 md:top-5"
      >
        <nav
          // Matched to reference screenshot: warm translucent glass,
          // constant opacity (no scroll darkening), heavy blur + saturation
          // so the hero shows through like in the design.
          className="flex w-full max-w-[1060px] items-center justify-between gap-2 rounded-full border border-white/[0.08] bg-[rgb(22_11_9/0.44)] py-[7px] pl-[7px] pr-[7px] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.55)] backdrop-blur-[18px] backdrop-saturate-[1.4]"
        >
          <div className="hidden flex-1 items-center justify-center gap-1 lg:gap-2 md:flex">
            {navLinks.map((l) => {
              const Icon = icons[l.id] ?? User;
              const isActive = active === l.id;
              return (
                <a
                  key={l.id}
                  href={l.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-[10px] text-[14px] font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:px-6 lg:text-[15px] ${
                    isActive
                      ? "bg-[#e9e1d3] text-[#2a2018]"
                      : "text-white/[0.88] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.9} aria-hidden />
                  {l.label}
                </a>
              );
            })}
          </div>

          {/* mobile brand */}
          <a
            href="#hero"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-[15px] font-semibold md:hidden"
          >
            <User size={17} /> {brand}
          </a>

          <div className="flex items-center gap-2">
            {site.resumeHref && (
              <a
                href={site.resumeHref}
                target="_blank"
                rel="noreferrer"
                className="hidden rounded-full bg-[#f2eee7] px-5 py-3 text-[14px] font-semibold text-black transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:block lg:px-7 lg:text-[15px]"
              >
                Download Resume
              </a>
            )}
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:hidden"
            >
              {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.button
            key="nav-overlay"
            aria-hidden
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[78] cursor-default bg-black/50 md:hidden"
          />
        )}
        {open && (
          <motion.div
            key="nav-menu"
            id="mobile-menu"
            role="dialog"
            aria-label="Site navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-x-3 top-[68px] z-[79] max-h-[calc(100svh-88px)] overflow-y-auto rounded-3xl border border-white/[0.08] bg-[rgb(22_11_9/0.92)] p-3 shadow-2xl backdrop-blur-[18px] backdrop-saturate-[1.4] md:hidden"
          >
            {navLinks.map((l) => {
              const Icon = icons[l.id] ?? User;
              return (
                <a
                  key={l.id}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={active === l.id ? "true" : undefined}
                  className={`flex min-h-[48px] items-center gap-3 rounded-2xl px-4 py-3 text-[16px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    active === l.id
                      ? "bg-[#e9e1d3] font-medium text-[#2a2018]"
                      : "text-white/[0.88] hover:bg-white/10"
                  }`}
                >
                  <Icon size={17} aria-hidden /> {l.label}
                </a>
              );
            })}
            {site.resumeHref && (
              <a
                href={site.resumeHref}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block min-h-[48px] rounded-2xl bg-[#f2eee7] px-4 py-3.5 text-center font-semibold text-black"
              >
                Download Resume
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
