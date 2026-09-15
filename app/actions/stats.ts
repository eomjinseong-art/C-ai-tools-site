"use server";

import { supabaseMutate } from "@/lib/supabaseMutate";

export async function recordCategoryClick(slug: string): Promise<void> {
  if (!/^[a-z0-9-]+$/.test(slug)) return;
  try {
    await supabaseMutate.rpc("increment_category_clicks", { p_slug: slug });
  } catch {
    // Non-critical analytics write.
  }
}
