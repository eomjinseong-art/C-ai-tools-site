"use client";

import { useEffect, useRef, useState } from "react";

const COUPANG_URL = "https://link.coupang.com/a/hsdzLh1vB6";
const STORAGE_KEY = "coupang-sticky-dismissed";
const DISCLOSURE =
  "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";

/**
 * 화면 하단 고정 쿠팡 파트너스 배너 (광고).
 * 닫으면 localStorage에 기억하고, 열린 동안 body에 배너 높이만큼 padding을 넣어
 * 본문이 가려지지 않게 합니다.
 */
export function CoupangSticky({
  copy = "지금 필요한 건 쿠팡에서 바로 확인해 보세요",
}: {
  copy?: string;
}) {
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) !== "1") setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.body;
    const prev = root.style.paddingBottom;
    const apply = () => {
      const height = barRef.current?.offsetHeight ?? 0;
      root.style.paddingBottom = `${height}px`;
    };
    apply();
    const observer = new ResizeObserver(apply);
    if (barRef.current) observer.observe(barRef.current);
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
      root.style.paddingBottom = prev;
    };
  }, [open]);

  if (!open) return null;

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  return (
    <aside
      ref={barRef}
      aria-label="광고"
      data-coupang-sticky=""
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        boxSizing: "border-box",
        padding: "0.55rem 0.75rem calc(0.55rem + env(safe-area-inset-bottom, 0px))",
        background: "rgba(20, 20, 20, 0.96)",
        color: "#f5f5f5",
        borderTop: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 -8px 24px rgba(0,0,0,0.28)",
      }}
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
        }}
      >
        <a
          href={COUPANG_URL}
          target="_blank"
          rel="sponsored noopener"
          aria-label={`광고: ${copy} — 쿠팡에서 보기 (새 창)`}
          style={{
            flex: "1 1 auto",
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              flexShrink: 0,
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: 4,
              padding: "0 0.35rem",
              fontSize: 10,
              letterSpacing: "0.04em",
            }}
          >
            광고
          </span>
          <span
            style={{
              flex: "1 1 auto",
              minWidth: 0,
              fontSize: 13,
              lineHeight: 1.4,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {copy}
          </span>
          <span
            aria-hidden="true"
            style={{
              flexShrink: 0,
              background: "#e5322d",
              color: "#fff",
              borderRadius: 999,
              padding: "0.35rem 0.8rem",
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            쿠팡에서 보기
          </span>
        </a>
        <button
          type="button"
          onClick={dismiss}
          aria-label="광고 닫기"
          style={{
            flexShrink: 0,
            width: 36,
            height: 36,
            border: 0,
            borderRadius: 8,
            background: "transparent",
            color: "#f5f5f5",
            fontSize: 22,
            lineHeight: 1,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>
      <p
        style={{
          maxWidth: "72rem",
          margin: "0.3rem auto 0",
          fontSize: 10,
          lineHeight: 1.45,
          opacity: 0.65,
        }}
      >
        {DISCLOSURE}
      </p>
    </aside>
  );
}
