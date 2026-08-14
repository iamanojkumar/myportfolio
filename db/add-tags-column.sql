-- Run once in the Supabase SQL editor before using the project tag filters.
alter table public.projects
  add column if not exists tags text[] not null default '{}'::text[];
