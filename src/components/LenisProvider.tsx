"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Studio is a multi-pane editing workspace with nested scrollable panels and modals;
    // disable Lenis on /studio so mouse wheel, trackpad, and human cursor scrolling work natively.
    if (pathname?.startsWith("/studio")) return;

    // Intuitive + accessible: no smooth-scroll hijack for users who
    // prefer reduced motion — native scrolling stays instant.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      // Lenis 1.3+ drives its own rAF loop — no manual
      // requestAnimationFrame bookkeeping needed.
      autoRaf: true,
    });

    // anchor scrolling via lenis
    const onClick = (e: MouseEvent) => {
      // Studio preview frame handles its own anchors natively —
      // never hijack clicks inside it to scroll the outer page.
      if ((e.target as HTMLElement).closest("[data-studio-preview]")) return;
      const a = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -80 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}
