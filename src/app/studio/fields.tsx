"use client";
import { useRef, useState } from "react";
import { ChevronDown, Link2, Trash2, Upload } from "lucide-react";

export const inputCls =
  "mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-[14px] text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none";

export function Field({
  label,
  value,
  max,
  required,
  hint,
  dirty,
  children,
}: {
  label: string;
  value?: string | unknown[];
  max?: number;
  required?: boolean;
  hint?: string;
  dirty?: boolean;
  children: React.ReactNode;
}) {
  const len = typeof value === "string" ? value.length : Array.isArray(value) ? value.length : undefined;
  const over = max !== undefined && len !== undefined && len > max;
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-2 text-[13px] font-semibold text-stone-800">
        <span className="flex items-center gap-1.5">
          {label}
          {required && <span className="text-red-500">*</span>}
          {dirty && (
            <span
              title="This field has unpublished edits"
              className="inline-block size-1.5 rounded-full bg-amber-500 ring-2 ring-amber-100"
            />
          )}
        </span>
        {max !== undefined && len !== undefined && (
          <span className={`shrink-0 font-normal tabular-nums text-[12px] ${over ? "text-red-500" : "text-stone-400"}`}>
            {len}/{max}
          </span>
        )}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[12px] leading-relaxed text-stone-400">{hint}</span>}
    </label>
  );
}

export function Text({
  value,
  onChange,
  max,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  max?: number;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      maxLength={max}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    />
  );
}

export function Area({
  value,
  onChange,
  max,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  max?: number;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      maxLength={max}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputCls} resize-y leading-relaxed`}
    />
  );
}

/**
 * Image field with explicit "Upload Image" or "Image Link" choice:
 * - Segmented toggle to choose between Uploading a file or Pasting an image link
 * - Upload mode: drag/browse file upload with server-side crop to aspect ratio
 * - Link mode: direct URL input with quick preview
 * - Live preview with dark background (ideal for cutouts and light assets)
 * - Source badge and quick remove button
 */
export function ImageField({
  value,
  onChange,
  aspect,
  hint,
}: {
  value: string;
  onChange: (v: string) => void;
  aspect?: string;
  hint?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const isUrl = Boolean(value && /^https?:\/\//i.test(value));
  const [mode, setMode] = useState<"upload" | "link">(isUrl ? "link" : "upload");

  const upload = async (f: File) => {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", f);
      if (aspect) form.append("aspect", aspect);
      const res = await fetch("/api/uploads", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed.");
      onChange(json.url as string);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Choice Selector: Upload Image vs Image Link */}
      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-lg border border-stone-200 bg-stone-100 p-0.5 text-[12px] font-medium">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 transition-colors ${
              mode === "upload"
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Upload size={13} />
            <span>Upload Image</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("link")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 transition-colors ${
              mode === "link"
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Link2 size={13} />
            <span>Image Link</span>
          </button>
        </div>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition"
          >
            <Trash2 size={12} />
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Mode 1: Upload File */}
      {mode === "upload" && (
        <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2 text-[13px] font-medium text-stone-700 shadow-xs hover:border-stone-400 hover:bg-stone-50 disabled:opacity-50 transition"
            >
              <Upload size={14} className="text-stone-500" />
              <span>{uploading ? "Uploading..." : "Choose Image File"}</span>
            </button>
            <span className="text-[12px] text-stone-400">PNG, JPG, WebP, SVG</span>
          </div>
          {value && value.startsWith("/uploads") && (
            <p className="mt-2 text-[11px] font-mono text-stone-500 truncate">
              Uploaded: {value}
            </p>
          )}
        </div>
      )}

      {/* Mode 2: Image Link */}
      {mode === "link" && (
        <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3 space-y-2">
          <div className="relative flex items-center">
            <Link2 size={14} className="absolute left-3 text-stone-400 pointer-events-none" />
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/... or https://..."
              className="w-full rounded-lg border border-stone-200 bg-white pl-9 pr-3 py-2 text-[13px] text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
            />
          </div>
          <p className="text-[11px] text-stone-400">
            Paste a direct URL from Unsplash, Imgur, Cloudinary, or any website.
          </p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) void upload(f);
        }}
      />

      {/* Live Preview */}
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-stone-200 bg-[#121214] p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="max-h-40 w-full rounded-lg object-contain"
          />
          <div className="mt-1.5 flex items-center justify-between px-1 text-[11px] text-stone-400">
            <span className="inline-flex items-center gap-1 font-mono truncate max-w-[80%]">
              {value.startsWith("http") ? "🔗 Direct Web Link" : "📁 Uploaded File"}
            </span>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-white transition"
              title="Open full image in new tab"
            >
              Open ↗
            </a>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-stone-300 py-3 text-center text-[12px] text-stone-400">
          No image set. Choose &ldquo;Upload Image&rdquo; or provide an &ldquo;Image Link&rdquo; above.
        </div>
      )}

      {aspect && (
        <p className="text-[11px] text-stone-400">
          Uploaded images will be auto-cropped to {aspect}.
        </p>
      )}
      {hint && <p className="text-[11px] text-stone-400">{hint}</p>}
      {error && (
        <p role="alert" className="text-[12px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function RowButtons({
  index,
  total,
  onMove,
  onDelete,
  onDuplicate,
}: {
  index: number;
  total: number;
  onMove: (dir: -1 | 1) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}) {
  const btn =
    "rounded-lg border border-stone-200 bg-white px-2 py-1 text-[12px] text-stone-500 hover:bg-stone-100 disabled:opacity-30";
  return (
    <div className="flex shrink-0 gap-1.5">
      <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => onMove(-1)} className={btn}>
        ↑
      </button>
      <button
        type="button"
        aria-label="Move down"
        disabled={index === total - 1}
        onClick={() => onMove(1)}
        className={btn}
      >
        ↓
      </button>
      {onDuplicate && (
        <button type="button" aria-label="Duplicate" onClick={onDuplicate} className={btn}>
          ⧉
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          aria-label="Delete"
          title="Delete item"
          onClick={onDelete}
          className={`${btn} hover:!bg-red-50 hover:text-red-600`}
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function move<T>(list: T[], from: number, dir: -1 | 1): T[] {
  const to = from + dir;
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}

/**
 * Collapsible list item: thumbnail + title header, full editor inside.
 * Keeps long lists (projects, services, …) scannable.
 */
export function ItemCard({
  title,
  badge,
  thumb,
  fallback,
  open,
  onToggle,
  actions,
  children,
}: {
  title: string;
  badge?: string;
  thumb?: string;
  fallback?: string;
  open: boolean;
  onToggle: () => void;
  actions: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-1 pr-2">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-2.5 py-2 text-left hover:bg-stone-50"
        >
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumb} alt="" className="size-9 shrink-0 rounded-lg border border-stone-200 object-cover" />
          ) : (
            <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-lg bg-stone-900/[0.06] font-heading text-[14px] font-bold text-stone-500">
              {(fallback ?? title).charAt(0).toUpperCase() || "•"}
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-stone-800">{title}</span>
            {badge && <span className="block truncate text-[11px] text-stone-400">{badge}</span>}
          </span>
          <ChevronDown
            size={15}
            aria-hidden
            className={`shrink-0 text-stone-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {actions}
      </div>
      {open && <div className="space-y-3 border-t border-stone-100 px-3 py-3">{children}</div>}
    </div>
  );
}
