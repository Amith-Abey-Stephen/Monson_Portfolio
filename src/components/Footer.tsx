import { site as fallbackSite } from "@/data/content";
import type { SiteContent } from "@/lib/schema";

export function Footer({
  data,
}: {
  data?: Pick<SiteContent, "site" | "about">;
} = {}) {
  const site = data?.site ?? fallbackSite;
  const currentYear = new Date().getFullYear();
  const rawNotice = site.copyrightNotice?.trim();
  let notice: string;
  if (rawNotice) {
    if (rawNotice.includes("{year}")) {
      notice = rawNotice.replace(/\{year\}/gi, String(currentYear));
    } else if (/\b(19\d\d|20\d\d)\b/.test(rawNotice)) {
      notice = rawNotice.replace(/\b(19\d\d|20\d\d)\b/g, String(currentYear));
    } else {
      notice = `© ${currentYear} ${rawNotice}`;
    }
  } else {
    notice = `© ${currentYear} ${site.name} — Built with Next.js${site.email ? ` • ${site.email}` : ""}`;
  }
  return (
    <footer className="relative overflow-hidden bg-transparent pb-6 pt-10 md:pb-8">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 font-heading text-[13px] text-white/45 sm:px-6 sm:text-[14px] md:justify-between md:px-12">
        <span>UI Design</span>
        <span>UX Design</span>
        <span>{site.role || "Portfolio"}</span>
      </div>
      <h2
        aria-hidden
        className="pointer-events-none mx-auto mt-4 max-w-full select-none overflow-hidden whitespace-nowrap text-center font-heading text-[15vw] font-bold leading-[0.9] tracking-tight text-white/[0.09] sm:text-[16vw] md:text-[13vw] lg:text-[11vw]"
      >
        {site.name}
      </h2>
      <p className="mt-4 break-words px-5 text-center font-heading text-[12px] leading-relaxed text-white/30">
        {notice}
      </p>
    </footer>
  );
}
