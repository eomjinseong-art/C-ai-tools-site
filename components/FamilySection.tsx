import { FAMILY_SITES } from "@/lib/family";

export default function FamilySection() {
  return (
    <section id="family" className="flex flex-col gap-3" aria-labelledby="family-title">
      <div>
        <h2 id="family-title" className="text-lg font-bold text-gray-900 dark:text-gray-100">나두 패밀리</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">나두Ai가 만든 무료 도구와 콘텐츠를 한곳에 모았어요.</p>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FAMILY_SITES.map((site) => (
          <li key={site.id}>
            <a href={site.href} target="_blank" rel="noopener" className="flex h-full flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-brand-400 dark:border-gray-800 dark:bg-gray-900">
              <span className="font-semibold text-gray-900 dark:text-gray-100">{site.name} ↗</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{site.desc}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
