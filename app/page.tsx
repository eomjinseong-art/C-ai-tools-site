import { supabase } from "@/lib/supabase";
import type { Category, Video } from "@/lib/types";
import AdBanner from "@/components/AdBanner";
import TopCarousel, { type CarouselVideo } from "@/components/TopCarousel";
import CategoryMenu from "@/components/CategoryMenu";
import VideoCard from "@/components/VideoCard";
import SummaryPanel from "@/components/SummaryPanel";

type SearchVideo = Video & { category_slug: string; category_name: string };

// Official site for each AI tool's category, shown as a "바로가기" link next to
// the category title. AI 트렌드 has no single tool, so it's intentionally absent.
const TOOL_SITE_URLS: Record<string, string> = {
  chatgpt: "https://chat.openai.com",
  claude: "https://claude.ai",
  gemini: "https://gemini.google.com",
  perplexity: "https://www.perplexity.ai",
  wrtn: "https://wrtn.ai",
  canva: "https://www.canva.com",
  midjourney: "https://www.midjourney.com",
  runway: "https://runwayml.com",
  higgsfield: "https://higgsfield.ai",
  seedance: "https://dreamina.capcut.com/seedance",
  kling: "https://klingai.com",
  capcut: "https://www.capcut.com",
  vrew: "https://vrew.voyagerx.com",
  suno: "https://suno.com",
  elevenlabs: "https://elevenlabs.io",
  heygen: "https://www.heygen.com",
  "notion-ai": "https://www.notion.com/product/ai",
  figma: "https://www.figma.com",
  cursor: "https://www.cursor.com",
  gamma: "https://gamma.app",
  notebooklm: "https://notebooklm.google",
  "clova-x": "https://clova-x.naver.com",
  "github-copilot": "https://github.com/features/copilot",
  lovable: "https://lovable.dev",
  "adobe-firefly": "https://firefly.adobe.com",
  veo: "https://deepmind.google/technologies/veo",
  typecast: "https://typecast.ai",
  grok: "https://grok.com",
  genspark: "https://www.genspark.ai",
};

async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("click_count", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load categories", error);
    return [];
  }
  const categories = (data ?? []) as Category[];
  // AI 트렌드 is a rotating catch-all, not a single tool — pin it last regardless
  // of click_count so it doesn't jump around the menu as it gets popular.
  return [...categories.filter((c) => !c.is_trend), ...categories.filter((c) => c.is_trend)];
}

async function getVideosForCategory(categoryId: string): Promise<Video[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("category_id", categoryId)
    .eq("status", "published")
    .order("rank", { ascending: true })
    .limit(10);

  if (error) {
    console.error("Failed to load videos", error);
    return [];
  }
  return (data ?? []) as Video[];
}

// A video the user navigates to directly (carousel, search result) may not be
// in its category's current top-10 `rank` list — fetch it explicitly instead
// of silently falling back to a different video.
async function getVideoById(id: string): Promise<Video | null> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) return null;
  return data as Video | null;
}

// Recency-first: pull the most recently published videos across every
// category, then rank that recent pool by view count so the carousel favors
// fresh AND popular content rather than old viral hits.
async function getCarouselVideos(): Promise<CarouselVideo[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("id, title, thumbnail_url, view_count, published_at, categories(slug, name)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(60);

  if (error || !data) {
    console.error("Failed to load carousel videos", error);
    return [];
  }

  return data
    .map((v) => {
      const category = Array.isArray(v.categories) ? v.categories[0] : v.categories;
      if (!category) return null;
      return {
        id: v.id as string,
        title: v.title as string,
        thumbnail_url: v.thumbnail_url as string | null,
        view_count: (v.view_count as number) ?? 0,
        category_slug: category.slug as string,
        category_name: category.name as string,
      };
    })
    .filter((v): v is CarouselVideo => v !== null)
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, 20);
}

