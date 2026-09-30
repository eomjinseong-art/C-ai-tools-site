const COUPANG_PARTNERS_URL = "https://link.coupang.com/a/hsdzLh1vB6";

/** 하단 쿠팡 파트너스 배너 (광고). 링크는 수익 추적용이므로 수정하지 마세요. */
export function CoupangBanner({ className = "" }: { className?: string }) {
  return (
    <aside aria-label="광고" className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 ${className}`}>
      <a
        href={COUPANG_PARTNERS_URL}
        target="_blank"
        rel="sponsored noopener noreferrer nofollow"
        className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 transition-colors hover:border-brand-500 hover:text-brand-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:text-brand-500"
      >
        <span className="shrink-0 rounded border border-gray-300 px-1.5 py-0.5 text-[10px] text-gray-500 dark:border-gray-700 dark:text-gray-400">
          광고
        </span>
        <span className="min-w-0 flex-1">요약은 AI가 끝냈으니, 아낀 시간엔 쿠팡 구경 한 바퀴 어떠세요?</span>
        <span aria-hidden="true" className="shrink-0 text-brand-600 dark:text-brand-500">
          →
        </span>
      </a>
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        이 게시물은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </aside>
  );
}
