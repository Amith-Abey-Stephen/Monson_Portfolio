"use client";

import { logoImages as fallbackImages, clientLogos as fallbackLogos, logoMarqueeSpeed as fallbackSpeed } from "@/data/content";
import type { SiteContent } from "@/lib/schema";

/**
 * Simple running banner, as per the recording: plain white logos
 * floating directly over the hero image's lower fade — no box, no
 * border, no band, not a separate section. Rendered pinned to the
 * hero bottom (see Hero.tsx) with clearance above the CTAs, so the
 * marquee can never cover the buttons. Scroll animation untouched.
 */
type LogoItem = { label: string; src: string | undefined };

function RowHalf({ hidden, items }: { hidden?: boolean; items: LogoItem[] }) {
  return (
    <div
      aria-hidden={hidden}
      className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16 md:gap-20 md:pr-20"
    >
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex shrink-0 items-center">
          {item.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.src}
              alt={item.label}
              loading="lazy"
              className="h-7 w-auto object-contain opacity-90 brightness-0 invert sm:h-8 md:h-10"
            />
          ) : (
            <span className="whitespace-nowrap font-heading text-[13px] font-semibold uppercase tracking-[0.14em] text-white/90 sm:text-[15px]">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

export function LogoStrip({
  data,
}: {
  data?: Pick<SiteContent, "clientLogos" | "logoImages" | "logoMarqueeSpeed">;
} = {}) {
  const clientLogos = data?.clientLogos ?? fallbackLogos;
  const logoImages = data?.logoImages ?? fallbackImages;
  const speed = Math.min(10, Math.max(1, data?.logoMarqueeSpeed ?? fallbackSpeed ?? 8));
  // Map 1-10 to a crawl: 1 ≈ 8s/loop (fastest), 10 ≈ 80s/loop (slowest).
  // The track is very wide (12 logos per half), so raw seconds still look fast.
  // Snapped to a 6s multiple so loop boundaries stay phase-locked with the
  // 6s hero master beat (sheen / float / glow).
  const duration = Math.max(6, Math.round((speed * 8) / 6) * 6);
  const items: LogoItem[] = clientLogos.map((label, i) => ({
    label,
    src: logoImages[i] as string | undefined,
  }));
  if (items.length === 0) return null;

  // Repeat the set enough times that one half is always wider than the
  // viewport — with only 2 logos a single set leaves the line half-empty.
  // Target ~12 logos per half so the line looks complete on all screens.
  const copiesPerHalf = Math.max(1, Math.ceil(12 / items.length));
  const half: LogoItem[] = Array.from({ length: copiesPerHalf }, () => items).flat();

  // In normal flow below the hero content so the marquee can never
  // cover the CTA buttons — scroll animation untouched.
  return (
    <div className="relative z-10 bg-transparent">
      <div className="marquee-paused relative flex overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* single seamless track: two identical halves, track translates -50% */}
        <div className="animate-marquee-fast flex w-max" style={{ animationDuration: `${duration}s` }}>
          <RowHalf items={half} />
          <RowHalf hidden items={half} />
        </div>
      </div>
    </div>
  );
}
