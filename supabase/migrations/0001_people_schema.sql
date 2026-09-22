-- People — Open Speech & Community Platform
-- Migration 0001: core schema with RLS
-- Run in Supabase SQL editor or via supabase db push

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- PROFILES -------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  alias text unique not null,
  reputation integer not null default 0,
  verified_badge boolean not null default false,
  encryption_level text not null default 'AES-256',
  created_at timestamptz not null default now()
);

-- CORES (groups) -------------------------------------------------
create table if not exists public.cores (
  id text primary key,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  rules text[] not null default '{}',
  accent_color text not null default '#6d778b',
  gradient text not null default 'linear-gradient(135deg, #8b97ad, #4f5869)',
  layout text not null default 'grid' check (layout in ('grid','compact')),
  icon_name text not null default 'Hexagon',
  created_at timestamptz not null default now()
);

-- POSTS ----------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  core_id text not null references public.cores(id) on delete cascade,
  author_alias text not null,
  content text not null check (char_length(content) >= 1 and char_length(content) <= 5000),
  flames_count integer not null default 0,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists posts_core_created_idx on public.posts(core_id, created_at desc);
create index if not exists posts_author_idx on public.posts(author_alias);

-- COMMENTS -------------------------------------------------------
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_alias text not null,
  content text not null check (char_length(content) >= 1 and char_length(content) <= 2000),
  created_at timestamptz not null default now()
);
create index if not exists comments_post_idx on public.comments(post_id, created_at asc);

-- LIVE DISCUSSIONS ----------------------------------------------
create table if not exists public.live_discussions (
  id uuid primary key default gen_random_uuid(),
  core_id text not null references public.cores(id) on delete cascade,
  title text not null check (char_length(title) >= 3 and char_length(title) <= 140),
  about text not null default '',
  creator_alias text not null,
  active_participants integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists live_core_idx on public.live_discussions(core_id, created_at desc);

-- LIVE MESSAGES --------------------------------------------------
create table if not exists public.live_messages (
  id uuid primary key default gen_random_uuid(),
  discussion_id uuid not null references public.live_discussions(id) on delete cascade,
  sender_alias text not null,
  text text not null check (char_length(text) >= 1 and char_length(text) <= 2000),
  created_at timestamptz not null default now()
);
create index if not exists live_msg_disc_idx on public.live_messages(discussion_id, created_at asc);

-- ADMIN SETTINGS -------------------------------------------------
create table if not exists public.admin_settings (
  id text primary key,
  master_passkey_hash text not null,
  authorized_roster text[] not null default '{}'
);

-- FLAME VOTES (prevent double-flame via localStorage + optional table)
create table if not exists public.flames (
  post_id uuid not null references public.posts(id) on delete cascade,
  voter_alias text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, voter_alias)
);

-- ROW LEVEL SECURITY ---------------------------------------------
alter table public.profiles enable row level security;
alter table public.cores enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.live_discussions enable row level security;
alter table public.live_messages enable row level security;
alter table public.admin_settings enable row level security;
alter table public.flames enable row level security;

-- Public read for community content (pseudonymous open speech)
drop policy if exists "public read profiles" on public.profiles;
create policy "public read profiles" on public.profiles for select using (true);
drop policy if exists "open insert profiles" on public.profiles;
create policy "open insert profiles" on public.profiles for insert with check (true);
drop policy if exists "open update profiles" on public.profiles;
create policy "open update profiles" on public.profiles for update using (true);

drop policy if exists "public read cores" on public.cores;
create policy "public read cores" on public.cores for select using (true);
drop policy if exists "open write cores" on public.cores;
create policy "open write cores" on public.cores for all using (true) with check (true);

drop policy if exists "public read posts" on public.posts;
create policy "public read posts" on public.posts for select using (true);
drop policy if exists "open write posts" on public.posts;
create policy "open write posts" on public.posts for all using (true) with check (true);

drop policy if exists "public read comments" on public.comments;
create policy "public read comments" on public.comments for select using (true);
drop policy if exists "open write comments" on public.comments;
create policy "open write comments" on public.comments for all using (true) with check (true);

drop policy if exists "public read live" on public.live_discussions;
create policy "public read live" on public.live_discussions for select using (true);
drop policy if exists "open write live" on public.live_discussions;
create policy "open write live" on public.live_discussions for all using (true) with check (true);

drop policy if exists "public read live msgs" on public.live_messages;
create policy "public read live msgs" on public.live_messages for select using (true);
drop policy if exists "open write live msgs" on public.live_messages;
create policy "open write live msgs" on public.live_messages for all using (true) with check (true);

drop policy if exists "open flames" on public.flames;
create policy "open flames" on public.flames for all using (true) with check (true);

-- admin_settings: readable publicly (needed for roster check), writes open
-- (master gate enforced in app layer via SHA-256 hash comparison)
drop policy if exists "open admin_settings" on public.admin_settings;
create policy "open admin_settings" on public.admin_settings for all using (true) with check (true);

-- REALTIME --------------------------------------------------------
-- Enable via Dashboard > Database > Replication, or:
-- alter publication supabase_realtime add table public.posts, public.comments, public.live_messages, public.live_discussions;
