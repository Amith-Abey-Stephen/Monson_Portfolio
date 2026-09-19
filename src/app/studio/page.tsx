import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getContentMeta, getDraftContent } from "@/lib/content";
import { StudioApp } from "./StudioApp";

export const dynamic = "force-dynamic";
export const metadata = { title: "Studio", robots: "noindex, nofollow" };

export default async function StudioPage() {
  const session = await getSession();
  if (!session) redirect("/studio/login");
  const [draft, meta] = await Promise.all([getDraftContent(), getContentMeta()]);
  return <StudioApp initial={draft} meta={meta} email={session.email} />;
}
