import { saveAd } from "@/app/admin/ads/actions";
import type { Ad, AdPlacement } from "@/lib/types";

const PLACEMENT_LABELS: Record<AdPlacement, string> = {
  home_top: "홈 상단",
  home_bottom: "홈 하단",
  category_sidebar: "카테고리 사이드바 (구버전, 미사용)",
  category_sidebar_1: "요약 패널 광고 1",
  category_sidebar_2: "요약 패널 광고 2",
  category_sidebar_3: "요약 패널 광고 3",
  category_sidebar_4: "요약 패널 광고 4",
  video_inline: "영상 재생창 하단 (요약 패널)",
  video_list_bottom: "영상 리스트 하단 (10개 목록 아래)",
  guidebook_footer: "홈 캐러셀 상단",
};

export default function AdEditForm({ placement, ad }: { placement: AdPlacement; ad: Ad | null }) {
  return (
    <form
      action={saveAd}
      className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
    >
      <input type="hidden" name="placement" value={placement} />
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{PLACEMENT_LABELS[placement]}</h3>

      <label className="text-xs text-gray-500 dark:text-gray-400">이름/문구</label>
      <input
        name="name"
        defaultValue={ad?.name ?? ""}
        placeholder="예: 8월 프로모션 배너"
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
      />

      <label className="text-xs text-gray-500 dark:text-gray-400">이미지 URL</label>
      <input
        name="image_url"
        defaultValue={ad?.image_url ?? ""}
        placeholder="https://..."
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
      />

      <label className="text-xs text-gray-500 dark:text-gray-400">링크 URL</label>
      <input
        name="link_url"
        defaultValue={ad?.link_url ?? ""}
        placeholder="https://..."
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
      />

      <label className="text-xs text-gray-500 dark:text-gray-400">대체 텍스트</label>
      <input
        name="alt_text"
        defaultValue={ad?.alt_text ?? ""}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
      />

      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input type="checkbox" name="is_active" defaultChecked={ad?.is_active ?? false} />
        활성화
      </label>

      <button
        type="submit"
        className="mt-1 w-fit rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
      >
        저장
      </button>
    </form>
  );
}
