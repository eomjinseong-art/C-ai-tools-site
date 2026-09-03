"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function saveKeywords(formData: FormData) {
  requireAdmin();

  const categoryId = String(formData.get("category_id") || "");
  const raw = String(formData.get("keywords") || "");
  const keywords = raw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  if (!categoryId) throw new Error("Missing category_id");

  await supabaseAdmin.from("categories").update({ search_keywords: keywords }).eq("id", categoryId);

  revalidatePath("/admin/keywords");
}
