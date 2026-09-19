"use client";

import { useEffect, useRef } from "react";

/**
 * Rainbow ribbon cursor trail — matches the Framer recording frame-by-frame:
 * thin (~2px) perfectly-smooth line that follows the cursor, tail = purple/magenta,
 * head = lime/yellow-green, passing through blue → cyan → green in the middle.
 * Long sweeping tail on fast moves, short stub on slow moves, fades at the tail.
 * Fixed full-screen canvas, desktop (fine pointer) only.
 */
export function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; t: number };
    let points: P[] = [];
    const MAX_AGE = 750; // ms — controls tail length, matches ~0.7s fade in video
    const MAX_POINTS = 90;
    const MIN_DIST = 3;

    const push = (x: number, y: number) => {
      const now = performance.now();
      const lastPt = points[points.length - 1];
      if (lastPt) {
        const dx = x - lastPt.x;
        const dy = y - lastPt.y;
        if (dx * dx + dy * dy < MIN_DIST * MIN_DIST) {
          lastPt.t = now; // refresh, don't stack dots when idle
          return;
        }
      }
      points.push({ x, y, t: now });
      if (points.length > MAX_POINTS) {
        points.splice(0, points.length - MAX_POINTS);
      }
    };

    const onMove = (e: MouseEvent) => push(e.clientX, e.clientY);
    const onLeave = () => {
      points = [];
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const draw = () => {
      const now = performance.now();
      // age out old points so fast flicks leave long tails, idle leaves nothing
      while (points.length && now - points[0].t > MAX_AGE) points.shift();
      ctx.clearRect(0, 0, w, h);

      const n = points.length;
      if (n > 2) {
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Two passes: soft glow underlay + crisp core — same hue ramp both passes
        // so it stays readable on black AND on bright orange/red.
        const passes = [
          { width: 4, alphaScale: 0.22 },
          { width: 2, alphaScale: 1 },
        ] as const;

        for (const pass of passes) {
          for (let i = 1; i < n; i++) {
            const p0 = points[i - 1];
            const p1 = points[i];
            const t = i / (n - 1); // 0 = tail, 1 = head (at cursor)
            // Tail purple/magenta (~288) → blue → cyan → green → head lime/yellow (~72)
            const hue = 288 - t * 216;
            const fade = Math.pow(t, 1.7); // transparent tail, opaque head
            const alpha = fade * 0.95 * pass.alphaScale;
            if (alpha < 0.01) continue;
            ctx.strokeStyle = `hsla(${hue}, 100%, 65%, ${alpha})`;
            ctx.lineWidth = pass.width;
            // smooth segment via midpoint quadratic (classic ribbon smoothing)
            const mx = (p0.x + p1.x) / 2;
            const my = (p0.y + p1.y) / 2;
            ctx.beginPath();
            if (i === 1) {
              ctx.moveTo(p0.x, p0.y);
              ctx.lineTo(mx, my);
            } else {
              const pm = points[i - 2];
              const pmx = (pm.x + p0.x) / 2;
              const pmy = (pm.y + p0.y) / 2;
              ctx.moveTo(pmx, pmy);
              ctx.quadraticCurveTo(p0.x, p0.y, mx, my);
            }
            if (i === n - 1) ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      id="cursor-trail-canvas"
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[90] hidden md:block"
      aria-hidden
    />
  );
}
