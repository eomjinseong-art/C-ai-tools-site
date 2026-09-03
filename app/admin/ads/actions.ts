"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePublicPaths } from "@/lib/revalidatePublic";

export async function saveAd(formData: FormData) {
  requireAdmin();

  const placement = String(formData.get("placement") || "");
  if (!placement) throw new Error("Missing placement");

  const row = {
    placement,
    name: String(formData.get("name") || placement),
    image_url: String(formData.get("image_url") || ""),
    link_url: String(formData.get("link_url") || ""),
    alt_text: String(formData.get("alt_text") || "") || null,
    is_active: formData.get("is_active") === "on",
  };

  const { data: existing } = await supabaseAdmin
    .from("ads")
    .select("id")
    .eq("placement", placement)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin.from("ads").update(row).eq("id", existing.id);
  } else {
    await supabaseAdmin.from("ads").insert(row);
  }

  revalidatePath("/admin/ads");
  revalidatePublicPaths();
}
