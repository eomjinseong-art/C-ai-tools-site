import { GUIDE_DATA } from "@/content/guides";

export type ToolGuide = {
  slug: string;
  name: string;
  oneLiner: string;
  category: string;
  maker: string;
  pricing: { free: string; paid: string };
  korean: string;
  bestFor: string[];
  notFor: string[];
  quickStart: string[];
  tips: string[];
  alternatives: { slug: string; reason: string }[];
  faq: { q: string; a: string }[];
  keywords: string[];
};

export const GUIDE_CHECKED = "2026년 9월";

let cache: Map<string, ToolGuide> | null = null;

function load(): Map<string, ToolGuide> {
  if (cache) return cache;
  cache = new Map((GUIDE_DATA as unknown as ToolGuide[]).map((g) => [g.slug, g]));
  return cache;
}

export function getGuide(slug: string): ToolGuide | null {
  return load().get(slug) ?? null;
}

export function getAllGuides(): ToolGuide[] {
  return [...load().values()];
}

export const SITUATIONS: { title: string; desc: string; slugs: string[] }[] = [
  { title: "글쓰기·질문하기", desc: "기획서, 메일, 요약, 아이디어", slugs: ["chatgpt", "claude", "gemini"] },
  { title: "자료 조사", desc: "출처 있는 검색과 문서 정리", slugs: ["perplexity", "genspark", "notebooklm"] },
  { title: "발표자료 만들기", desc: "슬라이드를 몇 분 만에", slugs: ["gamma", "canva"] },
  { title: "이미지 만들기", desc: "썸네일, 일러스트, 사진 편집", slugs: ["midjourney", "adobe-firefly", "canva"] },
  { title: "AI 영상 만들기", desc: "글이나 사진으로 영상 생성", slugs: ["runway", "kling", "veo", "seedance"] },
  { title: "쇼츠 편집·자막", desc: "컷 편집과 자동 자막", slugs: ["capcut", "vrew"] },
  { title: "목소리·음악", desc: "내레이션, 더빙, 배경음악", slugs: ["elevenlabs", "typecast", "suno"] },
  { title: "코딩·앱 만들기", desc: "코드 작성부터 웹앱까지", slugs: ["cursor", "github-copilot", "lovable"] },
];
