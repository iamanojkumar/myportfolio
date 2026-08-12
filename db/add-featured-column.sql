-- Run once in the Supabase SQL editor before using the "Featured project" toggle.
alter table public.projects
  add column if not exists featured boolean not null default false;
