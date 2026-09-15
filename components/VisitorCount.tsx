"use client";

import { useEffect, useState } from "react";

const ABACUS_BASE = "https://abacus.jasoncameron.dev";
const NAMESPACE = "c-ai-tools-site";
const KEY = "visits";
const VISITED_DATE_KEY = "abacus_visit_date";

function todayLocal(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseCount(payload: unknown): number | null {
  if (!payload || typeof payload !== "object" || !("value" in payload)) return null;
  const raw = (payload as { value: unknown }).value;
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(n) ? n : null;
}

export default function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const today = todayLocal();
        let alreadyHit = false;
        try {
          alreadyHit = localStorage.getItem(VISITED_DATE_KEY) === today;
          if (!alreadyHit) localStorage.setItem(VISITED_DATE_KEY, today);
        } catch {
          // still attempt a one-time /hit this mount
        }

        const action = alreadyHit ? "get" : "hit";
        const res = await fetch(`${ABACUS_BASE}/${action}/${NAMESPACE}/${KEY}`);
        if (!res.ok) return;
        const value = parseCount(await res.json());
        if (cancelled || value == null) return;
        setCount(value);
      } catch {
        // hide on failure
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null) return null;

  return (
    <span className="text-xs text-gray-400 dark:text-gray-500">
      👁 {count.toLocaleString("ko-KR")}
    </span>
  );
}
