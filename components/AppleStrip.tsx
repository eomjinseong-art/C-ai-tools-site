// 애플 비교노트 추천 띠 (자체 사이트 연결). 연결 페이지에 네이버 쇼핑 커넥트 링크가 있어 고지를 함께 표시한다.
const APPLE_URL =
  "https://apple-compare-note.vercel.app/mac?utm_source=nadoo-ai&utm_medium=strip&utm_campaign=apple";

export function AppleStrip() {
  return (
    <aside aria-label="추천" data-apple-strip="" className="mb-6">
      <a
        href={APPLE_URL}
        target="_blank"
        rel="noopener"
        className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 no-underline transition-colors hover:border-brand-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-brand-500/50"
      >
        <span className="shrink-0 rounded border border-gray-300 px-1.5 py-0.5 text-[10px] text-gray-500 dark:border-gray-600 dark:text-gray-400">추천</span>
        <span className="min-w-0 flex-1 font-semibold">AI 작업에 좋은 맥북·아이패드, 모델별 비교 보기</span>
        <span aria-hidden="true" className="shrink-0 rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white dark:bg-gray-100 dark:text-gray-900">비교노트 열기 →</span>
      </a>
      <p className="mt-1.5 text-[11px] leading-5 text-gray-400 dark:text-gray-500">
        연결 페이지에 네이버 쇼핑 커넥트 링크가 있으며, 네이버 쇼핑 커넥트 활동의 일환으로 수수료를 제공받을 수 있습니다.
      </p>
    </aside>
  );
}
