-- Run once in a new Keertana Supabase project. No site/user-account tables are required.
begin;
create schema if not exists keertana_private;
revoke all on schema keertana_private from public, anon, authenticated;
grant usage on schema keertana_private to service_role;

create table keertana_private.song_comments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  song_slug text not null check (length(song_slug) <= 150 and song_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  display_name text not null check (length(btrim(display_name)) between 1 and 60),
  body text not null check (length(btrim(body)) between 5 and 2000),
  reference_url text not null default '' check (length(reference_url) <= 1000 and (reference_url = '' or reference_url ~ '^https://')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  moderation_note text not null default ''
);
alter table keertana_private.song_comments enable row level security;
revoke all on keertana_private.song_comments from public, anon, authenticated;
grant select, insert, update, delete on keertana_private.song_comments to service_role;
create index song_comments_approved on keertana_private.song_comments(song_slug, approved_at desc, id desc) where status = 'approved';
create index song_comments_created on keertana_private.song_comments(created_at desc);

create function keertana_private.set_comment_approval() returns trigger language plpgsql set search_path = '' as $$
begin
  if new.status = 'approved' and (tg_op = 'INSERT' or old.status <> 'approved' or new.approved_at is null) then new.approved_at := now();
  elsif new.status <> 'approved' then new.approved_at := null;
  end if;
  return new;
end;
$$;
create trigger comment_approval before insert or update on keertana_private.song_comments for each row execute function keertana_private.set_comment_approval();

create function public.keertana_submit_comment(p_request_id uuid, p_song text, p_display_name text, p_body text, p_reference_url text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare existing keertana_private.song_comments; result_id uuid;
begin
  -- One transactional lock prevents parallel requests from racing the admission limits.
  perform pg_advisory_xact_lock(17706601);
  select * into existing from keertana_private.song_comments where request_id = p_request_id;
  if found then
    if existing.song_slug = p_song and existing.display_name = p_display_name and existing.body = p_body and existing.reference_url = p_reference_url then return existing.id; end if;
    raise exception 'COMMENT_DRAFT_CHANGED';
  end if;
  if (select count(*) from keertana_private.song_comments where created_at > now() - interval '1 hour') >= 100
     or (select count(*) from keertana_private.song_comments where song_slug = p_song and created_at > now() - interval '1 hour') >= 20 then
    raise exception 'COMMENT_RATE_LIMIT';
  end if;
  insert into keertana_private.song_comments(request_id, song_slug, display_name, body, reference_url, status)
  values (p_request_id, p_song, p_display_name, p_body, p_reference_url, 'pending') returning id into result_id;
  return result_id;
end;
$$;

create function public.keertana_read_comments(p_song text, p_before_at timestamptz default null, p_before_id uuid default null)
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce(jsonb_agg(jsonb_build_object('id', c.id, 'displayName', c.display_name, 'body', c.body,
    'referenceUrl', c.reference_url, 'createdAt', c.approved_at) order by c.approved_at desc, c.id desc), '[]'::jsonb)
  from (select id, display_name, body, reference_url, approved_at from keertana_private.song_comments
    where song_slug = p_song and status = 'approved'
      and (p_before_at is null or (approved_at, id) < (p_before_at, p_before_id))
    order by approved_at desc, id desc limit 11) c;
$$;

revoke all on function public.keertana_submit_comment(uuid,text,text,text,text) from public, anon, authenticated;
revoke all on function public.keertana_read_comments(text,timestamptz,uuid) from public, anon, authenticated;
grant execute on function public.keertana_submit_comment(uuid,text,text,text,text) to service_role;
grant execute on function public.keertana_read_comments(text,timestamptz,uuid) to service_role;
revoke all on function keertana_private.set_comment_approval() from public, anon, authenticated;
commit;
