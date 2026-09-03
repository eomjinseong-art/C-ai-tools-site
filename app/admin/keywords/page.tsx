import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { saveKeywords } from "@/app/admin/keywords/actions";

export default async function AdminKeywordsPage() {
  requireAdmin();

  const { data: categories } = await supabaseAdmin
    .from("categories")
    .select("id, name, search_keywords, is_trend")
    .order("sort_order");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400">
          ← 관리자
        </Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">검색 키워드 관리</h1>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        쉼표(,)로 구분해서 입력하세요. 비워 저장하면 키워드가 삭제됩니다. 다음 수집기
        실행부터 반영됩니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(categories ?? []).map((category) => (
          <form
            key={category.id}
            action={saveKeywords}
            className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <input type="hidden" name="category_id" value={category.id} />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {category.name}
              {category.is_trend && (
                <span className="ml-1.5 rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  트렌드
                </span>
              )}
            </h3>
            <textarea
              name="keywords"
              defaultValue={(category.search_keywords ?? []).join(", ")}
              rows={2}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
            <button
              type="submit"
              className="w-fit rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              저장
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
