/**
 * One single background canvas for the whole page.
 * Hero glows orange-red, AboutIntro melts red → black,
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
          background:
            "linear-gradient(to bottom," +
            " #000000 0%," +
            " #0b0404 4%," +
            " #ff6a1f 7.5%," +
            " #e8490d 9.5%," +
            " #7a1e05 11.5%," +
            " #3a0f06 13%," +
            " #160706 15%," +
            " #0a0a0c 17%," +
            " #0a0a0c 52%," +
            " #2a1216 56%," +
            " #c0808a 60%," +
            " #5c222a 64%," +
            " #0b0b0e 68%," +
            " #4a1508 71%," +
            " #8a2a10 74%," +
            " #2a0d08 77%," +
            " #141014 79%," +
            " #8e2434 82%," +
            " #9c2a3a 83.5%," +
            " #431318 86%," +
            " #0a0507 91%," +
            " #000000 95%," +
            " #000000 100%)",
        }}
      />
      {/* soft washes — all feathered, never hard-edged.
          Smaller blur radii on mobile for GPU-friendliness. */}
      <div className="absolute left-1/2 top-[7%] h-[30vh] w-[90vw] -translate-x-1/2 rounded-full bg-[#ff7a2a]/25 blur-[80px] md:blur-[130px]" />
      {/* red bleed carrying hero → AboutIntro before projects cut to black */}
      <div className="absolute left-1/2 top-[12.5%] h-[24vh] w-[90vw] -translate-x-1/2 rounded-full bg-[#e8490d]/20 blur-[80px] md:blur-[120px]" />
      <div className="absolute left-[62%] top-[72%] h-[34vh] w-[60vw] -translate-x-1/2 rounded-full bg-[#ff5a1a]/15 blur-[80px] md:blur-[130px]" />
      <div className="absolute left-1/2 top-[59%] h-[30vh] w-[85vw] -translate-x-1/2 rounded-full bg-[#c26a76]/25 blur-[80px] md:blur-[130px]" />
      <div className="absolute left-1/2 top-[83%] h-[26vh] w-[80vw] -translate-x-1/2 rounded-full bg-[#a8323e]/20 blur-[80px] md:blur-[130px]" />
    </div>
  );
}
