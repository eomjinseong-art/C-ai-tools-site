export type FamilySite = { id: string; name: string; desc: string; href: string };

const UTM = "utm_source=nadoo-ai&utm_medium=hub&utm_campaign=family";
const withUtm = (href: string) => `${href}${href.includes("?") ? "&" : "?"}${UTM}`;

export const FAMILY_SITES: FamilySite[] = [
  { id: "carousel", name: "나두Ai 캐러셀", desc: "하루 4번, 새 AI 소식을 슬라이드로 정리", href: withUtm("https://nadoo-carousel.vercel.app/") },
  { id: "automation", name: "나두 오토메이션", desc: "반복 업무를 AI로 자동화하는 방법", href: withUtm("https://nadoo-automation.vercel.app/") },
  { id: "pdf", name: "나두 PDF 변환기", desc: "설치 없이 브라우저에서 PDF 합치기·변환", href: withUtm("https://stirlingpdf-one.vercel.app/") },
  { id: "tablink", name: "나두 탭 링크", desc: "열어 둔 탭을 링크 하나로 저장·공유", href: withUtm("https://tablinkyo.vercel.app/") },
  { id: "lab", name: "나두 Ai 랩", desc: "새 AI 기능을 직접 써 보는 실험실", href: withUtm("https://nadoo-ai-lab.vercel.app/") },
  { id: "atlas", name: "Ai 툴스 아틀라스", desc: "분야별 AI 도구를 한 장의 지도로", href: withUtm("https://nadoo-ai-autom.vercel.app/") },
  { id: "ebook", name: "나두Ai 전자책모음", desc: "AI 입문자를 위한 전자책", href: withUtm("https://tinalinkeom.vercel.app/ebook") },
];

// Hosts allowed in ad slots: only 나두 family sites (unrelated shopping ads are hidden).
export const FAMILY_HOSTS = [
  "ai-tools-site-liart-one.vercel.app",
  "nadoo-carousel.vercel.app",
  "nadoo-automation.vercel.app",
  "stirlingpdf-one.vercel.app",
  "tablinkyo.vercel.app",
  "nadoo-ai-lab.vercel.app",
  "nadoo-ai-autom.vercel.app",
  "tinalinkeom.vercel.app",
];

export function isFamilyUrl(url: string): boolean {
  try {
    return FAMILY_HOSTS.includes(new URL(url).host);
  } catch {
    return false;
  }
}
