-- =========================================================
-- クラウド保存（shared/cloud.js）用のテーブル。Supabase の SQL Editor に貼って Run（1回だけ）。
-- 手順は docs/クラウド保存.md。
--   kv          端末の localStorage のキー1つ＝1行（人ごと）
--   kv_history  前の版（1時間に1回まで自動で残す）と、同期でぶつかって負けた版。30日で消える
-- =========================================================

create table if not exists public.kv (
  user_id    uuid not null default auth.uid() references auth.users on delete cascade,
  key        text not null,
  value      text,                      -- null は「消した」
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);
create index if not exists kv_updated on public.kv (user_id, updated_at);

create table if not exists public.kv_history (
  id       bigint generated always as identity primary key,
  user_id  uuid not null default auth.uid() references auth.users on delete cascade,
  key      text not null,
  value    text,
  reason   text,
  saved_at timestamptz not null default now()
);
create index if not exists kv_history_key on public.kv_history (user_id, key, saved_at desc);

-- 自分の行だけ読み書きできる
alter table public.kv enable row level security;
alter table public.kv_history enable row level security;
drop policy if exists kv_own on public.kv;
create policy kv_own on public.kv for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists kv_history_read on public.kv_history;
create policy kv_history_read on public.kv_history for select to authenticated using (user_id = auth.uid());
drop policy if exists kv_history_add on public.kv_history;
create policy kv_history_add on public.kv_history for insert to authenticated with check (user_id = auth.uid());
drop policy if exists kv_history_trim on public.kv_history;
create policy kv_history_trim on public.kv_history for delete to authenticated using (user_id = auth.uid());

-- 書きこみ。p_expected は「この端末が最後に見たクラウドの更新時刻」（はじめてのキーは null）。
-- 他の端末が先に書いていたら何もせず null を返す（端末側で取りこんでから、もう一度書く）。
create or replace function public.kv_put(p_key text, p_value text, p_expected timestamptz)
returns timestamptz
language plpgsql
security invoker
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  cur public.kv%rowtype;
  ts  timestamptz := clock_timestamp();
begin
  if uid is null then raise exception 'not signed in'; end if;
  select * into cur from public.kv where user_id = uid and key = p_key for update;
  if found then
    if p_expected is distinct from cur.updated_at then return null; end if;
    if cur.value is not null and not exists (
      select 1 from public.kv_history
      where user_id = uid and key = p_key and reason = 'auto' and saved_at > ts - interval '1 hour'
    ) then
      insert into public.kv_history (user_id, key, value, reason) values (uid, p_key, cur.value, 'auto');
      delete from public.kv_history where user_id = uid and saved_at < ts - interval '30 days';
    end if;
    update public.kv set value = p_value, updated_at = ts where user_id = uid and key = p_key;
  else
    if p_expected is not null then return null; end if;
    insert into public.kv (user_id, key, value, updated_at) values (uid, p_key, p_value, ts)
      on conflict (user_id, key) do nothing;
    if not found then return null; end if;
  end if;
  return ts;
end;
$$;

revoke all on function public.kv_put(text, text, timestamptz) from public, anon;
grant execute on function public.kv_put(text, text, timestamptz) to authenticated;
