import { cache } from "react";
import { supabase } from "@/lib/supabase";
import type { Ad, AdPlacement } from "@/lib/types";
import { isFamilyUrl } from "@/lib/family";

function isAdLive(ad: Ad, nowMs: number): boolean {
  if (ad.starts_at && new Date(ad.starts_at).getTime() > nowMs) return false;
  if (ad.ends_at && new Date(ad.ends_at).getTime() < nowMs) return false;
  return true;
}

export const getActiveAds = cache(async (): Promise<Map<AdPlacement, Ad>> => {
  const { data, error } = await supabase
    .from("ads")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const map = new Map<AdPlacement, Ad>();
  if (error || !data) return map;

  const nowMs = Date.now();
  for (const row of data as Ad[]) {
    if (!isAdLive(row, nowMs)) continue;
    // Hub policy: only 나두 family promos, no unrelated shopping ads.
    if (!isFamilyUrl(row.link_url)) continue;
    if (!map.has(row.placement)) map.set(row.placement, row);
  }
  return map;
});

export async function getActiveAd(placement: AdPlacement): Promise<Ad | null> {
  const ads = await getActiveAds();
  return ads.get(placement) ?? null;
}
