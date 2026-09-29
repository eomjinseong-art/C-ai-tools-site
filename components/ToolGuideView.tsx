import Link from "next/link";
import { GUIDE_CHECKED, getGuide, type ToolGuide } from "@/lib/guides";
import { TOOL_SITE_URLS } from "@/lib/toolSites";

function List({ title, items, ordered }: { title: string; items: string[]; ordered?: boolean }) {
  if (!items?.length) return null;
  const Tag = ordered ? "ol" : "ul";
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold text-gray-900 dark:text-gray-100">{title}</h3>
      <Tag className={`${ordered ? "list-decimal" : "list-disc"} space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300`}>
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </Tag>
    </div>
  );
}

export default function ToolGuideView({ guide }: { guide: ToolGuide }) {
  const site = TOOL_SITE_URLS[guide.slug];
  return (
    <article className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7 dark:border-gray-800 dark:bg-gray-900">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-brand-600 dark:text-brand-500">{guide.category} · {guide.maker}</p>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">{guide.name} 사용법 총정리</h1>
        <p className="text-gray-600 dark:text-gray-300">{guide.oneLiner}</p>
        {site && (
          <a href={site} target="_blank" rel="noopener nofollow" className="w-fit rounded-full bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-700">
            {guide.name} 바로가기 ↗
          </a>
        )}
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
          <p className="text-xs font-bold text-gray-500">무료로 되는 것</p>
          <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">{guide.pricing.free}</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
          <p className="text-xs font-bold text-gray-500">유료 플랜</p>
          <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">{guide.pricing.paid}</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
          <p className="text-xs font-bold text-gray-500">한국어</p>
          <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">{guide.korean}</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <List title="이럴 때 쓰세요" items={guide.bestFor} />
        <List title="이럴 땐 다른 도구가 나아요" items={guide.notFor} />
        <List title="시작하는 3단계" items={guide.quickStart} ordered />
        <List title="실전 팁" items={guide.tips} />
      </div>

      {guide.alternatives?.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-bold text-gray-900 dark:text-gray-100">비슷한 도구</h3>
          <ul className="flex flex-col gap-2">
            {guide.alternatives.map((a) => (
              <li key={a.slug} className="text-sm text-gray-700 dark:text-gray-300">
                <Link href={`/category/${a.slug}`} prefetch={false} className="font-semibold text-brand-600 hover:underline dark:text-brand-500">
                  {getGuide(a.slug)?.name ?? a.slug}
                </Link>{" "}
                — {a.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {guide.faq?.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-bold text-gray-900 dark:text-gray-100">자주 묻는 질문</h3>
          <dl className="flex flex-col gap-3">
            {guide.faq.map((f) => (
              <div key={f.q}>
                <dt className="text-sm font-semibold text-gray-900 dark:text-gray-100">Q. {f.q}</dt>
                <dd className="mt-1 text-sm text-gray-600 dark:text-gray-300">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <p className="text-xs text-gray-400">{GUIDE_CHECKED} 기준으로 정리했어요. 가격과 기능은 바뀔 수 있으니 공식 사이트에서 한 번 더 확인해 주세요.</p>
    </article>
  );
}

export function guideJsonLd(guide: ToolGuide, url: string) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${guide.name} 사용법 총정리`,
      description: guide.oneLiner,
      inLanguage: "ko",
      mainEntityOfPage: url,
      about: { "@type": "SoftwareApplication", name: guide.name, applicationCategory: guide.category, publisher: guide.maker },
      author: { "@type": "Organization", name: "나두AI" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];
}
