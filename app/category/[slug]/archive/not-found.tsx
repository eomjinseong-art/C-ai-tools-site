import Link from "next/link";

export default function ArchiveNotFound() {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
      <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">보관 페이지를 찾을 수 없습니다</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">없는 도구이거나 주소가 바뀌었습니다.</p>
      <Link href="/tools" className="mt-4 inline-block text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
        도구 목록
      </Link>
    </div>
  );
}
