import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

// Read-only client: RLS policies restrict every table to public, published rows.
// Falls back to placeholder values so the client can construct (and the build can
// collect page data) even when env vars aren't set yet; queries will simply fail
// and each page's error handling renders its empty state.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: { persistSession: false },
    // Time-based revalidation instead of no-store: every public read (categories,
    // videos, ads, carousel) can now be served from Next's Data Cache for up to
    // 60s, cutting a Supabase round-trip out of most page loads. This still
    // avoids the old "cached forever across deployments" risk (revalidate
    // guarantees a max 60s staleness), and admin writes (ads/videos) already
    // call revalidatePath("/") on save for immediate invalidation -- see
    // app/admin/ads/actions.ts and app/admin/videos/actions.ts.
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 60 } }),
    },
  }
);
