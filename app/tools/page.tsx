import type { Metadata } from "next";
import Link from "next/link";
import { getAllGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "AI 도구 30개 한눈에 비교 (가격·한국어·용도)",
  description: "챗GPT, 클로드, 제미나이, 캔바, 미드저니, 런웨이 등 인기 AI 도구 30개를 용도, 무료 범위, 한국어 지원으로 한눈에 비교하세요.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  const guides = getAllGuides();
  const groups = new Map<string, typeof guides>();
  for (const g of guides) {
    const key = g.category || "기타";
    groups.set(key, [...(groups.get(key) ?? []), g]);
  }
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">AI 도구 30개 한눈에 보기</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">용도별로 묶었어요. 이름을 누르면 가격, 한국어 지원, 시작하는 법까지 볼 수 있어요.</p>
      </header>
      {[...groups.entries()].map(([cat, list]) => (
        <section key={cat} className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{cat}</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((g) => (
              <li key={g.slug}>
                <Link href={`/category/${g.slug}`} className="flex h-full flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4 hover:border-brand-400 dark:border-gray-800 dark:bg-gray-900">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{g.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{g.oneLiner}</span>
                  <span className="mt-1 text-xs text-gray-400">무료: {g.pricing.free}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
