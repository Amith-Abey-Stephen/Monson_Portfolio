import { getSession } from "@/lib/auth";
import { getDraftContent } from "@/lib/content";
import { PreviewRenderer } from "./PreviewRenderer";

export const dynamic = "force-dynamic";

export default async function StudioPreviewPage() {
  const session = await getSession();
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070708] font-mono text-sm text-stone-500">
        Unauthorized preview session
      </div>
    );
  }

  const initialDraft = await getDraftContent();
  return <PreviewRenderer initialContent={initialDraft} />;
}
