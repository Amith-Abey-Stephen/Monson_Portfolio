"use client";

import { logoImages as fallbackImages, clientLogos as fallbackLogos } from "@/data/content";
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
      className="animate-marquee-fast flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16 md:gap-20 md:pr-20"
    >
      {items.map((item) => (
        <span key={item.label} className="flex shrink-0 items-center">
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
  data?: Pick<SiteContent, "clientLogos" | "logoImages">;
} = {}) {
  const clientLogos = data?.clientLogos ?? fallbackLogos;
  const logoImages = data?.logoImages ?? fallbackImages;
  const items: LogoItem[] = clientLogos.map((label, i) => ({
    label,
    src: logoImages[i] as string | undefined,
  }));
  if (items.length === 0) return null;

  // In normal flow below the hero content so the marquee can never
  // cover the CTA buttons — scroll animation untouched.
  return (
    <div className="relative z-10 bg-transparent">
      <div className="marquee-paused relative flex overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <RowHalf items={items} />
        <RowHalf hidden items={items} />
      </div>
    </div>
  );
}
