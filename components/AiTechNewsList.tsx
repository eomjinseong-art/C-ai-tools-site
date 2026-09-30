"use client";

import { useEffect, useRef, useState } from "react";

export type NewsItem = {
  date: string;
  topic: string;
  text: string | null;
  sources: string[];
  tags: string[];
  title_ko?: string;
  summary_ko?: string;
  points_ko?: string[];
};

function fmtDate(iso: string) {
  return iso.slice(5, 10).replace("-", ".");
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default function AiTechNewsList({ items, newsPage }: { items: NewsItem[]; newsPage: string }) {
  const [open, setOpen] = useState<NewsItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <li key={item.date + i}>
            <button
              type="button"
              onClick={() => setOpen(item)}
              className="group flex w-full items-start gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-left shadow-sm transition hover:border-brand-500/60 hover:bg-brand-50/40 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-brand-500/5"
            >
              <span className="mt-0.5 shrink-0 text-[11px] tabular-nums text-gray-400">{fmtDate(item.date)}</span>
              <span className="line-clamp-2 text-sm font-medium leading-snug text-gray-900 group-hover:text-brand-700 dark:text-gray-100 dark:group-hover:text-brand-500">
                {item.title_ko || item.topic}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(null);
        }}
        className="w-[min(92vw,34rem)] rounded-2xl border border-gray-200 bg-white p-0 text-left shadow-xl backdrop:bg-black/50 dark:border-gray-800 dark:bg-gray-900"
        aria-labelledby="ai-news-dialog-title"
      >
        {open && (
          <div className="flex max-h-[80vh] flex-col overflow-y-auto p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs text-gray-400">{open.date.slice(0, 10).replace(/-/g, ".")} · AI 테크 소식</p>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="닫기"
                className="-mr-1 -mt-1 rounded-full px-2 text-lg leading-none text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
            <h3 id="ai-news-dialog-title" className="mt-1 text-base font-bold leading-snug text-gray-900 dark:text-gray-100">
              {open.title_ko || open.topic}
            </h3>
            {open.summary_ko ? (
              <p className="mt-3 text-sm leading-7 text-gray-700 dark:text-gray-300">{open.summary_ko}</p>
            ) : (
              open.text && <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-700 dark:text-gray-300">{open.text}</p>
            )}
            {open.points_ko && open.points_ko.length > 0 && (
              <div className="mt-4 rounded-xl bg-brand-50 px-4 py-3 dark:bg-brand-500/10">
                <p className="text-xs font-bold text-brand-700 dark:text-brand-500">핵심 포인트</p>
                <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[13px] leading-6 text-gray-800 dark:text-gray-200">
                  {open.points_ko.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-3 text-xs dark:border-gray-800">
              <a href={newsPage} target="_blank" rel="noopener" className="font-semibold text-brand-600 hover:underline dark:text-brand-500">
                AI 소식 전체 보기 →
              </a>
              {open.sources[0] && (
                <a href={open.sources[0]} target="_blank" rel="noopener noreferrer nofollow" className="text-gray-400 hover:text-gray-600 hover:underline dark:hover:text-gray-300">
                  원문 보기{hostOf(open.sources[0]) ? ` · ${hostOf(open.sources[0])}` : ""} ↗
                </a>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
