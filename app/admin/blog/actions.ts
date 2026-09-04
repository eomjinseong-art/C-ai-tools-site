"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function markBlogPosted(formData: FormData) {
  requireAdmin();
  const videoId = String(formData.get("video_id") || "");
  if (!videoId) throw new Error("Missing video_id");

  const { error } = await supabaseAdmin.from("blog_exports").upsert(
    { video_id: videoId, posted_at: new Date().toISOString() },
    { onConflict: "video_id" },
  );
  if (error) throw new Error(error.message);

  revalidatePath("/admin/blog");
}

export async function unmarkBlogPosted(formData: FormData) {
  requireAdmin();
  const videoId = String(formData.get("video_id") || "");
  if (!videoId) throw new Error("Missing video_id");

  const { error } = await supabaseAdmin.from("blog_exports").delete().eq("video_id", videoId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/blog");
}
