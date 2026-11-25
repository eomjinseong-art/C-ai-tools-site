import assert from "node:assert/strict";
import test from "node:test";
import { presentSummary } from "./summaryPresentation";

test("promo and title copy are not labeled as a summary", () => {
  const promo = presentSummary({
    title: "챗GPT 강의",
    summary: "🎓 무료 3시간 AI 특강 | 12월 라이브 예정 오늘 본 편집기·프로그램·자동화, 상상하는 모든 걸 처음부터 같이 만들어 봅시다! ▶️신청링크",
    hook: "신청링크",
    takeaway: "신청링크",
    summary_points: ["신청링크"],
  });
  assert.equal(promo.state, "pending");

  const title = "브루(Vrew)를 활용한 쉽고 편한 유튜브 영상편집 - 01차시 : 프로젝트 만들기";
  const copied = presentSummary({ title, summary: title, summary_points: [title], hook: title, takeaway: title });
  assert.equal(copied.state, "pending");
});

test("a reviewed summary keeps its source label and only real caption links", () => {
  const shown = presentSummary({
    title: "보고서 초안",
    youtube_id: "abcdefghijk",
    summary: "자료를 붙인 뒤 문단 순서를 먼저 고칩니다. 마지막에는 날짜와 숫자를 원본 문서와 한 번씩 비교합니다.",
    summary_points: ["자료를 먼저 붙입니다", "숫자는 원문과 비교합니다"],
    summary_source: "reviewed",
    summary_verified_at: "2026-11-06T00:00:00.000Z",
    source_cues: [{ text: "자료를 붙이는 화면", offsetSeconds: 95 }],
    costs: "무료 화면과 유료 화면을 구분해서 보여 줍니다.",
  });
  assert.equal(shown.state, "shown");
  if (shown.state === "shown") {
    assert.equal(shown.label, "검토된 요약");
    assert.equal(shown.label.includes("AI 요약"), false);
    assert.equal(shown.cues[0]?.href, "https://www.youtube.com/watch?v=abcdefghijk&t=95s");
    assert.equal(shown.costs.includes("무료"), true);
  }
});

test("provenance labels stay honest before and after the extra columns exist", () => {
  const body = "화면에서 파일을 열고 문단 순서를 바꾼 다음, 마지막에 날짜와 숫자를 원본 문서와 한 번씩 비교합니다.";
  const stored = presentSummary({ title: "짧은 제목", summary: body });
  const description = presentSummary({ title: "짧은 제목", summary: body, summary_source: "description" });
  const transcript = presentSummary({ title: "짧은 제목", summary: body, summary_source: "transcript" });
  const unverified = presentSummary({ title: "짧은 제목", summary: body, summary_source: "reviewed" });
  assert.equal(stored.state, "shown");
  assert.equal(description.state, "shown");
  assert.equal(transcript.state, "shown");
  assert.equal(unverified.state, "shown");
  if (stored.state === "shown") assert.equal(stored.label, "저장된 요약");
  if (description.state === "shown") assert.equal(description.label, "설명 발췌");
  if (transcript.state === "shown") assert.equal(transcript.label, "자막 발췌");
  if (unverified.state === "shown") assert.equal(unverified.label, "저장된 요약");
  for (const view of [stored, description, transcript, unverified]) {
    if (view.state === "shown") assert.equal(view.label.includes("AI 요약"), false);
  }

  const short = presentSummary({ title: "짧은 제목", summary: "너무 짧은 문장입니다." });
  assert.equal(short.state, "pending");
  const messy = presentSummary({
    title: "짧은 제목",
    summary: body,
    useful_facts: "not-a-list",
    tool_features: { nope: true },
  });
  assert.equal(messy.state, "shown");
  if (messy.state === "shown") {
    assert.deepEqual(messy.facts, []);
    assert.deepEqual(messy.features, []);
  }
});
