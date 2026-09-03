"use client";

import { useEffect, useState } from "react";
import { recordVisit } from "@/app/actions/stats";

const STORAGE_KEY = "nadu_visit_count";
const VISITED_KEY = "nadu_visit_counted";

export default function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    function readCached(): number | null {
      try {
        const cached = sessionStorage.getItem(STORAGE_KEY);
        if (cached) return Number(cached);
      } catch {
        // ignore
      }
      return null;
    }

    const cached = readCached();
    if (cached) {
      setCount(cached);
      return;
    }

    const run = async () => {
      try {
        if (sessionStorage.getItem(VISITED_KEY)) {
          const again = readCached();
          if (again && !cancelled) setCount(again);
          return;
        }
        sessionStorage.setItem(VISITED_KEY, "1");
      } catch {
        // still try to increment once this mount
      }

      const next = await recordVisit();
      if (cancelled || next == null) return;
      try {
        sessionStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      setCount(next);
    };

    const id = window.setTimeout(() => {
      void run();
    }, 800);

    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  if (count === null) return null;

  return (
    <span className="text-xs text-gray-400 dark:text-gray-500" title="누적 방문자 수">
      👁 {count.toLocaleString("ko-KR")}
    </span>
  );
}
