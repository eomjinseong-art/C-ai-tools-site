-- Run once in Supabase → SQL Editor.
-- Tracks which videos have already been posted to the blog.

create table if not exists public.blog_exports (
  video_id uuid primary key references public.videos (id) on delete cascade,
  posted_at timestamptz not null default now(),
  blog_url text
);

alter table public.blog_exports enable row level security;
