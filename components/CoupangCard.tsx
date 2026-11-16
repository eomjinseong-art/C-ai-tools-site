const COUPANG_CARD_URL = "https://link.coupang.com/a/hsdzLh1vB6";

const COPY = {
  ko: "요약은 AI가 끝냈으니, 아낀 시간엔 쿠팡 구경 한 바퀴 어떠세요?",
  cta: "쿠팡에서 보기",
};

/**
 * 본문 중간용 쿠팡 파트너스 카드 (광고). 카드 전체가 하나의 링크입니다.
 * 한 페이지에 푸터·하단 고정 배너와 합쳐 최대 2~3개까지만 사용하세요.
 */
export function CoupangCard({ className = "" }: { className?: string }) {
  return (
    <a
      href={COUPANG_CARD_URL}
      target="_blank"
      rel="sponsored noopener"
      aria-label={`광고: ${COPY.ko} — 쿠팡에서 보기 (새 창)`}
      data-coupang-card=""
      className={`block rounded-xl border border-gray-200 bg-white px-4 py-4 text-inherit no-underline transition-colors hover:border-brand-400 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-500/50 ${className}`.trim()}
    >
      <span className="flex flex-wrap items-center gap-3">
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold leading-relaxed text-gray-900 dark:text-gray-100">{COPY.ko}</span>
        </span>
        <span
          aria-hidden="true"
          className="inline-block shrink-0 rounded-full bg-[#e5322d] px-4 py-2 text-sm font-semibold whitespace-nowrap text-white"
        >
          {COPY.cta}
        </span>
      </span>
      <span className="mt-3 block text-[11px] leading-5 text-gray-400 dark:text-gray-500">
        <span className="mr-1.5 rounded border border-gray-300 px-1 py-px text-[10px] dark:border-gray-600">광고</span>
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </span>
    </a>
  );
}
