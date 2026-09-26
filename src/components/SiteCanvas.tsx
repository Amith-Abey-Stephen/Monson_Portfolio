/**
 * One single background canvas for the whole page.
 * Hero glows violet, AboutIntro melts violet → black,
 * Projects sits on clean black (its own solid bg + top blend),
 * then rose / deep-red washes return further down.
 * All washes feathered — no hard clips.
 */
export function SiteCanvas() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            #000000 0%,
            #0a0614 4%,
            #3b1d6e 7.5%,
            #2a1650 9.5%,
            #1a0f2e 11.5%,
            #0e0918 13%,
            #0a0a0c 15%,
            #0a0a0c 17%,
            #0a0a0c 52%,
            #2a1216 56%,
            #c0808a 60%,
            #5c222a 64%,
            #0b0b0e 68%,
            #2a1650 71%,
            #5b21b6 74%,
            #1a1030 77%,
            #141014 79%,
            #2a1650 82%,
            #3b1d6e 83.5%,
            #2e1065 86%,
            #0a0614 91%,
            #000000 95%,
            #000000 100%)`,
        }}
      />
      {/* soft washes — all feathered, never hard-edged.
          Smaller blur radii on mobile for GPU-friendliness. */}
      <div className="absolute left-1/2 top-[7%] h-[30vh] w-[90vw] -translate-x-1/2 rounded-full bg-[#a855f7]/10 blur-[80px] md:blur-[130px]" />
      {/* violet bleed carrying hero → AboutIntro before projects cut to black */}
      <div className="absolute left-1/2 top-[12.5%] h-[24vh] w-[90vw] -translate-x-1/2 rounded-full bg-[#7c3aed]/10 blur-[80px] md:blur-[120px]" />
      <div className="absolute left-[62%] top-[72%] h-[34vh] w-[60vw] -translate-x-1/2 rounded-full bg-[#a855f7]/15 blur-[80px] md:blur-[130px]" />
      <div className="absolute left-1/2 top-[59%] h-[30vh] w-[85vw] -translate-x-1/2 rounded-full bg-[#c26a76]/25 blur-[80px] md:blur-[130px]" />
      <div className="absolute left-1/2 top-[83%] h-[26vh] w-[80vw] -translate-x-1/2 rounded-full bg-[#a8323e]/20 blur-[80px] md:blur-[130px]" />
    </div>
  );
}
