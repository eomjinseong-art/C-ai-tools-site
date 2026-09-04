"use client";

import { useState } from "react";
import { youtubePoster } from "@/lib/thumbnails";

export default function YouTubeEmbed({
  youtubeId,
  title,
  thumbnailUrl,
}: {
  youtubeId: string;
  title: string;
  thumbnailUrl?: string | null;
}) {
  const [playing, setPlaying] = useState(false);
  const poster = youtubePoster(youtubeId, thumbnailUrl);

  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="group relative aspect-video w-full overflow-hidden rounded-xl bg-black"
        aria-label={`${title} 재생`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={poster} alt="" className="h-full w-full object-cover" />
        <span className="absolute inset-0 flex items-center justify-center bg-black/35 transition group-hover:bg-black/45">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-lg font-semibold text-brand-600">
            ▶
          </span>
        </span>
      </button>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
