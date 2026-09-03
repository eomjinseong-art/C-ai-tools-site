"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { CarouselVideo } from "@/lib/types";
import { formatViewCount } from "@/lib/format";
import { compactThumbnail } from "@/lib/thumbnails";

const AUTO_SLIDE_MS = 4000;

export type { CarouselVideo };

export default function TopCarousel({ videos }: { videos: CarouselVideo[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videos.length <= 1) return;
    const track = trackRef.current;
    if (!track) return;

    const timer = setInterval(() => {
      const tile = track.querySelector<HTMLElement>("[data-tile]");
      const tileWidth = tile ? tile.offsetWidth + 16 /* gap-4 */ : track.clientWidth;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      track.scrollTo({
        left: atEnd ? 0 : track.scrollLeft + tileWidth,
        behavior: "smooth",
      });
    }, AUTO_SLIDE_MS);

    return () => clearInterval(timer);
  }, [videos.length]);

  function scrollByTile(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const tile = track.querySelector<HTMLElement>("[data-tile]");
    const tileWidth = tile ? tile.offsetWidth + 16 : track.clientWidth;
    track.scrollBy({ left: direction * tileWidth, behavior: "smooth" });
  }

  if (videos.length === 0) return null;

  return (
    <section className="relative">
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((video, index) => {
          const src = compactThumbnail(video.thumbnail_url);
          return (
            <Link
              key={video.id}
              data-tile
              href={`/video/${video.id}`}
              prefetch={false}
              className="group relative w-64 shrink-0 snap-start overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={video.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                    loading={index < 4 ? "eager" : "lazy"}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm dark:text-gray-500">
                    썸네일 없음
                  </div>
                )}
                <span className="absolute top-2 left-2 rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">
                  {video.category_name}
                </span>
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {video.title}
                </p>
                {formatViewCount(video.view_count) && (
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    {formatViewCount(video.view_count)}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {videos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="이전 영상"
            onClick={() => scrollByTile(-1)}
            className="absolute left-0 top-1/2 hidden -translate-y-1/2 -translate-x-3 rounded-full border border-gray-200 bg-white p-2 shadow hover:bg-gray-50 sm:flex dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="다음 영상"
            onClick={() => scrollByTile(1)}
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-3 rounded-full border border-gray-200 bg-white p-2 shadow hover:bg-gray-50 sm:flex dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            →
          </button>
        </>
      )}
    </section>
  );
}
