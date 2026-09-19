"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Initial loading screen — counts 0→100, then curtains up.
 * Matches the dark premium feel + gives hero images/fonts a
 * moment to settle before the entrance animations run.
 */
export function Preloader({
  name = "Monson Sunny",
  role = "UI/UX Designer",
}: {
  name?: string;
  role?: string;
} = {}) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const DURATION = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // ease-out so it feels fast then settles on 100
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setDone(true), 250);
      }
    };
    raf = requestAnimationFrame(tick);

    // lock scroll during load
    document.documentElement.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (done) document.documentElement.style.overflow = "";
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070708]"
          aria-hidden
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="px-4 text-center font-heading text-[13px] font-medium tracking-[0.3em] text-white/60 sm:text-[15px]"
          >
            {name.toUpperCase()}
          </motion.p>
          <p className="mt-4 font-heading text-[clamp(56px,18vw,72px)] font-bold leading-none tabular-nums text-white md:text-[96px]">
            {progress}
            <span className="text-[24px] text-white/50 sm:text-[32px]">%</span>
          </p>
          <div className="mt-8 h-[2px] w-[min(220px,60vw)] overflow-hidden rounded-full bg-white/10 md:w-[320px]">
            <div
              className="h-full w-full origin-left bg-gradient-to-r from-[#34ffb5] via-[#a855f7] to-[#e879f9]"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
          <p className="mt-5 font-heading text-[13px] tracking-[0.2em] text-white/40">
            {role.toUpperCase()}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
