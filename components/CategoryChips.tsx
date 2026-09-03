import Link from "next/link";
import type { Category } from "@/lib/types";

export default function CategoryChips({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <nav className="flex flex-wrap gap-2" aria-label="카테고리">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          prefetch={false}
          className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-brand-400 hover:text-brand-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
        >
          {category.name}
          {category.is_trend && (
            <span className="ml-1.5 text-[10px] font-semibold text-brand-600 dark:text-brand-400">
              트렌드
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}
