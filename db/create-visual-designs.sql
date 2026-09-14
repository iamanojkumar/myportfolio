-- Visual design showcase: a lightweight image gallery, separate from `projects`.
-- Run by hand in the Supabase SQL editor.

create table if not exists visual_designs (
  id uuid primary key,
  title text,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists visual_designs_sort_order_idx on visual_designs (sort_order, created_at);
