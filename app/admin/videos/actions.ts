"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePublicPaths } from "@/lib/revalidatePublic";

export async function deleteVideo(formData: FormData) {
  requireAdmin();

  const videoId = String(formData.get("video_id") || "");
  if (!videoId) throw new Error("Missing video_id");

  // Also blocklist so the next collector run doesn't just re-add it.
  const { data: video } = await supabaseAdmin
    .from("videos")
    .select("youtube_id")
    .eq("id", videoId)
    .maybeSingle();

  await supabaseAdmin.from("videos").delete().eq("id", videoId);

  if (video?.youtube_id) {
    await supabaseAdmin
      .from("excluded_videos")
      .upsert({ youtube_id: video.youtube_id, reason: "관리자 삭제" }, { onConflict: "youtube_id" });
  }

  revalidatePath("/admin/videos");
  revalidatePublicPaths();
}
