import Link from "next/link";
import type { CategoryPreview } from "@/lib/types";

export default function CategoryChips({ categories }: { categories: CategoryPreview[] }) {
  if (categories.length === 0) return null;

  return (
    <nav
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      aria-label="카테고리"
    >
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          prefetch={false}
          className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-500"
        >
          <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
            {category.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={category.cover_url}
                alt=""
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-gray-400 dark:text-gray-500">
                {category.name.slice(0, 1)}
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-2.5 pb-2 pt-8">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
                <span className="truncate">{category.name}</span>
                {category.is_trend && (
                  <span className="shrink-0 rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-semibold">
                    트렌드
                  </span>
                )}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </nav>
  );
}
