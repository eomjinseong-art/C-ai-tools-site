export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-tools-site-liart-one.vercel.app";

export const SITE_NAME = "나두AI";

export const SITE_TITLE = "나두AI - AI 도구 30개 사용법·가격·비교 한국어 가이드";

export const SITE_DESCRIPTION =
  "챗GPT, 클로드, 제미나이, 캔바, 런웨이 등 인기 AI 도구 30개의 가격, 한국어 지원, 쓰는 법을 한국어로 정리했어요. 상황별 추천과 매일 새 AI 캐러셀까지 나두AI에서 확인하세요.";

export const SITE_OG_IMAGE = "/og.png";

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "ko",
};
