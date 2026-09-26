"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export const inputCls =
  "mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-[14px] text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none";

export function Field({
  label,
  value,
  max,
  required,
  hint,
  children,
}: {
  label: string;
  value?: string | unknown[];
  max?: number;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  const len = typeof value === "string" ? value.length : Array.isArray(value) ? value.length : undefined;
  const over = max !== undefined && len !== undefined && len > max;
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-2 text-[13px] font-semibold text-stone-800">
        <span>
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
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
 * Image field: URL editing + upload with server-side cover-crop to
 * the component's aspect ratio, live preview, replace/remove.
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
    <div>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="preview"
          className="mb-2 max-h-40 w-full rounded-xl border border-stone-200 bg-stone-100 object-contain"
        />
      ) : (
        <p className="mb-2 rounded-xl border border-dashed border-stone-300 px-3 py-4 text-center text-[13px] text-stone-400">
          Nothing here yet — upload or paste an image URL.
        </p>
      )}
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or /uploads/…"
          className={`${inputCls} mt-0 flex-1`}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="shrink-0 rounded-full border border-stone-200 bg-white px-4 text-[13px] font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-50"
        >
          {uploading ? "…" : "Upload"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 rounded-full border border-stone-200 bg-white px-4 text-[13px] text-stone-500 hover:bg-stone-100"
          >
            Remove
          </button>
        )}
      </div>
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
      {aspect && (
        <p className="mt-1 text-[12px] text-stone-400">
          Saved images are cropped to {aspect} to match the site design.
        </p>
      )}
      {hint && <p className="mt-1 text-[12px] text-stone-400">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 text-[12px] text-red-600">
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
