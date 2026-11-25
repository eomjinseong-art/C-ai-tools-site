export type SourceCue = { text: string; offsetSeconds: number };

export type SummaryInput = {
  title: string;
  summary?: string | null;
  summary_points?: unknown;
  hook?: string | null;
  takeaway?: string | null;
  tool_features?: unknown;
  summary_source?: string | null;
  summary_generated_at?: string | null;
  summary_verified_at?: string | null;
  source_cues?: unknown;
  useful_facts?: unknown;
  costs?: string | null;
  limitations?: string | null;
  youtube_id?: string | null;
};

export type SummaryView =
  | { state: "pending" }
  | {
      state: "shown";
      label: string;
      summary: string;
      points: string[];
      hook: string;
      takeaway: string;
      features: string[];
      facts: string[];
      costs: string;
      limitations: string;
      cues: { text: string; offsetSeconds: number; href: string | null }[];
      generatedAt: string | null;
      verifiedAt: string | null;
    };

const PROMO =
  /신청|구독해|구독과|구독\s*부탁|알림\s*설정|라이브\s*예정|오픈\s*카톡|오픈채팅|쿠폰|선착순|회원가입|신청링크|바로가기\s*링크/u;

function compact(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/\bwww\.\S+/gi, " ")
    .replace(/[\s\p{P}\p{S}]+/gu, "")
    .toLowerCase();
}

export function summaryFailsQuality(input: {
  title: string;
  summary: string;
  summaryPoints?: string[];
  hook?: string;
  takeaway?: string;
}): boolean {
  const summary = input.summary.trim();
  const folded = compact(summary);
  const title = compact(input.title);
  if (!summary || folded.length < 40) return true;
  if (title.length >= 8 && (folded === title || (folded.includes(title) && folded.length <= title.length + 8))) return true;
  if (PROMO.test(summary) || PROMO.test(input.hook ?? "") || PROMO.test(input.takeaway ?? "")) return true;
  const lines = [summary, input.hook ?? "", input.takeaway ?? "", ...(input.summaryPoints ?? [])]
    .map((line) => compact(line))
    .filter(Boolean);
  if (lines.length >= 2 && lines.every((line) => line === lines[0])) return true;
  return false;
}

function textList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function cues(input: SummaryInput): { text: string; offsetSeconds: number; href: string | null }[] {
  if (!Array.isArray(input.source_cues)) return [];
  return input.source_cues.flatMap((cue) => {
    if (!cue || typeof cue.text !== "string" || typeof cue.offsetSeconds !== "number" || cue.offsetSeconds < 0) return [];
    const href = input.youtube_id
      ? `https://www.youtube.com/watch?v=${encodeURIComponent(input.youtube_id)}&t=${Math.round(cue.offsetSeconds)}s`
      : null;
    return [{ text: cue.text, offsetSeconds: Math.round(cue.offsetSeconds), href }];
  });
}

export function presentSummary(input: SummaryInput): SummaryView {
  const summary = input.summary?.trim() ?? "";
  const points = textList(input.summary_points);
  const hook = input.hook?.trim() ?? "";
  const takeaway = input.takeaway?.trim() ?? "";
  if (summaryFailsQuality({ title: input.title, summary, summaryPoints: points, hook, takeaway })) {
    return { state: "pending" };
  }
  const source = input.summary_source;
  const label =
    source === "reviewed" && input.summary_verified_at
      ? "검토된 요약"
      : source === "transcript"
        ? "자막 발췌"
        : source === "description"
          ? "설명 발췌"
          : "저장된 요약";
  return {
    state: "shown",
    label,
    summary,
    points,
    hook,
    takeaway,
    features: textList(input.tool_features),
    facts: textList(input.useful_facts),
    costs: input.costs?.trim() ?? "",
    limitations: input.limitations?.trim() ?? "",
    cues: cues(input),
    generatedAt: input.summary_generated_at ?? null,
    verifiedAt: input.summary_verified_at ?? null,
  };
}
