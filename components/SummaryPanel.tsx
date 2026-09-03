import type { Video } from "@/lib/types";
import AdBanner from "@/components/AdBanner";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { formatViewCount, formatPublishedDate, formatDuration, joinMeta } from "@/lib/format";

export default function SummaryPanel({ video }: { video: Video | null }) {
  if (!video) {
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          왼쪽에서 영상을 선택하면 여기에 AI 요약이 표시됩니다.
        </div>
        <AdBanner placement="category_sidebar_1" />
        <AdBanner placement="category_sidebar_2" />
        <AdBanner placement="category_sidebar_3" />
        <AdBanner placement="category_sidebar_4" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <YouTubeEmbed
        youtubeId={video.youtube_id}
        title={video.title}
        thumbnailUrl={video.thumbnail_url}
      />

      <AdBanner placement="video_inline" />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{video.title}</h2>
          {video.difficulty && (
            <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
              {video.difficulty}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
          {video.channel_title && video.channel_id ? (
            <a
              href={`https://www.youtube.com/channel/${video.channel_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-brand-600 hover:underline dark:hover:text-brand-400"
            >
              {video.channel_title}
            </a>
          ) : (
            video.channel_title && <span>{video.channel_title}</span>
          )}
          {joinMeta(
            formatViewCount(video.view_count),
            formatPublishedDate(video.published_at),
            formatDuration(video.duration_seconds),
          )
            .split(" · ")
            .filter(Boolean)
            .map((part) => (
              <span key={part}>
                <span className="mx-0.5">·</span>
                {part}
              </span>
            ))}
          <span>·</span>
          <a
            href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-600 hover:underline dark:hover:text-brand-400"
          >
            유튜브 원본 ↗
          </a>
        </div>
      </div>

      {video.hook && (
        <p className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-medium leading-relaxed text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-400">
          {video.hook}
        </p>
      )}

      {video.summary && (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">AI 요약</h3>
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap dark:text-gray-300">
            {video.summary}
          </p>
          {video.summary_points && video.summary_points.length > 0 && (
            <ul className="mt-3 flex flex-col gap-1.5">
              {video.summary_points.map((point, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-brand-600 dark:text-brand-400">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {video.tool_features && video.tool_features.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">주요 기능</h3>
          <ul className="flex flex-col gap-1.5">
            {video.tool_features.map((feature, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-brand-600 dark:text-brand-400">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {video.takeaway && (
        <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm italic text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          &ldquo;{video.takeaway}&rdquo;
        </p>
      )}

      <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <AdBanner placement="category_sidebar_1" />
        <AdBanner placement="category_sidebar_2" />
        <AdBanner placement="category_sidebar_3" />
        <AdBanner placement="category_sidebar_4" />
      </div>
    </div>
  );
}
