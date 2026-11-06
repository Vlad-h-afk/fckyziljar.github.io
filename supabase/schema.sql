create table if not exists kz_profiles(
  id uuid primary key references auth.users on delete cascade,
  name text not null,
  role text not null check (role in ('Тренер','Родитель','Скаут','Админ')),
  email text, phone text, team text, lic text, region text, child int, photo text,
  created_at timestamptz default now());

create table if not exists kz_players(
  id bigint generated always as identity primary key,
  name text not null, team text, pos text,
  skills int[] not null default '{60,60,60,60,60,60,60}',
  goals int default 0, assists int default 0, matches int default 0, attendance int default 90,
  age int, height int, weight int, potential int default 70);

alter table kz_profiles enable row level security;
alter table kz_players enable row level security;

create or replace function kz_is_staff() returns boolean language sql security definer set search_path=public as $$
  select exists(select 1 from kz_profiles where id=auth.uid() and role in ('Тренер','Админ')) $$;

drop policy if exists "profile read" on kz_profiles;
create policy "profile read" on kz_profiles for select to authenticated using (id=auth.uid() or kz_is_staff());
drop policy if exists "profile insert" on kz_profiles;
create policy "profile insert" on kz_profiles for insert to authenticated with check (id=auth.uid());
drop policy if exists "profile update" on kz_profiles;
create policy "profile update" on kz_profiles for update to authenticated using (id=auth.uid()) with check (id=auth.uid());
drop policy if exists "kz_players read" on kz_players;
create policy "kz_players read" on kz_players for select to authenticated using (true);
drop policy if exists "kz_players write" on kz_players;
create policy "kz_players write" on kz_players for all to authenticated using (kz_is_staff()) with check (kz_is_staff());
