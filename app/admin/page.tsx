import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import { logout } from "@/app/admin/actions";

export default function AdminHomePage() {
  requireAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">관리자</h1>
        <form action={logout}>
          <button type="submit" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400">
            로그아웃
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/ads"
          className="rounded-xl border border-gray-200 bg-white p-6 hover:border-brand-500 dark:border-gray-800 dark:bg-gray-900"
        >
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">광고 슬롯 관리</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            9개 슬롯의 이미지·링크·문구·활성화 여부 편집
          </p>
        </Link>
        <Link
          href="/admin/videos"
          className="rounded-xl border border-gray-200 bg-white p-6 hover:border-brand-500 dark:border-gray-800 dark:bg-gray-900"
        >
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">영상 관리</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            카테고리별 수집된 영상 확인 및 삭제
          </p>
        </Link>
        <Link
          href="/admin/keywords"
          className="rounded-xl border border-gray-200 bg-white p-6 hover:border-brand-500 dark:border-gray-800 dark:bg-gray-900"
        >
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">검색 키워드 관리</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            카테고리별 YouTube 검색 키워드 편집 (다음 수집부터 반영)
          </p>
        </Link>
      </div>
    </div>
  );
}
