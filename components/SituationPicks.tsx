import Link from "next/link";
import { SITUATIONS, getGuide } from "@/lib/guides";

export default function SituationPicks() {
  return (
    <section id="situations" className="flex flex-col gap-3" aria-labelledby="situations-title">
      <div>
        <h2 id="situations-title" className="text-lg font-bold text-gray-900 dark:text-gray-100">뭘 하고 싶으세요?</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">하고 싶은 일을 고르면 맞는 AI 도구를 바로 보여드려요.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SITUATIONS.map((s) => (
          <div key={s.title} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-gray-100">{s.title}</p>
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">{s.desc}</p>
            <div className="flex flex-wrap gap-2">
              {s.slugs.map((slug) => {
                const g = getGuide(slug);
                return (
                  <Link key={slug} href={`/category/${slug}`} prefetch={false} className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-500">
                    {g?.name ?? slug}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