// Searches the "실전 방법" fields (summary_points/tool_features) plus
// title/summary/hook/takeaway. Videos are few enough (~200) to filter in
// memory rather than needing Postgres full-text search.
async function searchVideos(query: string): Promise<SearchVideo[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*, categories(slug, name)")
    .eq("status", "published");

  if (error || !data) return [];

  const q = query.trim().toLowerCase();
  if (!q) return [];

  return data
    .map((v) => {
      const category = Array.isArray(v.categories) ? v.categories[0] : v.categories;
      return {
        ...(v as Video),
        category_slug: (category?.slug as string) ?? "",
        category_name: (category?.name as string) ?? "",
      };
    })
    .filter((v) => {
      const haystacks = [
        v.title,
        v.summary,
        v.hook,
        v.takeaway,
        ...(v.summary_points ?? []),
        ...(v.tool_features ?? []),
      ];
      return haystacks.some((s) => s?.toLowerCase().includes(q));
    });
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string; video?: string; q?: string };
}) {
  const query = searchParams.q?.trim() ?? "";

  if (query) {
    const results = await searchVideos(query);
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          &ldquo;{query}&rdquo; 검색 결과 ({results.length}건)
        </h1>
        {results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
            일치하는 실전 방법을 찾지 못했습니다. 다른 키워드로 검색해보세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((video) => (
              <VideoCard key={video.id} video={video} categorySlug={video.category_slug} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // A category/video deep link (from the carousel or a shared link) should
  // land directly on that content, not on the marketing hero — showing the
  // hero on every navigation made it feel like every click "reset" back to
  // the landing page.
  const isDeepLink = Boolean(searchParams.category);

  const [categories, carouselVideos] = await Promise.all([
    getCategories(),
    isDeepLink ? Promise.resolve([]) : getCarouselVideos(),
  ]);

  const selectedCategory =
    categories.find((c) => c.slug === searchParams.category) ?? categories[0] ?? null;

  const videos = selectedCategory ? await getVideosForCategory(selectedCategory.id) : [];
  let selectedVideo = videos.find((v) => v.id === searchParams.video) ?? null;
  if (!selectedVideo && searchParams.video) {
    selectedVideo = await getVideoById(searchParams.video);
  }
  if (!selectedVideo) selectedVideo = videos[0] ?? null;

  return (
    <div className="flex flex-col gap-10">
      {!isDeepLink && (
        <>
          <section className="text-center py-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
              오늘의 AI, 나두 써본다
            </h1>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto dark:text-gray-400">
              챗GPT부터 미드저니, 커서까지 — 매일 업데이트되는 유튜브 영상을 AI가 요약해
              핵심만 빠르게 알려드립니다.
            </p>
          </section>

          {/* guidebook_footer: repurposed as the above-carousel slot since the
              guidebook feature (and its footer ad) was removed. */}
          <AdBanner placement="guidebook_footer" />

          <TopCarousel videos={carouselVideos} />

          <AdBanner placement="home_top" />
        </>
      )}

      {categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          <p className="font-medium">아직 등록된 카테고리가 없습니다.</p>
          <p className="mt-1 text-sm">
            수집기가 첫 실행되면 카테고리와 영상이 자동으로 채워집니다.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[180px_1fr_400px]">
          <div className="lg:border-r lg:border-gray-100 lg:pr-4 dark:lg:border-gray-800">
            <CategoryMenu categories={categories} selectedSlug={selectedCategory?.slug ?? ""} />
          </div>

          <div className="flex flex-col gap-3">
            {selectedCategory && (
              <div className="flex items-center gap-2 pb-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {selectedCategory.name}
                </h2>
                {selectedCategory.is_trend && (
                  <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">
                    트렌드
                  </span>
                )}
                {TOOL_SITE_URLS[selectedCategory.slug] && (
                  <a
                    href={TOOL_SITE_URLS[selectedCategory.slug]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
                  >
                    바로가기 ↗
                  </a>
                )}
              </div>
            )}
            {videos.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                아직 수집된 영상이 없습니다. 곧 업데이트될 예정입니다.
              </div>
            ) : (
              <>
                {videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    categorySlug={selectedCategory!.slug}
                    selected={video.id === selectedVideo?.id}
                  />
                ))}
                <AdBanner placement="video_list_bottom" />
              </>
            )}
          </div>

          <div className="lg:border-l lg:border-gray-100 lg:pl-4 dark:lg:border-gray-800">
            <SummaryPanel video={selectedVideo} />
          </div>
        </section>
      )}

      {!isDeepLink && <AdBanner placement="home_bottom" />}
    </div>
  );
}
