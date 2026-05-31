create extension if not exists "pgcrypto";

create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Nossa História',
  created_at timestamptz not null default now(),
  cover_image text null
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums(id) on delete cascade,
  page_number integer not null,
  layout_type text not null default 'full',
  created_at timestamptz not null default now(),
  unique (album_id, page_number)
);

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  type text not null,
  title text null,
  description text null,
  memory_date date null,
  media_url text null,
  thumbnail_url text null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.albums enable row level security;
alter table public.pages enable row level security;
alter table public.memories enable row level security;

drop policy if exists "albums_select_own" on public.albums;
create policy "albums_select_own"
on public.albums
for select
using (auth.uid() = user_id);

drop policy if exists "albums_insert_own" on public.albums;
create policy "albums_insert_own"
on public.albums
for insert
with check (auth.uid() = user_id);

drop policy if exists "albums_update_own" on public.albums;
create policy "albums_update_own"
on public.albums
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "albums_delete_own" on public.albums;
create policy "albums_delete_own"
on public.albums
for delete
using (auth.uid() = user_id);

drop policy if exists "pages_select_own" on public.pages;
create policy "pages_select_own"
on public.pages
for select
using (
  exists (
    select 1
    from public.albums a
    where a.id = pages.album_id
      and a.user_id = auth.uid()
  )
);

drop policy if exists "pages_insert_own" on public.pages;
create policy "pages_insert_own"
on public.pages
for insert
with check (
  exists (
    select 1
    from public.albums a
    where a.id = pages.album_id
      and a.user_id = auth.uid()
  )
);

drop policy if exists "pages_update_own" on public.pages;
create policy "pages_update_own"
on public.pages
for update
using (
  exists (
    select 1
    from public.albums a
    where a.id = pages.album_id
      and a.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.albums a
    where a.id = pages.album_id
      and a.user_id = auth.uid()
  )
);

drop policy if exists "pages_delete_own" on public.pages;
create policy "pages_delete_own"
on public.pages
for delete
using (
  exists (
    select 1
    from public.albums a
    where a.id = pages.album_id
      and a.user_id = auth.uid()
  )
);

drop policy if exists "memories_select_own" on public.memories;
create policy "memories_select_own"
on public.memories
for select
using (
  exists (
    select 1
    from public.pages p
    join public.albums a on a.id = p.album_id
    where p.id = memories.page_id
      and a.user_id = auth.uid()
  )
);

drop policy if exists "memories_insert_own" on public.memories;
create policy "memories_insert_own"
on public.memories
for insert
with check (
  exists (
    select 1
    from public.pages p
    join public.albums a on a.id = p.album_id
    where p.id = memories.page_id
      and a.user_id = auth.uid()
  )
);

drop policy if exists "memories_update_own" on public.memories;
create policy "memories_update_own"
on public.memories
for update
using (
  exists (
    select 1
    from public.pages p
    join public.albums a on a.id = p.album_id
    where p.id = memories.page_id
      and a.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.pages p
    join public.albums a on a.id = p.album_id
    where p.id = memories.page_id
      and a.user_id = auth.uid()
  )
);

drop policy if exists "memories_delete_own" on public.memories;
create policy "memories_delete_own"
on public.memories
for delete
using (
  exists (
    select 1
    from public.pages p
    join public.albums a on a.id = p.album_id
    where p.id = memories.page_id
      and a.user_id = auth.uid()
  )
);
