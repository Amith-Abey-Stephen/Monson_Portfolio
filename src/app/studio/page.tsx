import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getContentMeta, getDraftContent, getHistory, getPublishedContent } from "@/lib/content";
import { StudioApp } from "./StudioApp";

export const dynamic = "force-dynamic";
export const metadata = { title: "Studio", robots: "noindex, nofollow" };

export default async function StudioPage() {
  const session = await getSession();
  if (!session) redirect("/studio/login");
  const [draft, published, meta, history] = await Promise.all([
    getDraftContent(),
    getPublishedContent(),
    getContentMeta(),
    getHistory(),
  ]);
  return (
    <StudioApp
      initial={draft}
      publishedInitial={published}
      meta={meta}
      historyInitial={history}
      email={session.email}
    />
  );
}
